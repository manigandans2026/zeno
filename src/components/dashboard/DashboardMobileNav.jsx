import React from 'react';

export default function DashboardMobileNav({ 
  activeNav, 
  setActiveNav, 
  hasVisitedMatches = false, 
  hasVisitedChat = false,
  onOpenMenu
}) {
  const navItems = [
    { id: 'discover', label: 'Discover', icon: 'explore' },
    { id: 'matches', label: 'Matches', icon: 'favorite', badge: hasVisitedMatches ? null : '3' },
    { id: 'chat', label: 'Chat', icon: 'forum', badge: hasVisitedChat ? null : '2' },
    { id: 'ai-assistant', label: 'AI Wing', icon: 'auto_awesome', badge: 'AI' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'premium', label: 'Premium', icon: 'star', badge: 'PRO' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'menu', label: 'Menu', icon: 'menu', isAction: true }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between px-1 h-16 max-w-lg mx-auto overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = !item.isAction && activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  if (onOpenMenu) onOpenMenu();
                  return;
                }
                setActiveNav(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center min-w-[42px] flex-1 py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-pink-600 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[20px] transition-transform ${
                  isActive ? 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]' : ''
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>

              <span className="text-[9px] tracking-tight truncate max-w-[50px]">
                {item.label}
              </span>

              {item.badge && (
                <span className={`absolute top-0 right-1 px-1 min-w-[14px] h-[14px] rounded-full text-white text-[8px] font-black flex items-center justify-center border border-white shadow-sm ${
                  item.badge === 'PRO' ? 'bg-amber-500' : item.badge === 'AI' ? 'bg-cyan-500' : 'bg-pink-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
