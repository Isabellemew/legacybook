import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import questionsData from '../data/questions.json';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Editor = () => {
  const { t, i18n } = useTranslation();
  const { bookId, id } = useParams(); // id - это ID вопроса
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
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
        setPhotos((data.photoUrls || []).map(u => ({ url: u, pending: false })));
      }
    };
    if (id && user && bookId) loadAnswer();
  }, [id, user, bookId]);

  const persistedUrls = () => photos.filter(p => !p.pending).map(p => p.url);

  const handleSave = async () => {
    if (!user) {
      alert(t('editor.pleaseLogin'));
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
        photoUrls: persistedUrls(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert(t('editor.errorSave'));
    } finally {
      setIsSaving(false);
    }
  };

  const compressImage = (file, maxSize = 1600, quality = 0.85) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result; };
      reader.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('compress failed')),
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!user) {
      alert(t('editor.pleaseLogin'));
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotos(prev => [...prev, { url: previewUrl, pending: true }]);
    setIsUploading(true);

    try {
      const blob = file.size > 600 * 1024 ? await compressImage(file) : file;
      const ext = blob.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'jpg');
      const safeName = `${Date.now()}.${ext}`;
      const storageRef = ref(storage, `answers/${user.uid}/${bookId}/${id}/${safeName}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      let finalUrls = [];
      setPhotos(prev => {
        const next = prev.map(p => p.url === previewUrl ? { url, pending: false } : p);
        finalUrls = next.filter(p => !p.pending).map(p => p.url);
        return next;
      });
      URL.revokeObjectURL(previewUrl);

      const answerId = `${bookId}_${id}`;
      await setDoc(doc(db, "answers", answerId), {
        userId: user.uid,
        bookId: bookId,
        questionId: id,
        text: text,
        photoUrls: finalUrls,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Photo upload failed:", error);
      setPhotos(prev => prev.filter(p => p.url !== previewUrl));
      URL.revokeObjectURL(previewUrl);
      alert(t('editor.errorUpload') + (error?.message ? `\n${error.message}` : ''));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = async (index) => {
    const target = photos[index];
    const nextPhotos = photos.filter((_, i) => i !== index);
    setPhotos(nextPhotos);
    if (target?.pending) return;
    if (!user) return;
    try {
      const answerId = `${bookId}_${id}`;
      await setDoc(doc(db, "answers", answerId), {
        photoUrls: nextPhotos.filter(p => !p.pending).map(p => p.url),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error("remove photo failed", err);
    }
  };

  if (!question) return <div className="container">{t('editor.notFound')}</div>;
  const currentLang = (i18n.language || 'ru').split('-')[0];
  const questionText = question.text[currentLang] || question.text['ru'];

  return (
    <div className="container fade-in">
      <button onClick={() => navigate(`/book/${bookId}`)} className="back-btn">
        <ArrowLeft size={18} /> {t('editor.back')}
      </button>

      <div className="editor-container">
        <header className="editor-header">
          <h1 className="serif">{questionText}</h1>
        </header>

        <div className="editor-main">
          <div className="writing-area card">
            <textarea 
              placeholder={t('editor.placeholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {photos.length > 0 && (
              <div className="photos-preview">
                {photos.map((p, i) => (
                  <div key={p.url + i} className={`photo-item ${p.pending ? 'pending' : ''}`}>
                    <img src={p.url} alt="Фото" />
                    {p.pending && <div className="photo-spinner"><Loader2 className="animate-spin" size={20} /></div>}
                    <button onClick={() => removePhoto(i)} disabled={p.pending}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="editor-actions">
              <div className="right-actions">
                <label className={`btn btn-secondary cursor-pointer ${isUploading ? 'is-loading' : ''}`}>
                  {isUploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={18} />}
                  {isUploading ? t('editor.uploading') || '...' : t('editor.photo')}
                  <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" disabled={isUploading} />
                </label>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : (isSaved ? <><Check size={18} /> {t('editor.saved')}</> : <><Save size={18} /> {t('editor.save')}</>)}
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
        .photo-item.pending img { opacity: 0.55; filter: grayscale(20%); }
        .photo-spinner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #6366f1; pointer-events: none; }
        .photo-item button { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .photo-item button:disabled { opacity: 0.5; cursor: not-allowed; }
        .editor-actions { display: flex; justify-content: flex-end; padding: 1.2rem 2rem; border-top: 1px solid #f1f5f9; background: #fff; border-radius: 0 0 12px 12px; }
        .right-actions { display: flex; gap: 0.8rem; }
        .btn-secondary.is-loading { opacity: 0.7; pointer-events: none; }
        .cursor-pointer { cursor: pointer; }

        @media (max-width: 768px) {
          .editor-header h1 { font-size: 1.6rem; }
          .writing-area textarea { padding: 1.5rem; font-size: 1.1rem; }
          .editor-actions { flex-direction: column; gap: 1rem; padding: 1rem; }
          .right-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
        }
      `}} />
    </div>
  );
};

export default Editor;
