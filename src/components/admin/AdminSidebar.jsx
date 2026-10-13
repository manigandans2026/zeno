import React, { useState } from 'react';

export default function AdminSidebar({ 
  activeNav, 
  setActiveNav, 
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) {
  const [clearedBadges, setClearedBadges] = useState(() => new Set([activeNav]));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'users', label: 'User Management', icon: 'group' },
    { id: 'verification', label: 'Profile Verification', icon: 'verified', badge: '12', badgeBg: 'bg-amber-500 text-white' },
    { id: 'safety', label: 'Reports & Safety', icon: 'gavel', badge: '4', badgeBg: 'bg-rose-500 text-white' },
    { id: 'matches', label: 'Matches & Connections', icon: 'favorite' },
    { id: 'chat', label: 'Chat Moderation', icon: 'forum' },
    { id: 'subscription', label: 'Subscription Management', icon: 'credit_card' },
    { id: 'settings', label: 'Platform Settings', icon: 'settings' }
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
        fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl lg:shadow-[1px_0_12px_rgba(0,0,0,0.03)] z-50 flex flex-col justify-between py-6 px-4 font-body-md selection:bg-pink-500 selection:text-white transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 hidden lg:flex'}
      `}>
        <div className="flex flex-col gap-6 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <span className="material-symbols-outlined text-white text-xl font-bold">admin_panel_settings</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">Zuno Admin</h1>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mt-1">Control Center</span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 flex-grow">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setClearedBadges(prev => new Set(prev).add(item.id));
                    if (onCloseMobile) onCloseMobile();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-pink-50 text-pink-700 shadow-sm border border-pink-100' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 transparent border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-pink-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !clearedBadges.has(item.id) && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeBg || 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-100">
          <button 
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border border-transparent hover:border-rose-100"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
