import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Book, Edit3, List, Home as HomeIcon, User, LogOut, Languages } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import Home from './pages/Home';
import Questions from './pages/Questions';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import BookReader from './pages/BookReader';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [user, loading] = useAuthState(auth);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (loading) return <div className="loading-screen">Загрузка...</div>;

  return (
    <Router>
      <div className="app-shell">
        {/* Global Video Background */}
        <div className="global-video-bg">
          <video autoPlay loop muted playsInline>
            <source src="https://assets.mixkit.co/videos/preview/mixkit-floating-dust-particles-in-a-beam-of-light-32865-large.mp4" type="video/mp4" />
          </video>
          <div className="global-video-overlay"></div>
        </div>

        <nav className="navbar">
          <div className="container nav-content">
            <Link to="/" className="logo">
              <Book size={24} />
              <span>{t('home.title')}</span>
            </Link>
            <div className="nav-links">
              <div className="lang-switcher">
                <Languages size={18} />
                <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
                  <option value="ru">RU</option>
                  <option value="kk">KK</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <Link to="/"><HomeIcon size={20} /> <span>{t('nav.home')}</span></Link>
              {user ? (
                <>
                  <Link to="/profile" className="profile-link"><User size={20} /> <span>{t('nav.profile')}</span></Link>
                </>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-sm"><span>{t('nav.login')}</span></Link>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/profile" />} />

              {/* Маршруты для авторизованных пользователей */}
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
              <Route path="/book/:bookId" element={user ? <Questions /> : <Navigate to="/auth" />} />
              <Route path="/book/:bookId/editor/:id" element={user ? <Editor /> : <Navigate to="/auth" />} />
              <Route path="/book/:bookId/read" element={user ? <BookReader /> : <Navigate to="/auth" />} />

              {/* Убираем глобальные вопросы */}
              <Route path="/questions" element={<Navigate to="/profile" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="footer">
          <div className="container">
            <p>© 2026 Наследие: Твоя История. Создано с любовью для будущих поколений.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
