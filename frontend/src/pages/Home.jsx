import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Feather, BookOpen, Heart, ShieldCheck, Image as ImageIcon, Languages, HelpCircle } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

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
              <span>{t('home.badge')}</span>
            </div>
            <h1 className="serif main-title">{t('home.title')}</h1>
            <p className="hero-subtitle">
              {t('home.subtitle')}
            </p>
            <div className="cta-group">
              <Link to="/auth" className="btn btn-primary btn-lg">{t('home.cta')}</Link>
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

        <section className="features-section">
          <h2 className="serif section-title-center">{t('home.featuresTitle')}</h2>
          <div className="features-grid">
            <motion.div whileHover={{ y: -10 }} className="feature-card card">
              <div className="feat-icon-box blue"><HelpCircle size={32} /></div>
              <h3>{t('home.feat1Title')}</h3>
              <p>{t('home.feat1Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="feature-card card">
              <div className="feat-icon-box purple"><Sparkles size={32} /></div>
              <h3>{t('home.feat2Title')}</h3>
              <p>{t('home.feat2Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="feature-card card">
              <div className="feat-icon-box gold"><BookOpen size={32} /></div>
              <h3>{t('home.feat3Title')}</h3>
              <p>{t('home.feat3Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="feature-card card">
              <div className="feat-icon-box orange"><Languages size={32} /></div>
              <h3>{t('home.feat5Title')}</h3>
              <p>{t('home.feat5Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="feature-card card">
              <div className="feat-icon-box cyan"><ShieldCheck size={32} /></div>
              <h3>{t('home.feat6Title')}</h3>
              <p>{t('home.feat6Text')}</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="steps-section">
          <h2 className="serif section-title-center">{t('home.howItWorksTitle')}</h2>
          <div className="steps-grid">
            <motion.div whileHover={{ y: -5 }} className="step-card">
              <div className="step-number">1</div>
              <h3>{t('home.step1Title')}</h3>
              <p>{t('home.step1Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="step-card">
              <div className="step-number">2</div>
              <h3>{t('home.step2Title')}</h3>
              <p>{t('home.step2Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="step-card">
              <div className="step-number">3</div>
              <h3>{t('home.step3Title')}</h3>
              <p>{t('home.step3Text')}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="step-card">
              <div className="step-number">4</div>
              <h3>{t('home.step4Title')}</h3>
              <p>{t('home.step4Text')}</p>
            </motion.div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section className="ai-demo-section">
          <h2 className="serif section-title-center">{t('home.aiDemoTitle')}</h2>
          <div className="ai-demo-card">
            <div className="ai-before">
              <p>{t('home.aiDemoBefore')}</p>
            </div>
            <div className="ai-arrow">
              <Sparkles className="gold-icon" size={32} />
            </div>
            <div className="ai-after">
              <p className="serif">{t('home.aiDemoAfter')}</p>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="testimonial-card"
          >
            <Heart size={40} className="heart-icon" />
            <p className="testimonial-text serif">{t('home.testimonialText')}</p>
            <p className="testimonial-author">{t('home.testimonialAuthor')}</p>
          </motion.div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="final-cta-content card"
          >
            <div className="final-cta-text">
              <h2 className="serif">{t('home.finalCtaTitle')}</h2>
              <Link to="/auth" className="btn btn-primary btn-lg">{t('home.finalCtaBtn')}</Link>
            </div>
            <div className="final-cta-image">
              <img src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1200&auto=format&fit=crop" alt="Legacy Book" />
            </div>
          </motion.div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .home-wrapper { min-height: 90vh; display: flex; flex-direction: column; align-items: center; padding: 6rem 2rem; overflow-x: hidden; }
        .home-container { max-width: 1200px; width: 100%; }
        
        .hero-split { display: grid; grid-template-columns: 1.3fr 1fr; gap: 6rem; align-items: center; margin-bottom: 10rem; }

        .badge { display: inline-flex; align-items: center; gap: 0.8rem; background: rgba(93, 64, 55, 0.1); color: var(--primary); padding: 0.6rem 1.2rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; margin-bottom: 2rem; }
        
        .hero-text { text-align: left; }
        .main-title { font-size: 6rem; color: var(--primary); margin-bottom: 1.5rem; letter-spacing: -2px; line-height: 1; }
        .hero-subtitle { font-size: 1.3rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 3rem; max-width: 550px; }
        
        .cta-group { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
        .btn-lg { padding: 1.2rem 2.5rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; }

        /* Features Section */
        .features-section { margin-bottom: 10rem; }
        .section-title-center { text-align: center; font-size: 3rem; color: var(--primary); margin-bottom: 4rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature-card { padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; text-align: left; transition: var(--transition); background: #fff; }
        .feat-icon-box { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
        
        .blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .gold { background: rgba(212, 163, 115, 0.1); color: var(--accent); }
        .green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
        .cyan { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
        
        .feature-card h3 { font-size: 1.5rem; color: var(--text-dark); }
        .feature-card p { color: var(--text-muted); line-height: 1.6; }

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

        /* New Sections CSS */
        .steps-section { margin-bottom: 10rem; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; position: relative; }
        .step-card { padding: 2rem; background: #fff; border-radius: 20px; text-align: center; border: 1px solid rgba(93, 64, 55, 0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.03); transition: var(--transition); }
        .step-number { width: 50px; height: 50px; background: rgba(212, 163, 115, 0.1); color: var(--accent); font-size: 1.5rem; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .step-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-dark); }
        .step-card p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }

        .ai-demo-section { margin-bottom: 10rem; }
        .ai-demo-card { display: flex; align-items: center; justify-content: space-between; gap: 2rem; background: #fff; padding: 3rem; border-radius: 30px; border: 1px solid rgba(93, 64, 55, 0.1); box-shadow: 0 20px 40px rgba(93, 64, 55, 0.05); }
        .ai-before, .ai-after { flex: 1; padding: 2rem; border-radius: 20px; font-size: 1.1rem; line-height: 1.8; }
        .ai-before { background: #f8fafc; color: #64748b; border: 1px dashed #cbd5e1; }
        .ai-after { background: rgba(212, 163, 115, 0.05); color: var(--primary); border: 1px solid rgba(212, 163, 115, 0.2); font-size: 1.3rem; }
        .ai-arrow { display: flex; align-items: center; justify-content: center; background: #fff; width: 60px; height: 60px; border-radius: 50%; box-shadow: 0 10px 20px rgba(0,0,0,0.05); flex-shrink: 0; }

        .testimonial-section { margin-bottom: 10rem; }
        .testimonial-card { text-align: center; max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
        .heart-icon { color: #ef4444; margin: 0 auto 2rem; opacity: 0.8; }
        .testimonial-text { font-size: 2rem; color: var(--primary); margin-bottom: 2rem; line-height: 1.5; font-style: italic; }
        .testimonial-author { font-size: 1.1rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }

        .final-cta-section { margin-bottom: 6rem; }
        .final-cta-content { background: linear-gradient(135deg, #2c1b19 0%, #1a100f 100%); color: #fff; border-radius: 40px; display: flex; align-items: stretch; overflow: hidden; text-align: left; }
        .final-cta-text { padding: 6rem 4rem; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; z-index: 2; }
        .final-cta-text h2 { font-size: 3rem; margin-bottom: 2.5rem; color: #fdfaf3; line-height: 1.2; max-width: 500px; }
        .final-cta-text .btn { background: var(--accent); color: #fff; border: none; font-size: 1.2rem; padding: 1.2rem 3rem; }
        .final-cta-text .btn:hover { background: #b8972e; transform: translateY(-3px); }
        .final-cta-image { flex: 0.9; position: relative; min-height: 400px; }
        .final-cta-image img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
        .final-cta-image::before { content: ""; position: absolute; left: -1px; top: 0; bottom: 0; width: 150px; background: linear-gradient(to right, #1a100f, transparent); z-index: 1; }

        @media (max-width: 1024px) {
          .hero-split { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
          .hero-text { display: flex; flex-direction: column; align-items: center; }
          .premium-book-showcase { margin: 0 auto; }
          .main-title { font-size: 4rem; }
          .ai-demo-card { flex-direction: column; text-align: center; }
          .ai-arrow { transform: rotate(90deg); margin: 1rem 0; }
          .testimonial-text { font-size: 1.5rem; }
          .final-cta-content { flex-direction: column; text-align: center; }
          .final-cta-text { align-items: center; padding: 4rem 2rem; }
          .final-cta-text h2 { font-size: 2.2rem; }
          .final-cta-image { width: 100%; min-height: 300px; }
          .final-cta-image::before { width: 100%; height: 100px; top: 0; left: 0; bottom: auto; background: linear-gradient(to bottom, #1a100f, transparent); }
        }
      `}} />
    </div>
  );
};

export default Home;
