import React from 'react';

export default function Header({ onOpenWaitlist, setActiveTab }) {
  const ZUNO_LOGO = "/zuno-logo-transparent.png";

  const navLinks = [
    { label: 'Home', targetId: 'home' },
    { label: 'Discover', targetId: 'why-zuno' },
    { label: 'AI Matching', targetId: 'ai-matching' },
    { label: 'Features', targetId: 'features' },
    { label: 'Safety', targetId: 'safety' }
  ];

  const handleNavClick = (targetId) => {
    if (setActiveTab) setActiveTab('landing-page');
    setTimeout(() => {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <img 
              alt="Zuno Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 mix-blend-multiply" 
              src={ZUNO_LOGO}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.targetId)}
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-900 hover:text-pink-600 hover:bg-pink-50/60 transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenWaitlist}
            className="h-10 px-4 sm:px-5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center hover:opacity-95 shadow-[0_4px_16px_rgba(244,63,94,0.35)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer"
            data-path="join-waitlist"
          >
            Join Zuno
          </button>
        </div>

      </div>
    </header>
  );
}
