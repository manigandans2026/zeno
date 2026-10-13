import React, { useState } from 'react';
import { dbService } from '../../services/dbService';

export default function SettingsView({ onLogout, user = null }) {
  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem('zuno_user_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return user?.settings || {
      stealthMode: false,
      readReceipts: true,
      aiSuggestions: true,
      pushNotifications: true,
      emailDigest: true,
      cadenceLimit: true
    };
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSetting = async (key) => {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    localStorage.setItem('zuno_user_settings', JSON.stringify(next));
    triggerToast(`Setting updated: ${key} is now ${next[key] ? 'Enabled' : 'Disabled'}`);

    if (user?.id) {
      try {
        await dbService.updateProfile(user.id, { settings: next });
      } catch (err) {
        console.warn('Could not sync settings to database:', err);
      }
    }
  };

  const sections = [
    {
      title: 'Account & Profile',
      icon: 'person',
      items: [
        { label: 'Name, email, phone, profile photo, date of birth', sub: 'Manage personal details', action: () => setActivePanel('accountProfile') }
      ]
    },
    {
      title: 'Dating Preferences',
      icon: 'favorite',
      items: [
        { label: 'Preferred age range, distance, interests, relationship goals', sub: 'Update match criteria', action: () => setActivePanel('datingPreferences') }
      ]
    },
    {
      title: 'Privacy & Safety',
      icon: 'shield',
      items: [
        { label: 'Profile visibility, blocked users, reporting and safety controls', sub: 'Manage safety settings', action: () => setActivePanel('privacySafety') }
      ]
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      items: [
        { label: 'Likes, matches, messages, reminders and email alerts', sub: 'Update notification preferences', action: () => setActivePanel('notifications') }
      ]
    },
    {
      title: 'Login & Security',
      icon: 'lock',
      items: [
        { label: 'Change password, active sessions, two-factor authentication', sub: 'Secure your account', action: () => setActivePanel('loginSecurity') }
      ]
    },
    {
      title: 'AI Preferences',
      icon: 'auto_awesome',
      items: [
        { label: 'AI dating assistant, profile suggestions, conversation assistance', sub: 'Configure AI integrations', action: () => setActivePanel('aiPreferences') }
      ]
    },
    {
      title: 'Subscription & Billing',
      icon: 'credit_card',
      items: [
        { label: 'Current plan, renewal, payment history and cancellation', sub: 'Manage your subscription', action: () => setActivePanel('subscription') }
      ]
    },
    {
      title: 'Help & Support',
      icon: 'help_outline',
      items: [
        { label: 'FAQs, contact support, feedback and community guidelines', sub: 'Get help and support', action: () => setActivePanel('helpSupport') }
      ]
    },
    {
      title: 'Account Management',
      icon: 'manage_accounts',
      items: [
        { label: 'Pause account, download data, delete account', sub: 'Manage data and account status', action: () => setActivePanel('accountManagement') },
        { label: 'Log out', sub: 'End your current session', action: onLogout }
      ]
    }
  ];

  const renderPanelContent = () => {
    const handleSave = (e, msg) => {
      e.preventDefault();
      triggerToast(msg);
      setActivePanel(null);
    };

    switch(activePanel) {
      case 'accountProfile':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "Profile Details Saved successfully!")}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-900">Profile Photo</label>
              <input type="file" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Full Name</label><input type="text" defaultValue="Elena Vance" placeholder="Enter your full name..." required className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Email Address</label><input type="email" defaultValue="elena@zuno.ai" placeholder="Enter your email address..." required className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Phone Number</label><input type="tel" defaultValue="+1 555-0198" placeholder="Enter your phone number..." required className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Date of Birth</label><input type="date" defaultValue="1998-10-24" required className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all cursor-pointer">Save Changes</button>
          </form>
        );
      case 'datingPreferences':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "Dating Preferences Saved!")}>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Preferred Age Range</label><input type="text" defaultValue="25-35" placeholder="Enter preferred age range (e.g. 25-35)..." className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Maximum Distance (miles)</label><input type="number" defaultValue="15" placeholder="Enter maximum distance in miles..." className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Interests</label><input type="text" defaultValue="Analog Vinyl, Brutalism, Matcha" placeholder="Enter interests separated by commas..." className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Relationship Goals</label>
              <select className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium">
                <option>Slow Romance</option><option>Casual</option><option>Long-Term</option><option>Friends</option>
              </select>
            </div>
            <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all cursor-pointer">Save Preferences</button>
          </form>
        );
      case 'privacySafety':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "Privacy & Safety Settings Saved!")}>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Public Profile Visibility</span></label>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Incognito Mode (Hide Views)</span></label>
             <button type="button" className="text-left text-sm text-rose-600 font-bold p-3 border border-rose-200 rounded-xl hover:bg-rose-50 cursor-pointer">Manage Blocked Users</button>
             <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 cursor-pointer">Save Settings</button>
          </form>
        );
      case 'notifications':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "Notification Preferences Saved!")}>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Likes & Matches Alerts</span></label>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Message Notifications</span></label>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Email Batch Digest</span></label>
             <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 cursor-pointer">Save Settings</button>
          </form>
        );
      case 'loginSecurity':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "Security Settings Updated!")}>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">Current Password</label><input type="password" placeholder="Enter your current password..." className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">New Password</label><input type="password" placeholder="Enter your new password..." className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium" /></div>
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</span></label>
            <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 cursor-pointer">Update Security</button>
          </form>
        );
      case 'aiPreferences':
        return (
          <form className="flex flex-col gap-5" onSubmit={(e) => handleSave(e, "AI Preferences Saved!")}>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">AI Wingmate Suggestions</span></label>
             <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-pink-500 rounded cursor-pointer" /><span className="text-sm font-bold text-slate-900">AI Compatibility Analysis</span></label>
             <div className="flex flex-col gap-1.5"><label className="text-xs font-extrabold text-slate-900">AI Persona Tone</label>
               <select className="text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-slate-800 font-medium">
                 <option>Friendly & Natural</option><option>Flirty</option><option>Direct</option>
               </select>
             </div>
             <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 cursor-pointer">Save AI Preferences</button>
          </form>
        );
      case 'subscription':
        return (
          <div className="flex flex-col gap-5">
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-pink-700">Zuno Velvet Tier</h3>
                <p className="text-xs font-medium text-pink-600 mt-1">Next billing date: Nov 24, 2026</p>
              </div>
              <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
            </div>
            <button type="button" className="text-left text-sm text-slate-700 font-bold p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">View Payment History</button>
            <button type="button" className="text-left text-sm text-rose-600 font-bold p-3 border border-rose-200 rounded-xl hover:bg-rose-50 cursor-pointer">Cancel Subscription</button>
          </div>
        );
      case 'helpSupport':
        return (
          <div className="flex flex-col gap-4">
             <button type="button" onClick={() => triggerToast("Opening FAQs")} className="text-left text-sm text-slate-700 font-bold p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">Read FAQs</button>
             <button type="button" onClick={() => triggerToast("Opening Support Chat")} className="text-left text-sm text-slate-700 font-bold p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">Contact Support Team</button>
             <button type="button" onClick={() => triggerToast("Opening Community Guidelines")} className="text-left text-sm text-slate-700 font-bold p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">Community Guidelines</button>
          </div>
        );
      case 'accountManagement':
        return (
          <div className="flex flex-col gap-4">
             <button type="button" onClick={() => triggerToast("Account Paused!")} className="text-left text-sm text-amber-600 font-bold p-3 border border-amber-200 rounded-xl hover:bg-amber-50 cursor-pointer">Pause Account</button>
             <button type="button" onClick={() => triggerToast("Data download started.")} className="text-left text-sm text-slate-700 font-bold p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">Download Personal Data</button>
             <button type="button" onClick={() => triggerToast("Account deleted successfully.")} className="text-left text-sm text-rose-600 font-bold p-3 border border-rose-200 rounded-xl hover:bg-rose-50 cursor-pointer">Delete Account</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-4 text-slate-800 relative">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-pink-400 text-sm">settings</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {activePanel ? (
        <>
          
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
            <button onClick={() => setActivePanel(null)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0">
              <span className="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {sections.find(s => s.items.some(i => i.action.toString().includes(`'${activePanel}'`)))?.title || 'Settings'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">Update your preferences.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mt-4">
             {renderPanelContent()}
          </div>
        </>
      ) : (
        <>
          
          <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Settings &amp; Preferences
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Manage your account security, discovery range, privacy charter, and notification controls.
            </p>
          </div>

          <div className="flex flex-col gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-pink-600 font-extrabold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-lg">{sec.icon}</span>
              <span>{sec.title}</span>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {sec.items.map((item, itemIdx) => (
                <div key={itemIdx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{item.label}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.sub}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.toggleKey ? (
                      <input 
                        type="checkbox" 
                        checked={toggles[item.toggleKey]}
                        onChange={() => toggleSetting(item.toggleKey)}
                        className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                      />
                    ) : item.badge ? (
                      <span className="text-[10px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : item.valueText ? (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.isHighlight ? 'bg-pink-500 text-white shadow-sm cursor-pointer' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.valueText}
                      </span>
                    ) : (
                      <button 
                        onClick={item.action || (() => triggerToast(`Clicked ${item.label}`))}
                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </>
    )}
    </div>
  );
}
