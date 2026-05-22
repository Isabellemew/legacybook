import os
import re
import requests
from io import BytesIO
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fpdf import FPDF
import yagmail

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')

class TextToFix(BaseModel):
    text: str

class GenerateBookRequest(BaseModel):
    email: str
    bookTitle: str
    chapters: list  # [{ chapterId, chapterTitle, answers: [{questionId, questionText, text, photoUrls}] }]

# Ищем шрифт Arial в системе Windows
POSSIBLE_FONTS = [
    "C:\\Windows\\Fonts\\arial.ttf",
    "C:\\Windows\\Fonts\\Arial.ttf",
    "C:\\Windows\\Fonts\\DejaVuSans.ttf"
]

FONT_PATH = next((f for f in POSSIBLE_FONTS if os.path.exists(f)), None)

class PDFBook(FPDF):
    def __init__(self):
        super().__init__()
        if FONT_PATH:
            self.add_font("CustomArial", "", FONT_PATH)
            self.set_font("CustomArial", size=12)
        else:
            self.set_font("Arial", size=12)

    def header(self):
        if "CustomArial" in self.fonts:
            self.set_font("CustomArial", size=10)
            self.cell(0, 10, 'Наследие: Твоя История', 0, 1, 'R')
        else:
            self.set_font("Arial", 'I', 10)
            self.cell(0, 10, 'Legacy: Your Story', 0, 1, 'R')
        self.ln(5)

BOOKS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "books")
os.makedirs(BOOKS_DIR, exist_ok=True)


def _book_file_path(title: str) -> str:
    safe_title = re.sub(r'[^\w\-]+', '_', title.strip(), flags=re.UNICODE).strip('_') or 'book'
    return os.path.join(BOOKS_DIR, f"book_{safe_title}.pdf")


@app.get("/")
async def root():
    return {"status": "ok", "message": "Memoir API is running"}


@app.get("/download-book")
async def download_book(title: str):
    path = _book_file_path(title)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Книга ещё не сгенерирована")
    filename = f"{title.strip() or 'book'}.pdf"
    return FileResponse(path, media_type="application/pdf", filename=filename)

@app.post("/fix")
async def fix_text(data: TextToFix):
    try:
        prompt = (
            "Ты — строгий редактор мемуаров. Твоя задача: исправить только ГРАММАТИЧЕСКИЕ, ПУНКТУАЦИОННЫЕ и ЛОГИЧЕСКИЕ ошибки.\n"
            "ПРАВИЛА:\n"
            "1. НЕ ДОБАВЛЯЙ ни одного нового факта, чувства или описания.\n"
            "2. НЕ МЕНЯЙ авторский стиль. Если предложение грамматически верно, оставь его как есть.\n"
            "3. НЕ ИСПОЛЬЗУЙ 'красивые' слова, которых не было в оригинале.\n"
            "4. Твой ответ должен содержать ТОЛЬКО исправленный текст, без комментариев.\n\n"
            f"ТЕКСТ ДЛЯ ИСПРАВЛЕНИЯ:\n{data.text}"
        )
        response = model.generate_content(prompt)
        return {"fixedText": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _polish_chapter_text(chapter_answers):
    """Полирует ответы одной главы. Промпт менять нельзя — пользователь подтвердил, что текущий идеален."""
    full_raw_text = "\n\n".join(
        f"Вопрос: {a.get('questionText') or a.get('questionId')}\nОтвет: {a.get('text', '')}"
        for a in chapter_answers
    )
    narrative_prompt = (
        "Ты — профессиональный корректор. Твоя задача: собрать разрозненные ответы в единый текст, исправляя ГРАММАТИКУ, ПУНКТУАЦИЮ и ЛОГИКУ.\n"
        "СТРОГИЕ ТРЕБОВАНИЯ:\n"
        "1. ЗАПРЕЩЕНО добавлять любую информацию, которой нет в ответах. Никаких 'солнечных дней', 'глубоких раздумий' или 'красочных закатов', если автор об этом не писал.\n"
        "2. СОХРАНЯЙ оригинальный голос автора. Не пытайся сделать текст 'литературным' или 'художественным' за счет добавления новых слов.\n"
        "3. ИСПРАВЛЯЙ только ошибки и опечатки. Устраняй повторы и связывай абзацы логическими переходами, но не новыми фактами.\n"
        "4. Результатом должен быть чистый, грамотный авторский текст. Ни слова от ИИ.\n\n"
        f"ОТВЕТЫ АВТОРА:\n{full_raw_text}"
    )
    return model.generate_content(narrative_prompt).text


def _write_text(pdf, text, size=12):
    if "CustomArial" in pdf.fonts:
        pdf.set_font("CustomArial", size=size)
        pdf.multi_cell(0, 10, txt=text)
    else:
        pdf.set_font("Arial", size=size)
        pdf.multi_cell(0, 10, txt=text.encode('latin-1', 'replace').decode('latin-1'))


def _write_heading(pdf, text, size, align='L'):
    if "CustomArial" in pdf.fonts:
        pdf.set_font("CustomArial", size=size)
        pdf.multi_cell(0, size * 0.6 + 6, txt=text, align=align)
    else:
        pdf.set_font("Arial", "B", size)
        pdf.multi_cell(0, size * 0.6 + 6, txt=text.encode('latin-1', 'replace').decode('latin-1'), align=align)


@app.post("/generate-book")
async def generate_book(data: GenerateBookRequest):
    try:
        print(f"Используем шрифт: {FONT_PATH}")
        print(f"Глав с ответами: {len(data.chapters)}")

        pdf = PDFBook()

        # Титульная страница
        pdf.add_page()
        pdf.ln(40)
        _write_heading(pdf, data.bookTitle, size=26, align='C')
        pdf.ln(10)

        polished_sections = []

        for chapter in data.chapters:
            chapter_title = chapter.get('chapterTitle') or chapter.get('chapterId', 'Глава')
            chapter_answers = chapter.get('answers') or []
            if not chapter_answers:
                continue

            print(f"  -> ИИ-полировка: {chapter_title} ({len(chapter_answers)} ответ(ов))")
            polished = _polish_chapter_text(chapter_answers).strip()
            polished_sections.append(f"{chapter_title}\n\n{polished}")

            # Каждая глава с новой страницы
            pdf.add_page()
            _write_heading(pdf, chapter_title, size=20)
            pdf.ln(6)
            _write_text(pdf, polished)

            # Фотографии главы — сразу под её текстом
            photos = [(a.get('questionId'), url)
                      for a in chapter_answers
                      for url in (a.get('photoUrls') or [])]
            if photos:
                pdf.ln(6)
                for question_id, photo_url in photos:
                    try:
                        resp = requests.get(photo_url, timeout=15)
                        resp.raise_for_status()
                        img_bytes = BytesIO(resp.content)
                        img_bytes.seek(0)
                        pdf.image(img_bytes, w=150)
                        pdf.ln(8)
                        print(f"     [ok] photo for {question_id}")
                    except Exception as photo_err:
                        print(f"     [fail] photo for {question_id}: {type(photo_err).__name__}: {photo_err}")

        file_path = _book_file_path(data.bookTitle)
        pdf.output(file_path)

        polished_content = "\n\n".join(polished_sections)

        # Почта
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")
        if email_user and email_pass:
            yag = yagmail.SMTP(email_user, email_pass)
            yag.send(to=data.email, subject=f"Ваша книга: {data.bookTitle}", attachments=file_path)
            return {"message": "Книга отправлена!", "polishedContent": polished_content}

        return {"message": "PDF готов", "path": file_path, "polishedContent": polished_content}

    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
