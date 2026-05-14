import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Clock, Loader2, Trash2, CheckCircle, User as UserIcon } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, authLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const loadBooks = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "books"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const booksList = [];
      querySnapshot.forEach((doc) => {
        booksList.push({ id: doc.id, ...doc.data() });
      });
      setBooks(booksList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadBooks();
  }, [user]);

  const createNewBook = async () => {
    setIsCreating(true);
    try {
      await addDoc(collection(db, "books"), {
        userId: user.uid,
        title: "Моя новая книга",
        preface: "",
        createdAt: serverTimestamp(),
        status: "writing"
      });
      loadBooks();
    } catch (err) {
      alert("Ошибка создания");
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading) return <div className="loading-screen">Загрузка...</div>;
  if (!user) return <div className="container center">Пожалуйста, войдите</div>;

  const writingBooks = books.filter(b => b.status === 'writing' || !b.status);
  const readyBooks = books.filter(b => b.status === 'ready');

  return (
    <div className="container fade-in profile-page">
      <header className="profile-header card">
        <div className="user-info">
          <div className="avatar"><UserIcon /></div>
          <div>
            <h1 className="serif">Моя Библиотека</h1>
            <p>{user.email}</p>
          </div>
        </div>
        <button onClick={() => auth.signOut()} className="btn btn-secondary">Выйти</button>
      </header>

      <section className="books-section">
        <h2 className="serif section-title">В процессе</h2>
        <div className="books-grid">
          <motion.div whileHover={{ scale: 1.05 }} className="create-book-3d" onClick={createNewBook}>
            {isCreating ? <Loader2 className="animate-spin" /> : <><Plus size={40} /><span>Новый том</span></>}
          </motion.div>

          {writingBooks.map(book => (
            <div key={book.id} className="book-3d-wrapper" onClick={() => navigate(`/book/${book.id}`)}>
              <div className="book-cover">
                <div className="book-cover-front">
                  <Book size={40} color="#fbbf24" />
                  <h3 className="serif">{book.title}</h3>
                  <div className="book-label">Черновик</div>
                </div>
              </div>
              <button className="del-btn-mini" onClick={(e) => {
                e.stopPropagation();
                if(window.confirm("Удалить?")) deleteDoc(doc(db, "books", book.id)).then(loadBooks);
              }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      {readyBooks.length > 0 && (
        <section className="books-section">
          <h2 className="serif section-title">Готовые шедевры</h2>
          <div className="books-grid">
            {readyBooks.map(book => (
              <div key={book.id} className="book-3d-wrapper ready" onClick={() => navigate(`/book/${book.id}/read`)}>
                <div className="book-cover gold">
                  <div className="book-cover-front">
                    <CheckCircle size={40} color="#10b981" />
                    <h3 className="serif">{book.title}</h3>
                    <div className="book-label">Завершено</div>
                  </div>
                </div>
                <button className="del-btn-mini" onClick={(e) => {
                  e.stopPropagation();
                  deleteDoc(doc(db, "books", book.id)).then(loadBooks);
                }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-page { padding: 4rem 0; }
        .profile-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; margin-bottom: 4rem; }
        .section-title { font-size: 2.2rem; margin-bottom: 2.5rem; color: var(--primary); }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 3rem; }

        .create-book-3d { border: 2px dashed #cbd5e1; border-radius: 16px; height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #64748b; cursor: pointer; transition: var(--transition); background: rgba(255,255,255,0.4); }
        .create-book-3d:hover { border-color: var(--accent); color: var(--primary); background: white; transform: translateY(-5px); }

        /* Elegant Static Book Cover */
        .book-3d-wrapper { position: relative; width: 220px; height: 320px; cursor: pointer; transition: var(--transition); }
        .book-3d-wrapper:hover { transform: translateY(-8px); }
        
        .book-cover { 
          position: relative; width: 100%; height: 100%; 
          background: #2c3e50; color: white; 
          border-radius: 4px 16px 16px 4px; 
          transition: var(--transition); 
          box-shadow: 8px 8px 24px rgba(0,0,0,0.15);
          overflow: hidden;
          display: flex; flex-direction: column;
        }

        .book-cover::before {
          content: ''; position: absolute; top: 0; left: 12px; width: 3px; height: 100%;
          background: rgba(0,0,0,0.2); box-shadow: 1px 0 3px rgba(255,255,255,0.1);
          z-index: 2;
        }
        
        .book-cover.gold { background: linear-gradient(135deg, #064e3b, #065f46); border: 1px solid rgba(16, 185, 129, 0.2); }
        
        .book-cover-front { padding: 3rem 1.5rem; height: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: space-between; position: relative; z-index: 1; }
        .book-cover-front h3 { margin-top: 1rem; font-size: 1.4rem; line-height: 1.3; color: #f8fafc; font-weight: 600; }
        .book-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; width: 80%; color: #94a3b8; }

        .del-btn-mini { position: absolute; top: -10px; right: -10px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: 0.3s; z-index: 10; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .book-3d-wrapper:hover .del-btn-mini { opacity: 1; }
        
        .center { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; }
      `}} />
    </div>
  );
};

export default Profile;
