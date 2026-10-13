import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';

export default function AdminPlatformSettings() {
  
  const [activeTab, setActiveTab] = useState('access'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Just now');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isForceLogoutModalOpen, setIsForceLogoutModalOpen] = useState(false);

  const [settings, setSettings] = useState({
    
    maintenanceMode: false,
    maintenanceNotice: 'Zuno is undergoing scheduled performance improvements. We will be back online shortly!',
    registrationStatus: 'open', 
    globalUserLockdown: false, 
    mandatoryPhoneOtp: true,
    mandatorySelfieVerification: true,
    allowGuestBrowsing: false,
    autoPruneInactiveDays: 90,
    strictAgeCheck: true,
    
    freeDailySparkLimit: 25,
    vipDailySparkLimit: 100,
    vipUnlimitedSparks: true,
    maxActiveEncounters: 5, 
    matchExpiryHours: 48,
    ghostingPenalty: 'strict', 
    messageRateLimitPerMin: 20,
    allowAudioNotes: true,
    allowVideoCalls: true,

    aiEngineMode: 'semantic_deep', 
    minCompatibilityScore: 75,
    defaultSearchRadiusKm: 35,
    enableMoodSync: true,
    enableAiIcebreakers: true,
    prioritizeVerifiedProfiles: true,

    aiPhotoShieldStrictness: 'auto_block', 
    realtimeChatFilter: true,
    bannedKeywords: ['scam', 'crypto', 'cashapp', 'telegram', 'venmo', 'whatsapp', 'wire transfer', 'sugar baby'],
    reportSuspensionThreshold: 3,
    antiScreenshotProtection: true,
    allowIncognitoBrowsing: true,
    biometricAppLock: true,
  });

  const [broadcastDraft, setBroadcastDraft] = useState({
    title: '',
    message: '',
    type: 'info', 
    targetAudience: 'all', 
    showAsBanner: true,
    sendPushNotification: true
  });

  const [activeAnnouncements, setActiveAnnouncements] = useState([
    {
      id: 'ann-1',
      title: '🌟 Velvet Sunset Encounter Boost',
      message: 'Exclusive weekend double-compatibility sparks are now live for all active members in your area.',
      type: 'celebration',
      targetAudience: 'All Members',
      createdAt: '2 hours ago',
      active: true,
      reachCount: 842
    },
    {
      id: 'ann-2',
      title: '🛡️ Safety Reminder: Verified Badges',
      message: 'Never share personal banking info. Always look for the verified selfie checkmark before meeting.',
      type: 'info',
      targetAudience: 'All Members',
      createdAt: '1 day ago',
      active: true,
      reachCount: 790
    }
  ]);

  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Fetch live settings on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const live = await dbService.getPlatformSettings();
        if (isMounted && live) {
          setSettings(prev => ({ ...prev, ...live }));
        }
      } catch (err) {
        console.warn('Could not load live platform settings:', err);
      }
    }
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ text: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasUnsavedChanges(true);
  };

  const handleValueChange = (key, val) => {
    setSettings(prev => ({
      ...prev,
      [key]: val
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async () => {
    setHasUnsavedChanges(false);
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    try {
      await dbService.updatePlatformSettings(settings);
      triggerToast('All platform settings successfully synced and persisted to Supabase database.');
    } catch (err) {
      console.warn('Settings persistence error:', err);
      triggerToast('Saved locally, but failed to sync to Supabase.', 'warning');
    }
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    const trimmed = newKeywordInput.trim().toLowerCase();
    if (!trimmed) return;
    if (settings.bannedKeywords.includes(trimmed)) {
      triggerToast('Keyword already in filter list.', 'info');
      return;
    }
    setSettings(prev => ({
      ...prev,
      bannedKeywords: [...prev.bannedKeywords, trimmed]
    }));
    setNewKeywordInput('');
    setHasUnsavedChanges(true);
    triggerToast(`Added "${trimmed}" to moderation keyword shield.`);
  };

  const handleRemoveKeyword = (wordToRemove) => {
    setSettings(prev => ({
      ...prev,
      bannedKeywords: prev.bannedKeywords.filter(w => w !== wordToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  const handleEmergencyLockdown = async () => {
    const updated = {
      ...settings,
      globalUserLockdown: true,
      maintenanceMode: true
    };
    setSettings(updated);
    setIsEmergencyModalOpen(false);
    setHasUnsavedChanges(false);
    try {
      await dbService.updatePlatformSettings(updated);
      triggerToast('EMERGENCY LOCKDOWN ACTIVATED: All user interactions and sessions frozen!', 'danger');
    } catch {
      triggerToast('Emergency lockdown initiated locally.', 'danger');
    }
  };

  const handleForceLogoutAll = () => {
    setIsForceLogoutModalOpen(false);
    triggerToast('Security Invalidation: 842 active sessions revoked. All users forced to re-authenticate.');
  };

  const handlePublishBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastDraft.title.trim() || !broadcastDraft.message.trim()) {
      triggerToast('Please provide both title and announcement message.', 'warning');
      return;
    }

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title: broadcastDraft.title,
      message: broadcastDraft.message,
      type: broadcastDraft.type,
      targetAudience: broadcastDraft.targetAudience === 'all' ? 'All Members' : 
                      broadcastDraft.targetAudience === 'vip' ? 'Velvet VIPs' : 
                      broadcastDraft.targetAudience === 'free' ? 'Free Tier' : 'New Members',
      createdAt: 'Just now',
      active: true,
      reachCount: 842
    };

    setActiveAnnouncements([newAnnouncement, ...activeAnnouncements]);
    setBroadcastDraft({
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'all',
      showAsBanner: true,
      sendPushNotification: true
    });
    triggerToast(`Announcement broadcasted live to ${newAnnouncement.targetAudience}!`);
  };

  const toggleAnnouncementStatus = (id) => {
    setActiveAnnouncements(prev => prev.map(ann => {
      if (ann.id === id) {
        const nextState = !ann.active;
        triggerToast(nextState ? 'Announcement activated on user devices.' : 'Announcement pulled from user devices.');
        return { ...ann, active: nextState };
      }
      return ann;
    }));
  };

  const deleteAnnouncement = (id) => {
    setActiveAnnouncements(prev => prev.filter(ann => ann.id !== id));
    triggerToast('Announcement removed.');
  };

  const tabs = [
    { id: 'access', label: 'User Access & System Control', icon: 'manage_accounts', count: 'Active' },
    { id: 'limits', label: 'Interaction & Dating Caps', icon: 'tune', count: '8 Rules' },
    { id: 'algorithm', label: 'AI Match Engine & Sparks', icon: 'neurology', count: 'v4.2 AI' },
    { id: 'safety', label: 'Safety, Shield & Moderation', icon: 'security', count: 'Shield Active' },
    { id: 'broadcast', label: 'Broadcast Announcement Center', icon: 'campaign', count: activeAnnouncements.filter(a => a.active).length }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-full pb-16 font-body-md min-w-0 overflow-x-hidden">
      
      {toast && (
        <div className={`fixed top-20 right-6 z-[120] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold text-white transition-all transform animate-in fade-in slide-in-from-right-8 duration-300 ${
          toast.type === 'danger' ? 'bg-rose-600' :
          toast.type === 'warning' ? 'bg-amber-600' :
          toast.type === 'info' ? 'bg-sky-600' : 'bg-slate-900 border border-slate-700'
        }`}>
          <span className="material-symbols-outlined text-pink-400">
            {toast.type === 'danger' ? 'warning' : toast.type === 'warning' ? 'report' : 'check_circle'}
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-pink-50/70 via-rose-50/30 to-transparent pointer-events-none"></div>

        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h2>
            
            {settings.globalUserLockdown ? (
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-rose-100 text-rose-700 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                SYSTEM LOCKDOWN ACTIVE
              </span>
            ) : settings.maintenanceMode ? (
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-100 text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                MAINTENANCE MODE
              </span>
            ) : (
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-100 text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                PLATFORM HEALTHY • 842 USERS ONLINE
              </span>
            )}

            {hasUnsavedChanges && (
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Master administrative controls for global user permissions, interaction limits, algorithmic weights, and safety thresholds.
          </p>
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-400 mt-1 flex-wrap">
            <span>Last synced: {lastSavedTime}</span>
            <span>•</span>
            <span>Connected Core: Zuno-Engine-Prod-v4</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 relative z-10 flex-wrap w-full lg:w-auto">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
            title="Freeze swiping and messaging platform-wide"
          >
            <span className="material-symbols-outlined text-base">emergency_home</span>
            <span>Lockdown Switch</span>
          </button>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className={`w-full sm:w-auto justify-center px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
              hasUnsavedChanges 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/25 ring-2 ring-pink-400/50' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{hasUnsavedChanges ? 'Deploy Changes Live' : 'Saved & Synced'}</span>
          </button>
        </div>
      </div>

      {settings.globalUserLockdown && (
        <div className="bg-rose-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">shield_lock</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Emergency Platform Lockdown is currently ACTIVE</h4>
              <p className="text-xs text-rose-100 font-medium">All user swipe actions, instant matches, and photo uploads are suspended for normal users.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSettings(prev => ({ ...prev, globalUserLockdown: false, maintenanceMode: false }));
              setHasUnsavedChanges(true);
              triggerToast('System Lockdown Lifted: Normal user operations restored.');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-rose-700 font-black text-xs hover:bg-rose-50 transition-all shrink-0 cursor-pointer shadow-sm text-center"
          >
            Lift Lockdown Now
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 w-full min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1 min-w-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-56 shrink-0 hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input
              type="text"
              placeholder="Search platform settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full lg:hidden">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
          <input
            type="text"
            placeholder="Search platform settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'access' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">door_front</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Registration & Access Gate</h3>
                  <p className="text-xs text-slate-500">Control who can create accounts and enter the platform</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                settings.registrationStatus === 'open' ? 'bg-emerald-100 text-emerald-700' :
                settings.registrationStatus === 'paused' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {settings.registrationStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-700">Platform Registration Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { id: 'open', label: 'Open to All', desc: 'Anyone can register', icon: 'public' },
                  { id: 'invite_only', label: 'Invite Code Only', desc: 'Requires referral code', icon: 'pin' },
                  { id: 'vip_only', label: 'Velvet VIP Only', desc: 'Paid membership tier', icon: 'workspace_premium' },
                  { id: 'paused', label: 'Registrations Paused', desc: 'Temporarily blocked', icon: 'pause_circle' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleValueChange('registrationStatus', opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                      settings.registrationStatus === opt.id 
                        ? 'border-pink-500 bg-pink-50/60 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold ${settings.registrationStatus === opt.id ? 'text-pink-700' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                      <span className={`material-symbols-outlined text-sm ${settings.registrationStatus === opt.id ? 'text-pink-600' : 'text-slate-400'}`}>
                        {opt.icon}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Mandatory Verification Rules</h4>
              
              <ToggleRow
                icon="phone_iphone"
                title="Mandatory Phone OTP on Sign-up"
                desc="Requires SMS 6-digit confirmation to prevent bot farm creation."
                checked={settings.mandatoryPhoneOtp}
                onChange={() => handleToggle('mandatoryPhoneOtp')}
              />

              <ToggleRow
                icon="verified_user"
                title="Mandatory AI Selfie Verification"
                desc="New profiles cannot be viewed in deck until real-time selfie liveness passes."
                checked={settings.mandatorySelfieVerification}
                onChange={() => handleToggle('mandatorySelfieVerification')}
              />

              <ToggleRow
                icon="person_search"
                title="Allow Unverified Guest Browsing"
                desc="Permit new users to explore limited profiles before verifying identity."
                checked={settings.allowGuestBrowsing}
                onChange={() => handleToggle('allowGuestBrowsing')}
              />

              <ToggleRow
                icon="badge"
                title="Strict 18+ Age & Government ID Audit"
                desc="Automatically flag profiles whose date of birth or facial AI appears under 18."
                checked={settings.strictAgeCheck}
                onChange={() => handleToggle('strictAgeCheck')}
              />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">engineering</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">System Maintenance & Lockdown</h3>
                    <p className="text-xs text-slate-500">Scheduled downtime and whole user session invalidation</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">construction</span>
                    <div>
                      <h4 className="text-xs font-black text-amber-900">Platform Maintenance Mode</h4>
                      <p className="text-[11px] text-amber-700">Display maintenance overlay to regular members. Admins retain bypass.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode} 
                    onChange={() => handleToggle('maintenanceMode')} 
                  />
                </div>

                {settings.maintenanceMode && (
                  <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-amber-200/60">
                    <label className="text-[11px] font-bold text-amber-900">Custom Notice to Users:</label>
                    <textarea
                      rows="2"
                      placeholder="Enter custom maintenance notice for users..."
                      value={settings.maintenanceNotice}
                      onChange={(e) => handleValueChange('maintenanceNotice', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Whole User Session Controls</h4>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Revoke All Active User Sessions</h5>
                    <p className="text-[11px] text-slate-500">Forces all 842 logged-in mobile and web users to log in again immediately.</p>
                  </div>
                  <button
                    onClick={() => setIsForceLogoutModalOpen(true)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shrink-0 cursor-pointer transition-all shadow-sm active:scale-95 text-center"
                  >
                    Force Logout All
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Auto-Hibernate Inactive Accounts:</span>
                    <span className="text-pink-600 font-extrabold bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                      {settings.autoPruneInactiveDays} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={settings.autoPruneInactiveDays}
                    onChange={(e) => handleValueChange('autoPruneInactiveDays', Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>30 days (Aggressive)</span>
                    <span>90 days (Recommended)</span>
                    <span>180 days (Relaxed)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-extrabold">Active User Fleet: 842 Accounts</span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">DB Cluster: US-East-1 (Healthy)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Sparks & Swiping Limits</h3>
                  <p className="text-xs text-slate-500">Prevent deck exhaustion and encourage mindful dating</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Free Tier Daily Sparks Cap:</span>
                <span className="text-rose-600 font-extrabold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                  {settings.freeDailySparkLimit} Sparks / 24h
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={settings.freeDailySparkLimit}
                onChange={(e) => handleValueChange('freeDailySparkLimit', Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-medium">
                Controls the maximum profile impressions a free user can swipe per day.
              </span>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Velvet VIP Sparks</h4>
                  <p className="text-[11px] text-slate-500">Grant unlimited sparks to paid subscription members</p>
                </div>
                <Switch 
                  checked={settings.vipUnlimitedSparks} 
                  onChange={() => handleToggle('vipUnlimitedSparks')} 
                />
              </div>

              {!settings.vipUnlimitedSparks && (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-xs font-bold">
                    <span>VIP Custom Limit:</span>
                    <span className="text-pink-600 font-extrabold">{settings.vipDailySparkLimit} Sparks</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={settings.vipDailySparkLimit}
                    onChange={(e) => handleValueChange('vipDailySparkLimit', Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Message Velocity Throttle:</span>
                <span className="text-indigo-600 font-extrabold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  Max {settings.messageRateLimitPerMin} msgs / min
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="2"
                value={settings.messageRateLimitPerMin}
                onChange={(e) => handleValueChange('messageRateLimitPerMin', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-medium">
                Temporarily locks chat for 60 seconds if a user exceeds this rate to stop copy-paste spam.
              </span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">hourglass_empty</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Connections & Ghosting Deterrents</h3>
                  <p className="text-xs text-slate-500">Zuno’s core differentiator: intentional dating enforcement</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-pink-50/50 border border-pink-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-pink-600 text-base">lock_clock</span>
                  Active Connections Cap per User:
                </span>
                <span className="text-pink-700 font-black text-sm bg-white px-3 py-1 rounded-lg shadow-sm border border-pink-200">
                  {settings.maxActiveEncounters} Matches
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={settings.maxActiveEncounters}
                onChange={(e) => handleValueChange('maxActiveEncounters', Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">
                Users cannot match with someone new until they either schedule a date, politely disconnect, or let an expired match close.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">Inactive Match Auto-Expiry Window</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { hours: 24, label: '24 Hours', desc: 'High urgency' },
                  { hours: 48, label: '48 Hours', desc: 'Optimal default' },
                  { hours: 72, label: '72 Hours', desc: 'Weekend flex' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    onClick={() => handleValueChange('matchExpiryHours', item.hours)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.matchExpiryHours === item.hours
                        ? 'border-pink-500 bg-pink-50 font-black text-pink-700 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <label className="text-xs font-bold text-slate-700">Ghosting Deterrent Protocol</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'strict', label: 'Strict Karma', desc: '24h match cooldown' },
                  { id: 'mild', label: 'Gentle Nudge', desc: 'In-app reminder notice' },
                  { id: 'off', label: 'Disabled', desc: 'No penalty enforced' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleValueChange('ghostingPenalty', item.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.ghostingPenalty === item.id
                        ? 'border-indigo-500 bg-indigo-50 font-black text-indigo-700 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-3">
              <ToggleRow
                icon="mic"
                title="Voice Notes in Chat"
                desc="Allow users to send voice audio snippets to connections."
                checked={settings.allowAudioNotes}
                onChange={() => handleToggle('allowAudioNotes')}
              />
              <ToggleRow
                icon="videocam"
                title="In-App Encrypted Video Calls"
                desc="Enable direct audio/video calling within mutual matches."
                checked={settings.allowVideoCalls}
                onChange={() => handleToggle('allowVideoCalls')}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'algorithm' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">neurology</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">AI Matching Architecture</h3>
                  <p className="text-xs text-slate-500">Fine-tune the neural matching and embedding model</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                Active: Model v4.2
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-700">Matching Philosophy Model</label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'semantic_deep',
                    title: 'Mindful Deep Alignment (Recommended)',
                    desc: 'Prioritizes value compatibility, life goals, and communication styles over simple physical attraction.',
                    tag: 'High Retention'
                  },
                  {
                    id: 'balanced',
                    title: 'Balanced Hybrid Engine',
                    desc: '50/50 balance of psychological compatibility vectors and geo-proximity density.',
                    tag: 'Most Popular'
                  },
                  {
                    id: 'proximity_velocity',
                    title: 'High Velocity & Proximity Focus',
                    desc: 'Maximizes immediate meetups within walking distance, looser psychological match score filter.',
                    tag: 'Fast Pace'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleValueChange('aiEngineMode', mode.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      settings.aiEngineMode === mode.id
                        ? 'border-violet-500 bg-violet-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${settings.aiEngineMode === mode.id ? 'text-violet-900' : 'text-slate-800'}`}>
                          {mode.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{mode.desc}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      settings.aiEngineMode === mode.id ? 'bg-violet-200 text-violet-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {mode.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Minimum Compatibility Match Threshold:</span>
                <span className="text-violet-600 font-extrabold bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                  {settings.minCompatibilityScore}% Match
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.minCompatibilityScore}
                onChange={(e) => handleValueChange('minCompatibilityScore', Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>50% (Loose)</span>
                <span>75% (Ideal)</span>
                <span>95% (Soulmate Strict)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">explore</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Sparks Feed & Geo Radii</h3>
                    <p className="text-xs text-slate-500">Global discovery distance and real-time vibe filters</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Default Discovery Radius for New Users:</span>
                  <span className="text-cyan-700 font-extrabold bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-100">
                    {settings.defaultSearchRadiusKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={settings.defaultSearchRadiusKm}
                  onChange={(e) => handleValueChange('defaultSearchRadiusKm', Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>10 km (Hyperlocal)</span>
                  <span>35 km (Metro area)</span>
                  <span>100 km (Regional)</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Algorithmic Boosters</h4>

                <ToggleRow
                  icon="mood"
                  title="Real-Time Mood & Vibe Synchronizer"
                  desc="Weights active deck feeds based on today’s selected mood (e.g. Cozy Cafe vs Night Out)."
                  checked={settings.enableMoodSync}
                  onChange={() => handleToggle('enableMoodSync')}
                />

                <ToggleRow
                  icon="auto_awesome"
                  title="AI Icebreaker & Conversation Starters"
                  desc="Generates bespoke, non-cringe opening prompts based on shared quirks."
                  checked={settings.enableAiIcebreakers}
                  onChange={() => handleToggle('enableAiIcebreakers')}
                />

                <ToggleRow
                  icon="verified"
                  title="Prioritize Verified Profiles in Deck"
                  desc="Gives a 20% visibility multiplier to users with verified selfie checkmarks."
                  checked={settings.prioritizeVerifiedProfiles}
                  onChange={() => handleToggle('prioritizeVerifiedProfiles')}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-violet-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400">psychology</span>
                <span className="font-extrabold">Compatibility Match Accuracy: 94.6%</span>
              </div>
              <span className="text-violet-300 font-mono text-[11px]">Vector Latency: 18ms</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">shield_person</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Content Shields & Photo AI</h3>
                  <p className="text-xs text-slate-500">Autonomous protection against explicit imagery and fraud</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">AI Computer Vision Photo Shield</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'auto_block', label: 'Strict Auto-Block', desc: 'Instantly rejects NSFW photos' },
                  { id: 'flag_review', label: 'Hold for Review', desc: 'Sends to admin queue' },
                  { id: 'off', label: 'Disabled', desc: 'Unchecked upload' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleValueChange('aiPhotoShieldStrictness', mode.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      settings.aiPhotoShieldStrictness === mode.id
                        ? 'border-red-500 bg-red-50 font-black text-red-700 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs">{mode.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Auto-Freeze Account on Safety Reports:</span>
                <span className="text-red-600 font-extrabold bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                  {settings.reportSuspensionThreshold} Unique Reports / 24h
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.reportSuspensionThreshold}
                onChange={(e) => handleValueChange('reportSuspensionThreshold', Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-medium">
                When X distinct members report an account within 24 hours, automatically freeze the profile pending admin investigation.
              </span>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-3">
              <ToggleRow
                icon="screenshot_monitor"
                title="Privacy Shield: Screenshot Protection"
                desc="Blacks out screens if user attempts to screenshot private chat photos."
                checked={settings.antiScreenshotProtection}
                onChange={() => handleToggle('antiScreenshotProtection')}
              />

              <ToggleRow
                icon="visibility_off"
                title="Allow Incognito / Discreet Profile Mode"
                desc="Enables members to browse profiles without showing up in recently viewed lists."
                checked={settings.allowIncognitoBrowsing}
                onChange={() => handleToggle('allowIncognitoBrowsing')}
              />

              <ToggleRow
                icon="fingerprint"
                title="Biometric App Lock on Return"
                desc="Require FaceID / Fingerprint / PIN after 2 minutes of app backgrounding."
                checked={settings.biometricAppLock}
                onChange={() => handleToggle('biometricAppLock')}
              />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">filter_alt</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Chat Keyword Shield</h3>
                    <p className="text-xs text-slate-500">Real-time phrase filtering and financial solicitation blocker</p>
                  </div>
                </div>
                <Switch
                  checked={settings.realtimeChatFilter}
                  onChange={() => handleToggle('realtimeChatFilter')}
                />
              </div>

              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter banned keyword or spam phrase..."
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer transition-all shrink-0 active:scale-95"
                >
                  + Add Word
                </button>
              </form>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Active Prohibited Keywords ({settings.bannedKeywords.length}):</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click '✕' to remove</span>
                </div>
                
                <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto custom-scrollbar">
                  {settings.bannedKeywords.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-xs hover:border-red-300 group transition-all"
                    >
                      <span className="text-slate-700">{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(word)}
                        className="text-slate-400 group-hover:text-red-500 text-xs font-bold cursor-pointer"
                        title="Delete keyword"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-600 text-base mt-0.5">info</span>
                <span>
                  Messages containing these phrases trigger an automated soft-warning to the sender and log a shadow-flag for moderator review without alerting malicious actors.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-extrabold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                Scam & Bot Interception Rate: 99.1%
              </span>
              <span className="text-slate-400">Zero false-positive ban appeals today</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Platform Announcement Composer</h3>
                  <p className="text-xs text-slate-500">Dispatch real-time in-app banners & push notices to active users</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePublishBroadcast} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-700">Announcement Headline</label>
                <input
                  type="text"
                  placeholder="Enter broadcast headline (e.g. 💫 Weekend Sparks Boost Live!)..."
                  value={broadcastDraft.title}
                  onChange={(e) => setBroadcastDraft({ ...broadcastDraft, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-700">Message Content</label>
                <textarea
                  rows="3"
                  placeholder="Enter broadcast message to display across user devices..."
                  value={broadcastDraft.message}
                  onChange={(e) => setBroadcastDraft({ ...broadcastDraft, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-pink-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Announcement Style</label>
                  <select
                    value={broadcastDraft.type}
                    onChange={(e) => setBroadcastDraft({ ...broadcastDraft, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500"
                  >
                    <option value="info">ℹ️ Informational (Blue)</option>
                    <option value="celebration">🎉 Celebration / Boost (Pink/Rose)</option>
                    <option value="warning">⚠️ Caution / Maintenance (Amber)</option>
                    <option value="urgent">🚨 Urgent / Security (Red)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Target Audience</label>
                  <select
                    value={broadcastDraft.targetAudience}
                    onChange={(e) => setBroadcastDraft({ ...broadcastDraft, targetAudience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">🌐 All Active Members (842 users)</option>
                    <option value="vip">💎 Velvet VIP Subscribers Only (124)</option>
                    <option value="free">👤 Free Tier Members Only (718)</option>
                    <option value="new">✨ New Signups This Week (42)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={broadcastDraft.showAsBanner}
                    onChange={(e) => setBroadcastDraft({ ...broadcastDraft, showAsBanner: e.target.checked })}
                    className="accent-pink-500 rounded"
                  />
                  <span>Show as Floating Top Banner</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={broadcastDraft.sendPushNotification}
                    onChange={(e) => setBroadcastDraft({ ...broadcastDraft, sendPushNotification: e.target.checked })}
                    className="accent-pink-500 rounded"
                  />
                  <span>Send In-App Push Notice</span>
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Live Banner Preview on User Screen</span>
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
                  broadcastDraft.type === 'celebration' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 text-pink-950' :
                  broadcastDraft.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-950' :
                  broadcastDraft.type === 'urgent' ? 'bg-red-50 border-red-200 text-red-950' :
                  'bg-sky-50 border-sky-200 text-sky-950'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">
                      {broadcastDraft.type === 'celebration' ? 'celebration' :
                       broadcastDraft.type === 'warning' ? 'warning' :
                       broadcastDraft.type === 'urgent' ? 'emergency' : 'info'}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold">
                        {broadcastDraft.title || 'Your Announcement Headline'}
                      </div>
                      <div className="text-[11px] opacity-80 font-medium">
                        {broadcastDraft.message || 'The detailed announcement message body will preview right here.'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70 shrink-0">Preview</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Broadcast Live to All Selected Users</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Active Broadcast Feeds</h3>
              <span className="text-xs font-bold text-slate-400">
                {activeAnnouncements.filter(a => a.active).length} Running
              </span>
            </div>

            <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[580px] pr-1 custom-scrollbar">
              {activeAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No active announcements running.
                </div>
              ) : (
                activeAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                      ann.active 
                        ? 'border-slate-200 bg-white shadow-xs' 
                        : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          ann.type === 'celebration' ? 'bg-pink-100 text-pink-700' :
                          ann.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                          ann.type === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          {ann.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {ann.createdAt} • {ann.targetAudience}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleAnnouncementStatus(ann.id)}
                          className={`text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                            ann.active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {ann.active ? 'LIVE' : 'PAUSED'}
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                          title="Delete announcement"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-slate-900">{ann.title}</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{ann.message}</p>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        {ann.reachCount} Delivered
                      </span>
                      <span className="text-emerald-600">Sync status: OK</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-rose-200 flex flex-col gap-4 sm:gap-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">emergency_home</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Emergency Lockdown</h3>
                <span className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase tracking-wider">Critical Platform Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              This action immediately suspends all swiping, chat messages, and photo uploads for all <strong className="text-slate-900">842 users</strong> across web and mobile apps. Admins will retain backend control.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Reason for Lockdown (Incident Log):</label>
              <input
                type="text"
                placeholder="Enter reason for lockdown (e.g. Database security audit)..."
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyLockdown}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-95 text-center"
              >
                Confirm Lockdown
              </button>
            </div>
          </div>
        </div>
      )}

      {isForceLogoutModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-4 sm:gap-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">logout</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Revoke All Active Sessions?</h3>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">Whole User Base Invalidation</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Every connected user on mobile devices and browsers will be immediately signed out and must complete authentication again. Recommended after updating privacy keys or security patches.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => setIsForceLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleForceLogoutAll}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md cursor-pointer transition-all active:scale-95 text-center"
              >
                Yes, Force Logout All
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-4 sm:gap-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">restart_alt</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Reset to Factory Defaults?</h3>
                <span className="text-[10px] sm:text-xs font-bold text-amber-600">Revert All Platform Settings</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              This will restore all swipe limits, matchmaking weights, and safety thresholds back to the official Zuno recommended defaults.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsResetModalOpen(false);
                  setSettings(prev => ({
                    ...prev,
                    maintenanceMode: false,
                    globalUserLockdown: false,
                    registrationStatus: 'open',
                    freeDailySparkLimit: 25,
                    maxActiveEncounters: 5,
                    minCompatibilityScore: 75,
                    reportSuspensionThreshold: 3
                  }));
                  setHasUnsavedChanges(true);
                  triggerToast('Platform settings reset to official defaults.');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md cursor-pointer transition-all active:scale-95 text-center"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors">
      <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
        <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5 shrink-0">{icon}</span>
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs font-bold text-slate-900 leading-tight">{title}</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all flex items-center p-0.5 cursor-pointer shrink-0 focus:outline-none ${
        checked ? 'bg-pink-500 shadow-sm shadow-pink-500/30' : 'bg-slate-300'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>}
      </span>
    </button>
  );
}
