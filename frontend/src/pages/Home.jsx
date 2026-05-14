import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Feather, BookOpen, Heart, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="hero-split">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <div className="badge">
              <Sparkles size={16} />
              <span>Твоя история заслуживает вечности</span>
            </div>
            <h1 className="serif main-title">Наследие</h1>
            <p className="hero-subtitle">
              Сохраните свои самые ценные воспоминания в формате интерактивной книги.
              Ваша история — лучший подарок для будущих поколений.
            </p>
            <div className="cta-group">
              <Link to="/auth" className="btn btn-primary btn-lg">Написать свою книгу</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="premium-book-showcase">
              <div className="floating-elements">
                <div className="float-card c1"><Feather size={20} /><span>Редактура</span></div>
                <div className="float-card c2"><BookOpen size={20} /><span>Печать</span></div>
              </div>
              <div className="magic-book">
                <div className="m-cover">
                  <div className="m-spine"></div>
                  <div className="m-front">
                    <Sparkles size={40} className="gold-icon" />
                    <h2 className="serif">Legacy</h2>
                    <div className="m-footer">Твоя История</div>
                  </div>
                </div>
                <div className="m-pages">
                  <div className="m-page-content">
                    <p className="serif">"Слова улетают, написанное остается..."</p>
                  </div>
                </div>
              </div>
              <div className="magic-shadow"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .home-wrapper { min-height: 90vh; display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; }
        .home-container { max-width: 1200px; width: 100%; }
        
        .hero-split { display: grid; grid-template-columns: 1.3fr 1fr; gap: 6rem; align-items: center; }

        .badge { display: inline-flex; align-items: center; gap: 0.8rem; background: rgba(93, 64, 55, 0.1); color: var(--primary); padding: 0.6rem 1.2rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; margin-bottom: 2rem; }
        
        .hero-text { text-align: left; }
        .main-title { font-size: 6rem; color: var(--primary); margin-bottom: 1.5rem; letter-spacing: -2px; line-height: 1; }
        .hero-subtitle { font-size: 1.3rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 3rem; max-width: 550px; }
        
        .cta-group { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
        .btn-lg { padding: 1.2rem 2.5rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; }
        
        .features-mini { display: flex; gap: 3rem; color: var(--text-muted); }
        .feat-item { display: flex; align-items: center; gap: 0.8rem; font-weight: 500; }

        /* Premium Visuals */
        .premium-book-showcase { position: relative; width: fit-content; margin-left: auto; }
        .magic-book { position: relative; width: 300px; height: 420px; transform-style: preserve-3d; animation: float 6s infinite ease-in-out; cursor: pointer; }
        
        .m-cover { position: absolute; width: 100%; height: 100%; background: #2c1b19; color: #fff; border-radius: 4px 15px 15px 4px; transform-origin: left; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5; transform-style: preserve-3d; box-shadow: 20px 20px 60px rgba(0,0,0,0.2); }
        
        .premium-book-showcase:hover .m-cover { transform: rotateY(-135deg); }
        
        .m-spine { position: absolute; left: 0; top: 0; width: 40px; height: 100%; background: #1a100f; transform: rotateY(-90deg) translateX(-20px); transform-origin: left; }
        .m-front { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; border: 2px solid rgba(212, 163, 115, 0.2); margin: 10px; border-radius: 5px 12px 12px 5px; }
        .gold-icon { color: #d4af37; margin-bottom: 2rem; filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4)); }
        .m-front h2 { font-size: 2.2rem; margin-bottom: 0.5rem; }
        .m-footer { margin-top: auto; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; color: var(--accent); }

        .m-pages { position: absolute; top: 10px; left: 10px; width: calc(100% - 20px); height: calc(100% - 20px); background: #fdfaf3; border-radius: 0 12px 12px 0; z-index: 1; display: flex; align-items: center; justify-content: center; padding: 2.5rem; text-align: center; }
        .m-page-content p { color: var(--primary); font-size: 1.3rem; font-style: italic; line-height: 1.6; }

        .magic-shadow { position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%); width: 250px; height: 30px; background: rgba(0,0,0,0.1); filter: blur(20px); border-radius: 50%; animation: shadow 6s infinite ease-in-out; }

        .floating-elements { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10; pointer-events: none; }
        .float-card { position: absolute; background: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 0.8rem; font-weight: 600; color: var(--primary); animation: float-slow 8s infinite ease-in-out; }
        .c1 { top: 10%; left: -20%; animation-delay: 0s; }
        .c2 { bottom: 20%; right: -20%; animation-delay: 2s; }

        @keyframes float { 0%, 100% { transform: translateY(0) rotateY(-5deg); } 50% { transform: translateY(-30px) rotateY(5deg); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes shadow { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; } 50% { transform: translateX(-50%) scale(0.85); opacity: 0.6; } }

        @media (max-width: 1024px) {
          .hero-split { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
          .hero-text { display: flex; flex-direction: column; align-items: center; }
          .premium-book-showcase { margin: 0 auto; }
          .main-title { font-size: 4rem; }
        }
      `}} />
    </div>
  );
};

export default Home;
