import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import ProfileCard from './ProfileCard';
import ConnectionRadarPanel from './ConnectionRadarPanel';
import ProfileDetailModal from './ProfileDetailModal';
import MoodModal from './MoodModal';
import MatchSuccessModal from './MatchSuccessModal';
import MatchesView from './MatchesView';
import ChatView from './ChatView';
import AiAssistantView from './AiAssistantView';
import ProfileView from './ProfileView';
import PremiumView from './PremiumView';
import SettingsView from './SettingsView';
import CompatibilityView from './CompatibilityView';
import { dbService } from '../../services/dbService';
import { mockUsers } from '../../data/mockUsers';

export default function UserDashboard({ onSwitchToLanding, user: initialUser }) {
  
  const [activeNav, setActiveNav] = useState('discover'); 
  const [hasVisitedMatches, setHasVisitedMatches] = useState(false);
  const [hasVisitedChat, setHasVisitedChat] = useState(false);

  const handleSetActiveNav = (nav) => {
    if (nav === 'matches') {
      setHasVisitedMatches(true);
    }
    if (nav === 'chat') {
      setHasVisitedChat(true);
    }
    setActiveNav(nav);
  };
  
  const [activeIntentFilter, setActiveIntentFilter] = useState('all');

  const [user, setUser] = useState(() => ({
    name: initialUser?.name || 'Kavya',
    fullName: initialUser?.fullName || 'Kavya Krishnan',
    photo: initialUser?.photo || '',
    age: initialUser?.age || 28, 
    profession: initialUser?.profession || 'Architectural Designer', 
    location: initialUser?.location || 'Brooklyn, NY',
    intent: initialUser?.intent || 'Slow Romance',
    bio: initialUser?.bio || 'Designing sustainable timber pavilions by day, exploring Red Hook vinyl listening bars by night. Looking for slow, intentional romance.',
    interests: initialUser?.interests || ['Analog Vinyl', 'Brutalism', 'Matcha', '35mm Film', 'Nordic Cinema', 'Trail Running'],
    compatibility: initialUser?.compatibility || { score: 94, topTraits: ['Creative Spirit', 'Deep Conversations', 'Sunday Rituals'] },
    sparkLevel: initialUser?.sparkLevel || 4,
    isVerified: initialUser?.isVerified ?? true,
    mood: initialUser?.mood || 'Introspective & Open',
    id: initialUser?.id || null
  }));

  const [activeProfileModal, setActiveProfileModal] = useState(null);
  const [gridLayout, setGridLayout] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [matchedProfileModal, setMatchedProfileModal] = useState(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatSelectedPartner, setChatSelectedPartner] = useState(null);
  const [compatibilityPartner, setCompatibilityPartner] = useState(null);

  const handleViewCompatibility = (partner) => {
    setCompatibilityPartner(partner);
    setActiveNav('compatibility');
  };
  
  const [toastMessage, setToastMessage] = useState(null);

  // Load profiles from database with fallback to seed deck
  const [profiles, setProfiles] = useState(() => 
    mockUsers.map((u, index) => {
      const categories = ['dating', 'talk', 'friends', 'long-term'];
      const labels = ['Slow Romance', 'Deep Talks', 'Creative Spark', 'Long-term Partner'];
      const tagIndex = index % 4;
      const allInterests = ['Analog Vinyl', 'Indie Cinema', 'Matcha', 'Modular Synths', 'Brutalism', 'Ceramics', 'Pour Over', 'Nordic Noir', 'Trail Running', 'Biophilic Art', 'Fermentation', 'Books'];
      const deterministicInterests = allInterests.slice(index % 5, (index % 5) + 4);

      let photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff&size=256`;
      if (index === 0) photo = '/avatars/kavin_new.jpg';
      if (index === 1) photo = '/avatars/ananya_new.jpg';
      if (index === 2) photo = '/avatars/surya_new.jpg';

      return {
        id: u.id,
        name: u.name.split(' ')[0],
        age: u.age,
        profession: ['Sound Designer', 'Architect', 'Biotech Researcher', 'Creative Director', 'Artist', 'Writer'][index % 6],
        location: `${u.city} (${(index * 1.2 + 0.5).toFixed(1)} mi)`,
        photo: photo,
        compatibility: u.matchScore,
        intentCategory: categories[tagIndex],
        intentLabel: labels[tagIndex],
        secondaryTag: ['Audio Creator', 'Design & Form', 'Bio-Design', '35mm Film'][tagIndex],
        interests: deterministicInterests,
        aiInsight: 'Shared overlap: High resonance based on your recent activity and preferences.',
        isActive: u.status === 'Active' && index % 4 === 0,
        activeTime: (u.status === 'Active' && index % 4 === 0) ? 'Active Now' : 'Active today',
        isVerified: u.verified
      };
    })
  );

  // Fetch genuine profiles from dbService and maintain presence
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const liveProfiles = await dbService.getDiscoverProfiles(user?.id);
        if (isMounted && liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
      } catch (err) {
        console.warn('Profile load notice:', err);
      }
    }
    loadData();

    if (user?.id) {
      dbService.touchPresence(user.id);
      const interval = setInterval(() => {
        dbService.touchPresence(user.id);
      }, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  const [likedIds, setLikedIds] = useState(new Set());
  const [passedIds, setPassedIds] = useState(new Set());

  const filterChips = [
    { id: 'all', label: 'All Resonances' },
    { id: 'talk', label: 'Talk' },
    { id: 'friends', label: 'Friends' },
    { id: 'dating', label: 'Dating' },
    { id: 'long-term', label: 'Long-term' }
  ];

  const handleLike = async (profile) => {
    setLikedIds(prev => new Set(prev).add(profile.id));
    setMatchedProfileModal(profile);
    triggerToast(`Connected with ${profile.name}! Mutual spark recorded.`);
    if (user?.id) {
      await dbService.recordSpark(user.id, profile.id, profile.compatibility);
    }
  };

  const handlePass = async (profile) => {
    setPassedIds(prev => new Set(prev).add(profile.id));
    triggerToast(`Passed ${profile.name} for today's deck.`);
    if (user?.id) {
      await dbService.recordPass(user.id, profile.id);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateUser = async (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    
    // Update local session cache
    const currentSession = localStorage.getItem('zuno_auth_session');
    if (currentSession) {
      try {
        const parsed = JSON.parse(currentSession);
        localStorage.setItem('zuno_auth_session', JSON.stringify({ ...parsed, ...updatedData }));
      } catch {
        // silent
      }
    }

    // Persist to Supabase if logged in
    if (user?.id) {
      try {
        const payload = {};
        if (updatedData.fullName || updatedData.name) payload.full_name = updatedData.fullName || updatedData.name;
        if (updatedData.age) payload.age = parseInt(updatedData.age) || undefined;
        if (updatedData.profession) payload.profession = updatedData.profession;
        if (updatedData.location) payload.location = updatedData.location;
        if (updatedData.intent) payload.intent = updatedData.intent;
        if (updatedData.bio) payload.bio = updatedData.bio;
        if (updatedData.interests) payload.interests = updatedData.interests;
        if (updatedData.mood) payload.mood = updatedData.mood;

        await dbService.updateProfile(user.id, payload);
      } catch (err) {
        console.warn('Could not persist profile update:', err);
      }
    }
  };

  const handleOpenChatWithPartner = (profile) => {
    setChatSelectedPartner(profile);
    setActiveNav('chat');
  };

  const handleRefresh = () => {
    setProfiles(prev => [...prev].sort(() => Math.random() - 0.5));
    triggerToast("Dashboard refreshed!");
  };

  const filteredProfiles = profiles.filter(p => {
    if (passedIds.has(p.id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || 
                            p.profession.toLowerCase().includes(q) || 
                            p.interests.some(i => i.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    if (activeIntentFilter === 'all') return true;
    return p.intentCategory === activeIntentFilter;
  });

  const likedProfilesList = profiles.filter(p => likedIds.has(p.id));

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-body-md text-slate-800 antialiased selection:bg-pink-500 selection:text-white">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <span className="material-symbols-outlined text-pink-400 text-base">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <DashboardSidebar 
        activeNav={activeNav}
        setActiveNav={handleSetActiveNav}
        user={user}
        onSwitchToLanding={onSwitchToLanding}
        hasVisitedMatches={hasVisitedMatches}
        hasVisitedChat={hasVisitedChat}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <DashboardHeader 
        user={user}
        onSwitchToLanding={onSwitchToLanding}
        setActiveNav={handleSetActiveNav}
        activeNav={activeNav}
        hasVisitedMatches={hasVisitedMatches}
        hasVisitedChat={hasVisitedChat}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <main className={`relative pt-20 w-full px-4 md:px-6 lg:px-8 bg-[#F8FAFC] ${
          activeNav === 'chat' || activeNav === 'ai-assistant'
            ? 'h-[calc(100vh-4rem)] lg:h-screen pb-4 lg:pb-5 flex flex-col overflow-hidden'
            : 'pb-8 lg:pb-12 min-h-screen'
        }`}>
          
          {activeNav === 'discover' && (
            <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Good morning, {user.name} <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
                  </h1>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Here are today's curated resonances based on your intent, mood frequency, and conversation rhythm. Zero infinite swipe, pure intentional alignment.
                  </p>
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex flex-wrap items-center gap-2" id="intent-pills">
                  {filterChips.map(chip => {
                    const isActive = activeIntentFilter === chip.id;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => setActiveIntentFilter(chip.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white shadow-md shadow-pink-500/20'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <section className="lg:col-span-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Recommended for you
                      </h2>
                    </div>

                    <div className="flex items-center gap-1 relative">
                      {showSearch && (
                        <input
                          autoFocus
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search profiles by name, profession..."
                          className="w-32 sm:w-48 px-3 py-1 text-xs rounded-full border border-slate-200 outline-none focus:border-pink-300"
                        />
                      )}
                      <button 
                        onClick={() => setShowSearch(!showSearch)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white transition-colors cursor-pointer ${showSearch ? 'bg-white' : ''}`}
                        title="Search Profiles"
                      >
                        <span className="material-symbols-outlined text-lg">search</span>
                      </button>
                      <button 
                        onClick={handleRefresh}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white transition-colors cursor-pointer"
                        title="Refresh Deck"
                      >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                      </button>
                      <button 
                        onClick={() => setGridLayout(!gridLayout)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white transition-colors cursor-pointer"
                        title="Toggle Layout"
                      >
                        <span className="material-symbols-outlined text-lg">{gridLayout ? 'view_agenda' : 'grid_view'}</span>
                      </button>
                    </div>
                  </div>

                  {filteredProfiles.length > 0 ? (
                    <div className={gridLayout ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
                      {filteredProfiles.map((prof) => (
                        <ProfileCard 
                          key={prof.id}
                          profile={prof}
                          isLiked={likedIds.has(prof.id)}
                          isPassed={passedIds.has(prof.id)}
                          onLike={handleLike}
                          onPass={handlePass}
                          onViewProfile={setActiveProfileModal}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                      <span className="material-symbols-outlined text-4xl text-pink-500">task_alt</span>
                      <h3 className="text-lg font-bold text-slate-900">Deck Reviewed for Today</h3>
                      <p className="text-xs text-slate-600 max-w-md">
                        You've thoughtfully reviewed all matches for this intent filter. New curated resonances will refresh at 08:00 AM.
                      </p>
                    </div>
                  )}

                </section>

                <section className="lg:col-span-4">
                  <ConnectionRadarPanel 
                    topProfileName={profiles[0]?.name || "Kavin"}
                    userMood={user.mood}
                    onOpenMoodModal={() => setIsMoodModalOpen(true)}
                    onCopyIcebreaker={() => triggerToast("Icebreaker copied to clipboard!")}
                  />
                </section>
              </div>

            </div>
          )}

          {activeNav === 'matches' && (
            <MatchesView 
              likedProfilesList={likedProfilesList}
              onStartChat={handleOpenChatWithPartner}
            />
          )}

          {activeNav === 'chat' && (
            <ChatView 
              selectedProfile={chatSelectedPartner}
              onViewCompatibility={handleViewCompatibility}
              currentUser={user}
            />
          )}

          {activeNav === 'ai-assistant' && (
            <AiAssistantView user={user} profiles={profiles} />
          )}

          {activeNav === 'profile' && (
            <ProfileView 
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onUpdateBio={(bio) => handleUpdateUser({ bio })} 
            />
          )}

          {activeNav === 'premium' && (
            <PremiumView />
          )}

          {activeNav === 'settings' && (
            <SettingsView 
              user={user} 
              onLogout={onSwitchToLanding}
            />
          )}

          {activeNav === 'compatibility' && (
            <CompatibilityView 
              partner={compatibilityPartner || profiles[0]}
              onStartChat={handleOpenChatWithPartner}
              onBack={() => setActiveNav('discover')}
            />
          )}

        </main>
      </div>

      {activeProfileModal && (
        <ProfileDetailModal 
          profile={activeProfileModal}
          isLiked={likedIds.has(activeProfileModal.id)}
          onClose={() => setActiveProfileModal(null)}
          onLike={handleLike}
          onPass={handlePass}
        />
      )}

      {isMoodModalOpen && (
        <MoodModal 
          isOpen={isMoodModalOpen}
          currentMood={user.mood}
          onClose={() => setIsMoodModalOpen(false)}
          onSaveMood={(newMood) => {
            handleUpdateUser({ mood: newMood });
            triggerToast(`Today's Mood set to ${newMood}`);
          }}
        />
      )}

      {matchedProfileModal && (
        <MatchSuccessModal 
          profile={matchedProfileModal}
          onClose={() => setMatchedProfileModal(null)}
          onStartChat={(profile) => {
            setMatchedProfileModal(null);
            handleOpenChatWithPartner(profile);
          }}
        />
      )}
    </div>
  );
}
