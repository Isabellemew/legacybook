import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import questionsData from '../data/questions.json';
import { ChevronRight, Search, ArrowLeft, CheckCircle, Edit, Save, Send, Loader2, Sparkles } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Questions = () => {
  const { t, i18n } = useTranslation();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChapter, setActiveChapter] = useState(questionsData[0].id);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [bookData, setBookData] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPreface, setEditedPreface] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !bookId) return;
      const qBook = query(collection(db, "books"), where("__name__", "==", bookId));
      const bSnap = await getDocs(qBook);
      if (!bSnap.empty) {
        const data = bSnap.docs[0].data();
        setBookData(data);
        setEditedTitle(data.title);
        setEditedPreface(data.preface || '');
      }
      const q = query(collection(db, "answers"), where("bookId", "==", bookId));
      const querySnapshot = await getDocs(q);
      const ids = [];
      querySnapshot.forEach((doc) => ids.push(doc.data().questionId));
      setAnsweredIds(ids);
    };
    loadData();
  }, [user, bookId]);

  const handleFinishBook = async () => {
    if (answeredIds.length === 0) {
      alert(t('questions.atLeastOne'));
      return;
    }

    setIsSending(true);
    try {
      // 1. Получаем все ответы
      const q = query(collection(db, "answers"), where("bookId", "==", bookId));
      const qSnap = await getDocs(q);
      const answers = [];
      qSnap.forEach(d => answers.push(d.data()));

      // 2. Группируем по главам, сохраняя порядок из questions.json
      const lang = (i18n.language || 'ru').split('-')[0];
      const answerByQuestion = new Map(answers.map(a => [a.questionId, a]));
      const chapters = questionsData
        .map(chap => {
          const chapterAnswers = chap.questions
            .filter(q => answerByQuestion.has(q.id))
            .map(q => {
              const a = answerByQuestion.get(q.id);
              return {
                questionId: q.id,
                questionText: q.text[lang] || q.text['ru'],
                text: a.text || '',
                photoUrls: a.photoUrls || [],
              };
            });
          return chapterAnswers.length > 0
            ? {
                chapterId: chap.id,
                chapterTitle: chap.title[lang] || chap.title['ru'],
                answers: chapterAnswers,
              }
            : null;
        })
        .filter(Boolean);

      // 3. Отправляем на ИИ-полировку
      const response = await fetch('http://127.0.0.1:8000/generate-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          bookTitle: bookData.title,
          chapters: chapters,
        })
      });

      if (response.ok) {
        const result = await response.json();
        // 3. Сохраняем отполированный текст в книгу и меняем статус
        await updateDoc(doc(db, "books", bookId), {
          status: 'ready',
          polishedContent: result.polishedContent,
          finishedAt: serverTimestamp()
        });
        alert(t('questions.success'));
        navigate('/profile');
      } else {
        const errData = await response.json().catch(() => ({detail: "Unknown error"}));
        alert(t('questions.errorServer') + (errData.detail || response.statusText));
      }
    } catch (err) {
      console.error(err);
      alert(t('questions.errorNetwork') + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveHeader = async () => {
    if (!editedTitle.trim()) {
      alert(t('questions.titleEmpty'));
      return;
    }
    try {
      await updateDoc(doc(db, "books", bookId), {
        title: editedTitle,
        preface: editedPreface
      });
      setBookData({ ...bookData, title: editedTitle, preface: editedPreface });
      setIsEditingHeader(false);
    } catch (err) {
      console.error(err);
      alert(t('questions.errorSave'));
    }
  };

  const allQuestions = questionsData.find(c => c.id === activeChapter)?.questions || [];
  const currentLang = (i18n.language || 'ru').split('-')[0];
  const filteredQuestions = allQuestions.filter(q => (q.text[currentLang] || q.text['ru']).toLowerCase().includes(searchTerm.toLowerCase()));
  const finishedQuestions = filteredQuestions.filter(q => answeredIds.includes(q.id));
  const pendingQuestions = filteredQuestions.filter(q => !answeredIds.includes(q.id));

  return (
    <div className="container fade-in">
      <AnimatePresence>
        {isSending && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="ai-overlay"
          >
            <div className="ai-loader card">
              <Sparkles className="animate-pulse" size={48} color="#a855f7" />
              <h2 className="serif">{t('questions.aiTitle')}</h2>
              <p>{t('questions.aiText')}</p>
              <div className="progress-dots"><span></span><span></span><span></span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="page-header card">
        <div className="header-top">
          <Link to="/profile" className="back-link"><ArrowLeft size={18} /> {t('questions.back')}</Link>
          <button className="btn btn-ai-finish" onClick={handleFinishBook} disabled={isSending}>
            <Sparkles size={18} /> {t('questions.finish')}
          </button>
        </div>
        
        <div className="book-info">
          {isEditingHeader ? (
            <div className="header-edit-mode fade-in">
              <input 
                type="text" 
                className="edit-title-input serif" 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Название книги"
                autoFocus
              />
              <textarea 
                className="edit-preface-input" 
                value={editedPreface} 
                onChange={(e) => setEditedPreface(e.target.value)}
                placeholder="Коротко о книге или авторе..."
                rows={3}
              />
              <div className="header-edit-actions">
                <button className="btn btn-primary btn-sm" onClick={handleSaveHeader}>
                  <Save size={16} /> {t('questions.save')}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  setIsEditingHeader(false);
                  setEditedTitle(bookData.title);
                  setEditedPreface(bookData.preface || '');
                }}>
                  {t('questions.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="title-row">
                <h1 className="serif">{bookData?.title}</h1>
                <button className="icon-btn edit-trigger" onClick={() => setIsEditingHeader(true)} title="Редактировать название и описание">
                  <Edit size={18} />
                </button>
              </div>
              <p className="preface-text">{bookData?.preface || t('questions.prefaceEmpty')}</p>
            </>
          )}
        </div>
      </header>

      <div className="questions-layout">
        <aside className="chapters-nav">
          {questionsData.map(c => (
            <button key={c.id} className={`chapter-link ${activeChapter === c.id ? 'active' : ''}`} onClick={() => setActiveChapter(c.id)}>
              {c.title[currentLang] || c.title['ru']}
            </button>
          ))}
        </aside>

        <section className="questions-list">
          <div className="search-container">
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder={t('questions.searchPlaceholder')}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">{t('questions.pending')} ({pendingQuestions.length})</h3>
            <div className="questions-grid">
              {pendingQuestions.map(q => (
                <Link to={`/book/${bookId}/editor/${q.id}`} key={q.id} className="question-card card">
                  <p>{q.text[currentLang]}</p>
                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>
          </div>

          {finishedQuestions.length > 0 && (
            <div className="section">
              <h3 className="section-title">{t('questions.finished')} ({finishedQuestions.length})</h3>
              <div className="questions-grid">
                {finishedQuestions.map(q => (
                  <Link to={`/book/${bookId}/editor/${q.id}`} key={q.id} className="question-card card finished">
                    <CheckCircle size={18} color="#10b981" />
                    <p>{q.text[currentLang]}</p>
                    <ChevronRight size={18} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ai-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(8px); }
        .ai-loader { text-align: center; max-width: 450px; padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; border: 1px solid rgba(168, 85, 247, 0.2); }
        .ai-loader h2 { color: #a855f7; font-size: 2rem; margin-bottom: 0.5rem; }
        .ai-loader p { color: var(--text-muted); font-size: 1rem; line-height: 1.6; }
        
        .progress-dots { display: flex; gap: 0.6rem; margin-top: 1rem; }
        .progress-dots span { width: 10px; height: 10px; background: #a855f7; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .progress-dots span:nth-child(1) { animation-delay: -0.32s; }
        .progress-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        
        .page-header { margin-bottom: 2.5rem; border-bottom: 4px solid var(--accent); padding-bottom: 2.5rem; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-weight: 500; transition: var(--transition); }
        .back-link:hover { color: var(--primary); transform: translateX(-5px); }
        
        .book-info h1 { font-size: 2.5rem; color: var(--primary); margin-bottom: 0.5rem; }
        .title-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .edit-trigger { opacity: 0; transition: var(--transition); background: rgba(93, 64, 55, 0.05); color: var(--primary); padding: 0.5rem; border-radius: 50%; }
        .title-row:hover .edit-trigger { opacity: 1; }
        .preface-text { color: var(--text-muted); font-style: italic; max-width: 800px; line-height: 1.6; }

        .header-edit-mode { display: flex; flex-direction: column; gap: 1rem; max-width: 800px; }
        .edit-title-input { font-size: 2.5rem; border: none; border-bottom: 2px solid var(--accent); background: transparent; color: var(--primary); outline: none; width: 100%; padding: 0.5rem 0; }
        .edit-preface-input { font-size: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; background: #f8fafc; color: var(--text-dark); resize: vertical; outline: none; font-family: inherit; }
        .edit-preface-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.1); }
        .header-edit-actions { display: flex; gap: 1rem; }
        
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.9rem; }
        .btn-ghost { background: transparent; color: var(--text-muted); }
        .btn-ghost:hover { background: #f1f5f9; color: var(--text-dark); }
        .icon-btn { border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .questions-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; align-items: start; }
        .chapters-nav { position: sticky; top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
        
        .question-card { display: flex; gap: 1rem; align-items: center; padding: 1.25rem; text-decoration: none; color: inherit; margin-bottom: 1rem; border: 1px solid transparent; transition: var(--transition); }
        .question-card:hover { transform: translateY(-3px) scale(1.01); border-color: var(--accent); }
        .question-card p { flex: 1; font-weight: 500; }
        .question-card.finished { border-left: 5px solid #10b981; background: #f0fdf4; }
        .question-card.finished:hover { background: #e8f7ed; }
        
        .chapter-link { text-align: left; padding: 1.2rem; border: none; background: var(--bg-paper); cursor: pointer; width: 100%; border-radius: 12px; color: var(--text-muted); font-weight: 600; transition: var(--transition); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .chapter-link:hover { background: #f8f9fa; color: var(--primary); }
        .chapter-link.active { background: var(--primary); color: white; box-shadow: 0 8px 20px rgba(93, 64, 55, 0.2); }
        
        .section-title { margin-bottom: 1.5rem; color: var(--text-dark); font-size: 1.25rem; border-left: 4px solid var(--accent); padding-left: 1rem; }
        
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.1); } }

        @media (max-width: 1024px) {
          .questions-layout { grid-template-columns: 1fr; }
          .chapters-nav { 
            position: sticky; top: 0; 
            flex-direction: row; 
            overflow-x: auto; 
            padding: 1rem; 
            background: var(--white); 
            z-index: 20; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            margin: -1.5rem -1.5rem 2rem -1.5rem;
            width: calc(100% + 3rem);
          }
          .chapter-link { white-space: nowrap; padding: 0.8rem 1.5rem; width: auto; }
          .questions-header h1 { font-size: 2.2rem; }
        }

        @media (max-width: 640px) {
          .questions-container { padding: 1rem; }
          .questions-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .search-box { width: 100%; }
          .question-card { padding: 1.5rem; flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .question-card p { width: 100%; }
          .btn-lg { width: 100%; justify-content: center; }
          .chapters-nav { margin: -1rem -1rem 1.5rem -1rem; width: calc(100% + 2rem); }
        }
      `}} />
    </div>
  );
};

export default Questions;
