import os
import requests
from io import BytesIO
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
    answers: list

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

@app.get("/")
async def root():
    return {"status": "ok", "message": "Memoir API is running"}

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

@app.post("/generate-book")
async def generate_book(data: GenerateBookRequest):
    try:
        print(f"Используем шрифт: {FONT_PATH}")
        
        # 1. Литературная обработка
        full_raw_text = "\n\n".join([f"Вопрос: {a.get('questionId')}\nОтвет: {a.get('text')}" for a in data.answers])
        narrative_prompt = (
            "Ты — профессиональный корректор. Твоя задача: собрать разрозненные ответы в единый текст, исправляя ГРАММАТИКУ, ПУНКТУАЦИЮ и ЛОГИКУ.\n"
            "СТРОГИЕ ТРЕБОВАНИЯ:\n"
            "1. ЗАПРЕЩЕНО добавлять любую информацию, которой нет в ответах. Никаких 'солнечных дней', 'глубоких раздумий' или 'красочных закатов', если автор об этом не писал.\n"
            "2. СОХРАНЯЙ оригинальный голос автора. Не пытайся сделать текст 'литературным' или 'художественным' за счет добавления новых слов.\n"
            "3. ИСПРАВЛЯЙ только ошибки и опечатки. Устраняй повторы и связывай абзацы логическими переходами, но не новыми фактами.\n"
            "4. Результатом должен быть чистый, грамотный авторский текст. Ни слова от ИИ.\n\n"
            f"ОТВЕТЫ АВТОРА:\n{full_raw_text}"
        )

        ai_response = model.generate_content(narrative_prompt)
        book_narrative = ai_response.text

        # 2. Создание PDF (оставляем как было)
        pdf = PDFBook()
        pdf.add_page()
        
        # Заголовок
        if "CustomArial" in pdf.fonts:
            pdf.set_font("CustomArial", size=24)
            pdf.cell(0, 40, txt=data.bookTitle, ln=True, align='C')
        else:
            pdf.set_font("Arial", "B", 24)
            pdf.cell(0, 40, txt="My Life Story", ln=True, align='C')
        
        pdf.ln(20)

        # Основной текст
        if "CustomArial" in pdf.fonts:
            pdf.set_font("CustomArial", size=12)
            pdf.multi_cell(0, 10, txt=book_narrative)
        else:
            # Если шрифта нет, пробуем хотя бы вывести текст (может упасть на кириллице)
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, txt=book_narrative.encode('latin-1', 'replace').decode('latin-1'))
        
        # Фотографии
        all_photos = [(ans.get('questionId'), url)
                      for ans in data.answers
                      for url in (ans.get('photoUrls') or [])]
        print(f"Photos to embed: {len(all_photos)}")

        if all_photos:
            pdf.add_page()
            if "CustomArial" in pdf.fonts:
                pdf.set_font("CustomArial", size=18)
                pdf.cell(0, 20, txt="Фотоархив", ln=True, align='C')
            else:
                pdf.set_font("Arial", size=18)
                pdf.cell(0, 20, txt="Photo Archive", ln=True, align='C')
            pdf.ln(5)

            for question_id, photo_url in all_photos:
                try:
                    resp = requests.get(photo_url, timeout=15)
                    resp.raise_for_status()
                    img_bytes = BytesIO(resp.content)
                    img_bytes.seek(0)
                    # запасной шаг: чтобы fpdf не путался с MIME из URL, дадим явное имя
                    pdf.image(img_bytes, w=150)
                    pdf.ln(10)
                    print(f"  [ok] embedded photo for question {question_id}")
                except Exception as photo_err:
                    print(f"  [fail] photo for {question_id}: {type(photo_err).__name__}: {photo_err}")
                    print(f"         url: {photo_url[:120]}...")

        file_path = f"book_{data.bookTitle}.pdf".replace(" ", "_")
        pdf.output(file_path)

        # 3. Почта
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")
        if email_user and email_pass:
            yag = yagmail.SMTP(email_user, email_pass)
            yag.send(to=data.email, subject=f"Ваша книга: {data.bookTitle}", attachments=file_path)
            return {"message": "Книга отправлена!", "polishedContent": book_narrative}
        
        return {"message": "PDF готов", "path": file_path, "polishedContent": book_narrative}

    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
