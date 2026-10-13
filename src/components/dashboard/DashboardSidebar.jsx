import React from 'react';

export default function DashboardSidebar({ 
  activeNav, 
  setActiveNav, 
  user = { name: 'Elena Vance', sparkLevel: 4, isVerified: true },
  onSwitchToLanding,
  hasVisitedMatches = false,
  hasVisitedChat = false,
  isMobileOpen = false,
  onCloseMobile
}) {
  const ZUNO_LOGO = "/zuno-logo-transparent.png";

  const navItems = [
    { id: 'discover', label: 'Discover', icon: 'explore' },
    { id: 'matches', label: 'Matches', icon: 'favorite', badge: hasVisitedMatches ? null : '3', badgeBg: 'bg-pink-500 text-white' },
    { id: 'chat', label: 'Chat', icon: 'forum', badge: hasVisitedChat ? null : '2', badgeBg: 'bg-cyan-500 text-white' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: 'auto_awesome', badge: 'AI', badgeBg: 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'premium', label: 'Premium', icon: 'star', badge: 'PRO', badgeBg: 'bg-amber-500/10 text-amber-600 border border-amber-300' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-slate-200/80 shadow-2xl lg:shadow-[1px_0_12px_rgba(0,0,0,0.03)] z-50 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 hidden lg:flex'}
      `}>
        <div className="flex flex-col gap-6">
          
          <div className="flex items-center justify-between px-2 pt-1">
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => {
                setActiveNav('discover');
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <img 
                alt="Zuno Logo" 
                className="h-10 w-auto object-contain mix-blend-multiply" 
                src={ZUNO_LOGO}
              />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 tracking-wide">
                LIVE DECK
              </span>
            </div>

            {/* Close button for mobile drawer */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (onCloseMobile) onCloseMobile();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-cyan-500/10 text-pink-600 shadow-sm border border-pink-200/50 font-bold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span 
                      className={`material-symbols-outlined text-[22px] transition-transform ${
                        isActive ? 'text-pink-600 scale-110' : 'text-slate-400'
                      }`}
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onSwitchToLanding) onSwitchToLanding();
            }}
            className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Log Out &amp; Exit Dashboard</span>
          </button>

          <div 
            onClick={() => {
              setActiveNav('profile');
              if (onCloseMobile) onCloseMobile();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 cursor-pointer hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 border-2 border-pink-400 shadow-sm shrink-0 overflow-hidden">
              {user.photo ? (
                <img 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                  src={user.photo}
                />
              ) : (
                <span className="text-pink-600 font-extrabold text-[16px]">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                {user.isVerified && (
                  <span className="material-symbols-outlined text-cyan-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium truncate">
                Spark Level {user.sparkLevel} • Verified
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
