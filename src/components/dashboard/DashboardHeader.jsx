import React, { useState } from 'react';

export default function DashboardHeader({ 
  user = { name: 'Elena' }, 
  _onSwitchToLanding,
  _unreadNotifications = 3,
  setActiveNav,
  _activeNav = 'discover',
  _hasVisitedMatches = false,
  _hasVisitedChat = false,
  onToggleMobileMenu
}) {
  const ZUNO_LOGO = "/zuno-logo-transparent.png";
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, icon: 'favorite', title: 'New Resonance!', text: 'Someone liked your voice prompt.', color: 'text-pink-500' },
    { id: 2, icon: 'forum', title: 'New Message', text: 'Kenzo sent you a message.', color: 'text-cyan-500' },
    { id: 3, icon: 'auto_awesome', title: 'AI Weekly Match', text: 'You have a new high-chemistry match.', color: 'text-emerald-500' }
  ]);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 z-40 flex items-center justify-between px-4 lg:px-8 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      
      <div className="flex items-center gap-2.5">
        {/* Mobile Hamburger Menu Bar Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-pink-50 hover:text-pink-600 border border-slate-200/90 text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          title="Open Menu Bar"
          aria-label="Open Mobile Menu Bar"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveNav && setActiveNav('discover')}>
          <img 
            alt="Zuno Logo" 
            className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply" 
            src={ZUNO_LOGO}
          />
          <span className="text-[11px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            Deck
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white"></span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute top-12 left-0 sm:left-auto sm:right-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                {notifs.length > 0 && (
                  <span className="text-xs text-pink-600 font-bold cursor-pointer hover:underline" onClick={() => setNotifs([])}>Mark all read</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {notifs.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs font-semibold">
                    No new notifications
                  </div>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <span className={`material-symbols-outlined ${n.color} text-lg`}>{n.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.text}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          onClick={() => setActiveNav && setActiveNav('profile')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 cursor-pointer transition-all overflow-hidden"
          title="Your Profile"
        >
          {user.photo ? (
            <img 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
              src={user.photo}
            />
          ) : (
            <span className="text-pink-600 font-extrabold text-sm">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
          )}
        </div>
      </div>
    </header>
  );
}
