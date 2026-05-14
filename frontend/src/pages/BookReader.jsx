import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ArrowLeft, ChevronLeft, ChevronRight, Book as BookIcon } from 'lucide-react';

const BookReader = () => {
  const { bookId } = useParams();
  const [user] = useAuthState(auth);
  const [bookData, setBookData] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bookRef = useRef();

  useEffect(() => {
    const loadBookContent = async () => {
      if (!user || !bookId) return;
      
      try {
        // 1. Загружаем инфо о книге
        const bDoc = await getDoc(doc(db, "books", bookId));
        if (!bDoc.exists()) return;
        const bData = bDoc.data();
        setBookData(bData);

        // 2. Загружаем все ответы
        const q = query(collection(db, "answers"), where("bookId", "==", bookId));
        const qSnap = await getDocs(q);
        const answers = [];
        qSnap.forEach(d => answers.push(d.data()));

        // 3. Формируем страницы
        const bookPages = [];
        
        // Стр 1: Обложка
        bookPages.push({ type: 'cover', title: bData.title });
        
        // Стр 2: Предисловие
        if (bData.preface) {
          bookPages.push({ type: 'preface', content: bData.preface });
        }

        // Стр 3+: Контент
        if (bData.polishedContent) {
          // Если есть отполированный текст, разбиваем его на части для страниц
          const sections = bData.polishedContent.split('\n\n');
          sections.forEach((text, idx) => {
            if (text.trim()) {
              bookPages.push({ 
                type: 'content', 
                text: text, 
                photos: idx === 0 ? answers.flatMap(a => a.photoUrls || []) : [], // Фото в начале или распределим
                pageNumber: idx + 1
              });
            }
          });
        } else {
          // Иначе показываем сырые ответы
          answers.forEach((ans, idx) => {
            bookPages.push({ 
              type: 'content', 
              text: ans.text, 
              photos: ans.photoUrls || [],
              pageNumber: idx + 1
            });
          });
        }

        // Финальная страница
        bookPages.push({ type: 'end' });

        setPages(bookPages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBookContent();
  }, [user, bookId]);

  if (isLoading) return <div className="loading-screen">Открываем книгу...</div>;

  return (
    <div className="reader-page">
      <div className="reader-nav">
        <Link to={`/book/${bookId}`} className="back-link"><ArrowLeft size={18} /> К редактированию</Link>
        <h2 className="serif">{bookData?.title}</h2>
        <div className="reader-hint">Нажмите на край страницы, чтобы листать</div>
      </div>

      <div className="book-container">
        <HTMLFlipBook 
          width={250} 
          height={350} 
          size="stretch"
          minWidth={200}
          maxWidth={400}
          minHeight={280}
          maxHeight={600}
          maxShadowOpacity={0.15}
          showCover={true}
          mobileScrollSupport={true}
          ref={bookRef}
          className="flip-book"
          useMouseEvents={true}
          clickEventForward={true}
        >
          {pages.map((page, index) => (
            <div key={index} className={`page page-${page.type}`}>
              <div className="page-content">
                {page.type === 'cover' && (
                  <div className="cover-design">
                    <BookIcon size={80} className="cover-icon" />
                    <h1 className="serif">{page.title}</h1>
                    <div className="cover-footer">Мемуары</div>
                  </div>
                )}

                {page.type === 'preface' && (
                  <div className="preface-page">
                    <h2 className="serif">Предисловие</h2>
                    <div className="divider-line"></div>
                    <p>{page.content}</p>
                  </div>
                )}

                {page.type === 'content' && (
                  <div className="content-page">
                    <div className="page-text">{page.text}</div>
                    {page.photos.length > 0 && (
                      <div className="page-photos">
                        {page.photos.map((url, i) => <img key={i} src={url} alt="Memory" />)}
                      </div>
                    )}
                    <div className="page-num">{page.pageNumber}</div>
                  </div>
                )}

                {page.type === 'end' && (
                  <div className="end-page">
                    <h2 className="serif">Конец первой главы</h2>
                    <p>История продолжается...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .reader-page { background: var(--bg-creme); min-height: 100vh; padding: 1rem; display: flex; flex-direction: column; }
        .reader-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; max-width: 1200px; width: 100%; margin: 0 auto; color: var(--text-dark); z-index: 10; }
        .reader-nav h2 { font-size: 1.5rem; opacity: 0.9; }
        .reader-nav .back-link { color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
        .reader-nav .back-link:hover { color: var(--primary); transform: translateX(-5px); }
        
        .book-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 2rem 0; perspective: 3000px; }
        
        .flip-book { box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        
        .page { background: #fdfaf3; overflow: hidden; }
        .page-content { padding: 1.2rem; height: 100%; display: flex; flex-direction: column; position: relative; border-left: 1px solid rgba(0,0,0,0.05); }
        
        /* Realistic Paper Texture */
        .page::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
          opacity: 0.1; pointer-events: none;
        }

        /* Cover Design */
        .page-cover { background: #2c3e50; color: white; }
        .cover-design { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 2px double rgba(255,255,255,0.1); padding: 1rem; }
        .cover-icon { margin-bottom: 0.5rem; color: #fbbf24; filter: drop-shadow(0 2px 5px rgba(251, 191, 36, 0.3)); }
        .cover-design h1 { font-size: 1.2rem; margin-bottom: 0.5rem; line-height: 1.2; }
        .cover-footer { font-size: 0.5rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; margin-top: 0.5rem; }

        /* Typography */
        .preface-page h2 { margin-bottom: 0.5rem; color: #1e293b; font-size: 1.1rem; text-align: center; }
        .divider-line { width: 30px; height: 1px; background: #fbbf24; margin: 0 auto 1rem; }
        .preface-page p { font-style: italic; line-height: 1.4; font-size: 0.85rem; color: #334155; text-align: center; }

        .content-page { font-size: 0.8rem; line-height: 1.5; color: #2d3748; }
        .page-text { margin-bottom: 1rem; white-space: pre-wrap; font-family: 'Inter', sans-serif; }
        .page-photos { display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto; }
        .page-photos img { width: 100%; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid #fff; transform: rotate(-1deg); }
        .page-num { position: absolute; bottom: 0.5rem; left: 50%; transform: translateX(-50%); font-size: 0.65rem; color: #a0aec0; letter-spacing: 1px; }

        .end-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 4rem; }
        .end-page h2 { color: #1e293b; margin-bottom: 1rem; }
        
        .reader-hint { font-size: 0.8rem; color: #64748b; font-style: italic; opacity: 0.6; }

        @media (max-width: 768px) {
          .page-content { padding: 2rem; }
          .cover-design h1 { font-size: 2rem; }
        }
      `}} />
    </div>
  );
};

export default BookReader;
