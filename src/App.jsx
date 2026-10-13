import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import WhyZunoSection from './components/WhyZunoSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import AiExperienceSection from './components/AiExperienceSection';
import SafetySection from './components/SafetySection';
import VelvetMembershipSection from './components/VelvetMembershipSection';
import WaitlistModal from './components/WaitlistModal';
import SparksTab from './components/SparksTab';
import AiMatchTab from './components/AiMatchTab';
import MembershipTab from './components/MembershipTab';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { supabase, isSupabaseConfigured, signOutUser, getCurrentUserProfile } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing-page'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Restore session from Supabase or localStorage on initial mount
  useEffect(() => {
    async function restoreSession() {
      // 1. Check Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await getCurrentUserProfile(session.user.id);
            const userObj = {
              id: session.user.id,
              name: profile?.full_name?.split(' ')[0] || session.user.user_metadata?.full_name?.split(' ')[0] || 'Member',
              fullName: profile?.full_name || session.user.user_metadata?.full_name || 'Member',
              email: session.user.email,
              role: profile?.role || (session.user.email === 'admin@zuno.com' ? 'admin' : 'user'),
              ...profile
            };
            setCurrentUser(userObj);
            setIsAuthenticated(true);
            if (userObj.role === 'admin') {
              setActiveTab('admin');
            } else if (window.location.hash === '#dashboard' || !window.location.hash) {
              setActiveTab('dashboard');
            }
            return;
          }
        } catch (err) {
          console.warn('Session restoration notice:', err);
        }
      }

      // 2. Check local session cache for demo accounts
      const cached = localStorage.getItem('zuno_auth_session');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            setIsAuthenticated(true);
            if (parsed.role === 'admin') {
              setActiveTab('admin');
            } else {
              setActiveTab('dashboard');
            }
          }
        } catch {
          localStorage.removeItem('zuno_auth_session');
        }
      }
    }

    restoreSession();

    // Listen to Supabase auth events
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await getCurrentUserProfile(session.user.id);
          const userObj = {
            id: session.user.id,
            name: profile?.full_name?.split(' ')[0] || session.user.user_metadata?.full_name?.split(' ')[0] || 'Member',
            fullName: profile?.full_name || session.user.user_metadata?.full_name || 'Member',
            email: session.user.email,
            role: profile?.role || 'user',
            ...profile
          };
          setCurrentUser(userObj);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setActiveTab('landing-page');
          localStorage.removeItem('zuno_auth_session');
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing-page', 'features', 'encounters', 'membership', 'dashboard', 'admin'].includes(hash)) {
        if (hash === 'dashboard' && !isAuthenticated) {
          setIsWaitlistOpen(true);
        } else {
          setActiveTab(hash);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setIsWaitlistOpen(false);
    localStorage.setItem('zuno_auth_session', JSON.stringify(userData));
  };

  const handleAdminLogin = (adminData) => {
    const adminUser = adminData || { role: 'admin', name: 'Super Admin', email: 'admin@zuno.com' };
    setIsAuthenticated(true);
    setCurrentUser(adminUser);
    setActiveTab('admin');
    window.location.hash = 'admin';
    setIsWaitlistOpen(false);
    localStorage.setItem('zuno_auth_session', JSON.stringify(adminUser));
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('zuno_auth_session');
    setActiveTab('landing-page');
    window.location.hash = 'landing-page';
  };

  if (activeTab === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (activeTab === 'dashboard' && isAuthenticated) {
    return (
      <UserDashboard 
        user={currentUser}
        onSwitchToLanding={handleLogout} 
      />
    );
  }

  return (
    <div className="bg-[#F8FAFC] font-body-md text-slate-800 antialiased selection:bg-pink-500 selection:text-white min-h-screen">
      
      <Header 
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex flex-col relative w-full pt-16 pb-24 md:pb-12 bg-[#F8FAFC] min-h-screen">
        <div className="flex flex-col w-full overflow-hidden">
          
          <div className="relative w-full pb-space-xl">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-300/25 blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-80 -right-24 w-96 h-96 bg-cyan-300/25 blur-[110px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[680px] -left-20 w-96 h-96 bg-blue-200/35 blur-[110px] pointer-events-none rounded-full"></div>

            {activeTab === 'landing-page' && (
              <>
                <HeroSection 
                  onOpenWaitlist={() => setIsWaitlistOpen(true)}
                  onExplore={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                <WhyZunoSection />

                <FeaturesSection />

                <HowItWorksSection />

                <AiExperienceSection />

                <SafetySection />

                <VelvetMembershipSection 
                  onOpenWaitlist={() => setIsWaitlistOpen(true)} 
                />

                <div className="mt-space-xl pt-12 max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center" id="join-waitlist">
                  <div className="w-full rounded-2xl bg-white border border-cyan-200 p-8 sm:p-12 shadow-[0_12px_40px_rgba(6,182,212,0.12)] relative overflow-hidden flex flex-col items-center">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-100/60 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 mb-4 shadow-sm relative z-10">
                      <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight max-w-xl relative z-10">
                      Your next genuine connection is closer than you think.
                    </h2>
                    
                    <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-lg relative z-10">
                      Join thousands of mindful singles saying goodbye to ghosting, game-playing, and superficial fatigue.
                    </p>

                    <div className="mt-8 w-full sm:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
                      <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="h-12 px-8 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-base font-semibold shadow-[0_6px_24px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Sign In &amp; Join Deck</span>
                        <span className="material-symbols-outlined text-[20px]">bolt</span>
                      </button>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-slate-700 text-xs sm:text-sm relative z-10">
                      <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-slate-800">phone_iphone</span>
                        <span>iOS App Store</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-slate-800">android</span>
                        <span>Google Play</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-xl pb-space-sm flex flex-col items-center text-center gap-4 max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                    <span className="material-symbols-outlined text-[20px] text-cyan-600">lock</span>
                    <span>Zero ads. Zero sale of behavioral data. Guaranteed.</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                    <a className="hover:text-cyan-600 transition-colors" href="#">Privacy Charter</a>
                    <a className="hover:text-cyan-600 transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-cyan-600 transition-colors" href="#">Safety Pledge</a>
                    <a className="hover:text-cyan-600 transition-colors" href="#">Community Ethos</a>
                  </div>
                  <span className="text-xs text-slate-800 font-bold mt-1">
                    © 2026 Zen4Tech Solution. All rights reserved.
                  </span>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <AiMatchTab onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            )}

            {activeTab === 'encounters' && (
              <SparksTab onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            )}

            {activeTab === 'membership' && (
              <MembershipTab onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            )}

          </div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onAdminLogin={handleAdminLogin}
      />
    </div>
  );
}
