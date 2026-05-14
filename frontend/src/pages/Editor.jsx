import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Save, ArrowLeft, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import questionsData from '../data/questions.json';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Editor = () => {
  const { bookId, id } = useParams(); // id - это ID вопроса
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const question = questionsData
    .flatMap(c => c.questions)
    .find(q => q.id === id);

  useEffect(() => {
    const loadAnswer = async () => {
      if (!user || !bookId) return;
      const answerId = `${bookId}_${id}`;
      const docRef = doc(db, "answers", answerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setText(data.text || '');
        setPhotos(data.photoUrls || []);
      }
    };
    if (id && user && bookId) loadAnswer();
  }, [id, user, bookId]);

  const handleSave = async () => {
    if (!user) {
      alert("Пожалуйста, войдите в систему.");
      return;
    }

    setIsSaving(true);
    try {
      const answerId = `${bookId}_${id}`;
      await setDoc(doc(db, "answers", answerId), {
        userId: user.uid,
        bookId: bookId,
        questionId: id,
        text: text,
        photoUrls: photos,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Не удалось сохранить ответ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `answers/${bookId}/${id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotos(prev => [...prev, url]);
    } catch (error) {
      alert("Не удалось загрузить фото.");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAiFix = async () => {
    if (!text) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const data = await response.json();
        setText(data.fixedText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!question) return <div className="container">Вопрос не найден</div>;

  return (
    <div className="container fade-in">
      <button onClick={() => navigate(`/book/${bookId}`)} className="back-btn">
        <ArrowLeft size={18} /> К списку вопросов
      </button>

      <div className="editor-container">
        <header className="editor-header">
          <h1 className="serif">{question.text}</h1>
        </header>

        <div className="editor-main">
          <div className="writing-area card">
            <textarea 
              placeholder="Начните писать здесь..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {photos.length > 0 && (
              <div className="photos-preview">
                {photos.map((url, i) => (
                  <div key={i} className="photo-item">
                    <img src={url} alt="Фото" />
                    <button onClick={() => removePhoto(i)}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="editor-actions">
              <button className="btn btn-ai" onClick={handleAiFix} disabled={isAiLoading}>
                {isAiLoading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Улучшить через ИИ</>}
              </button>
              
              <div className="right-actions">
                <label className="btn btn-secondary cursor-pointer">
                  <ImageIcon size={18} /> {isUploading ? '...' : 'Фото'}
                  <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                </label>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : (isSaved ? <><Check size={18} /> Сохранено</> : <><Save size={18} /> Сохранить</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; margin-bottom: 2rem; font-weight: 500; }
        .editor-container { max-width: 850px; margin: 0 auto; }
        .editor-header h1 { font-size: 2.2rem; margin-bottom: 2rem; color: var(--primary); }
        .writing-area { min-height: 500px; display: flex; flex-direction: column; padding: 0; }
        .writing-area textarea { flex: 1; border: none; outline: none; padding: 2rem; font-size: 1.2rem; line-height: 1.8; resize: none; background: transparent; }
        .photos-preview { display: flex; gap: 1rem; padding: 1rem 2rem; overflow-x: auto; background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .photo-item { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
        .photo-item button { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .editor-actions { display: flex; justify-content: space-between; padding: 1.2rem 2rem; border-top: 1px solid #f1f5f9; background: #fff; border-radius: 0 0 12px 12px; }
        .btn-ai { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.2rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .right-actions { display: flex; gap: 0.8rem; }
        .cursor-pointer { cursor: pointer; }
      `}} />
    </div>
  );
};

export default Editor;
