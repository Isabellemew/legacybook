import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Edit3, List, Home as HomeIcon, User, LogOut } from 'lucide-react';
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
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="loading-screen">Загрузка...</div>;

  return (
    <Router>
      <div className="app-shell">
        <nav className="navbar">
          <div className="container nav-content">
            <Link to="/" className="logo">
              <Book size={24} />
              <span>Наследие</span>
            </Link>
            <div className="nav-links">
              <Link to="/"><HomeIcon size={20} /> Главная</Link>
              {user ? (
                <>
                  <Link to="/profile" className="profile-link"><User size={20} /> Профиль</Link>
                </>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-sm">Войти</Link>
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
