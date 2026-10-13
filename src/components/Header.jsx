import React, { useState } from 'react';

export default function Header({ onOpenWaitlist, setActiveTab }) {
  const ZUNO_LOGO = "/zuno-logo-transparent.png";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', targetId: 'home' },
    { label: 'Discover', targetId: 'why-zuno' },
    { label: 'AI Matching', targetId: 'ai-matching' },
    { label: 'Features', targetId: 'features' },
    { label: 'Safety', targetId: 'safety' }
  ];

  const handleNavClick = (targetId) => {
    setIsMobileMenuOpen(false);
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
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="Open Menu Bar"
            aria-label="Open Mobile Menu Bar"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

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

      {/* Mobile Slide-Over Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-slide-in-left overflow-y-auto">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img 
                    alt="Zuno Logo" 
                    className="h-8 w-auto object-contain mix-blend-multiply" 
                    src={ZUNO_LOGO}
                  />
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 tracking-wide">
                    MENU
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.targetId)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-all cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWaitlist();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join Zuno Deck</span>
                <span className="material-symbols-outlined text-base">bolt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
