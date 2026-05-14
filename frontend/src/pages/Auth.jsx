import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError('Ошибка: ' + err.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container auth-container fade-in">
      <motion.div className="auth-card card">
        <h2 className="serif">{isLogin ? 'С возвращением' : 'Создать аккаунт'}</h2>
        <p className="auth-subtitle">Войдите, чтобы ваши воспоминания были под надежной защитой.</p>
        
        <form onSubmit={handleAuth} className="auth-form">
          <div className="input-group">
            <Mail size={18} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <Lock size={18} />
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit" className="btn btn-primary btn-full">
            {isLogin ? <><LogIn size={18} /> Войти</> : <><UserPlus size={18} /> Зарегистрироваться</>}
          </button>
        </form>

        <div className="divider"><span>или</span></div>

        <button onClick={signInWithGoogle} className="btn btn-secondary btn-full btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="G" /> Войти через Google
        </button>

        <p className="toggle-auth">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
          <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Создать' : 'Войти'}</button>
        </p>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
        .auth-card { width: 100%; max-width: 450px; text-align: center; }
        .auth-subtitle { color: var(--text-muted); margin-bottom: 2rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        
        .input-group { 
          display: flex; align-items: center; gap: 0.8rem; background: #f8fafc; 
          border: 1px solid #e2e8f0; padding: 0.8rem 1.2rem; border-radius: 8px;
        }
        .input-group input { border: none; background: transparent; outline: none; width: 100%; font-size: 1rem; }
        
        .btn-full { width: 100%; justify-content: center; padding: 1rem; margin-top: 1rem; }
        .btn-google { background: white; border: 1px solid #e2e8f0; gap: 1rem; }
        .btn-google img { width: 18px; }
        
        .divider { margin: 1.5rem 0; position: relative; border-bottom: 1px solid #e2e8f0; }
        .divider span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 0 1rem; color: var(--text-muted); font-size: 0.9rem; }
        
        .toggle-auth { margin-top: 1.5rem; color: var(--text-muted); }
        .toggle-auth button { background: transparent; border: none; color: var(--primary); font-weight: 600; cursor: pointer; margin-left: 0.5rem; }
        .error-msg { color: #e63946; font-size: 0.9rem; text-align: left; }
      `}} />
    </div>
  );
};

export default Auth;
