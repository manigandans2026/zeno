import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { mockUsers } from '../../data/mockUsers';
import AdminUserManagement from './AdminUserManagement';
import AdminProfileVerification from './AdminProfileVerification';
import AdminReportsSafety from './AdminReportsSafety';
import AdminMatches from './AdminMatches';
import AdminChatModeration from './AdminChatModeration';
import AdminSubscriptionManagement from './AdminSubscriptionManagement';
import AdminPlatformSettings from './AdminPlatformSettings';
import { dbService } from '../../services/dbService';

export default function AdminDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeStatDetail, setActiveStatDetail] = useState(null);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 842,
    activeUsers: 215,
    premiumUsers: 124,
    openReports: 1,
    pendingVerifications: 3,
    totalMatches: 1840,
    isReal: false
  });

  React.useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const liveStats = await dbService.getAdminStats();
        if (isMounted && liveStats) {
          setStats(liveStats);
        }
      } catch (err) {
        console.warn('Admin stats load notice:', err);
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-6 sm:gap-8 w-full pb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Platform Overview</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              <StatCard onClick={() => setActiveStatDetail({ title: 'Total Registered Users', data: 'registered' })} title="Total Registered Users" value={String(stats.totalUsers)} change="+12% this month" color="text-slate-900" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Active Users (24h)', data: 'active' })} title="Active Users (24h)" value={String(stats.activeUsers)} change="+3% today" color="text-emerald-600" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'New Registrations', data: 'new' })} title="New Registrations" value={String(Math.round(stats.totalUsers * 0.05) || 42)} change="+15% this week" color="text-indigo-600" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Premium Subscribers', data: 'premium' })} title="Premium Subscribers" value={String(stats.premiumUsers)} change="+5% this month" color="text-pink-600" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Total Matches', data: 'matches' })} title="Total Matches" value={String(stats.totalMatches)} change="+8% this week" color="text-rose-500" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Pending Verifications', data: 'verifications' })} title="Pending Verifications" value={String(stats.pendingVerifications)} change="Action required" color="text-amber-500" isAlert />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Open Safety Reports', data: 'reports' })} title="Open Safety Reports" value={String(stats.openReports)} change="High priority" color="text-red-600" isAlert />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Suspended Accounts', data: 'suspended' })} title="Suspended Accounts" value="12" change="-2% this month" color="text-slate-500" />
              <StatCard onClick={() => setActiveStatDetail({ title: 'Banned Accounts', data: 'banned' })} title="Banned Accounts" value="5" change="+1% this month" color="text-slate-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-900">Registration Trend</h3>
                  <select className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-4 pt-4 border-b border-slate-100">
                  
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group h-full flex items-end">
                      <div className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${h}%` }}></div>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100">{h * 10}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-extrabold text-slate-900">User Account Status</h3>
                <div className="flex-1 flex flex-col justify-center gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-emerald-600">Active (82%)</span><span className="text-slate-900">690</span></div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"><div className="w-[82%] h-full bg-emerald-500 rounded-full"></div></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Inactive/Paused (15%)</span><span className="text-slate-900">126</span></div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"><div className="w-[15%] h-full bg-slate-400 rounded-full"></div></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-rose-500">Suspended/Banned (3%)</span><span className="text-slate-900">26</span></div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"><div className="w-[3%] h-full bg-rose-500 rounded-full"></div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h3 className="font-extrabold text-slate-900">Recent Registrations</h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {mockUsers.slice(0, 4).map((user, i) => (
                    <div 
                      key={user.id} 
                      onClick={() => {
                        setActiveStatDetail({ title: 'User Details', data: 'all' });
                        setSelectedUserForDetails(user);
                      }}
                      className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=64`} alt={user.name} className="w-8 h-8 rounded-full bg-slate-100 shadow-sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                          <span className="text-[10px] font-medium text-slate-500">{2 + i} mins ago • {user.city}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="font-extrabold text-slate-900 flex justify-between">Recent Reports <span className="text-rose-500 text-xs bg-rose-50 px-2 py-0.5 rounded-full">Open</span></h3>
                  <div className="flex flex-col gap-3">
                    {mockUsers.filter(u => u.status === 'Suspended' || u.status === 'Banned').slice(0, 2).map((user) => (
                      <div key={user.id} className="p-3 border border-rose-100 bg-rose-50/30 rounded-xl flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900">Flagged Behavior</span>
                        <span className="text-[10px] text-slate-500">Reported against {user.name} (ID: #{user.id})</span>
                        <button 
                          onClick={() => {
                            setActiveStatDetail({ title: 'Safety Report', data: 'reports' });
                            setSelectedUserForDetails(user);
                          }}
                          className="text-[10px] font-bold text-rose-600 mt-1 text-left hover:underline w-fit"
                        >
                          Review case →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="font-extrabold text-slate-900 flex justify-between">Pending Verification <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Review</span></h3>
                  <div className="flex flex-col gap-3">
                    {mockUsers.filter(u => !u.verified).slice(0, 2).map((user) => (
                      <div 
                        key={user.id}
                        onClick={() => {
                          setActiveStatDetail({ title: 'Pending Verification', data: 'verifications' });
                          setSelectedUserForDetails(user);
                        }}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-sm">face</span><span className="text-xs font-bold text-slate-700">Selfie Match: {user.name}</span></div>
                        <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h3 className="font-extrabold text-slate-900">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveStatDetail({ title: 'Global User Search', data: 'all' })}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-left"
                  >
                    <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-600">search</span><span className="text-sm font-bold text-slate-800">Find User Account</span></div>
                  </button>
                  <button 
                    onClick={() => triggerToast('Security protocol initiated: Target IP blocked.')}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-left"
                  >
                    <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-600">block</span><span className="text-sm font-bold text-slate-800">Suspend IP Address</span></div>
                  </button>
                  <button 
                    onClick={() => triggerToast('Global announcement broadcasted to all active users.')}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-left"
                  >
                    <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-600">campaign</span><span className="text-sm font-bold text-slate-800">Global Announcement</span></div>
                  </button>
                  <button 
                    onClick={() => triggerToast('Daily Report (CSV) downloaded successfully.')}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors border border-pink-200 text-left mt-2"
                  >
                    <div className="flex items-center gap-3"><span className="material-symbols-outlined text-pink-600">download</span><span className="text-sm font-bold text-pink-700">Export Daily Report</span></div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      case 'users':
        return <AdminUserManagement />;
      case 'verification':
        return <AdminProfileVerification />;
      case 'safety':
        return <AdminReportsSafety />;
      case 'matches':
        return <AdminMatches />;
      case 'chat':
        return <AdminChatModeration />;
      case 'subscription':
        return <AdminSubscriptionManagement />;
      case 'settings':
        return <AdminPlatformSettings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-400">construction</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Module under construction</h2>
            <p className="text-sm text-slate-500 font-medium max-w-md">The {activeNav} module is currently being built and will be available in the next administrative release.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-body-md text-slate-800 antialiased selection:bg-pink-500 selection:text-white flex w-full max-w-full overflow-x-hidden">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[110] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-right-8 duration-300">
          <span className="material-symbols-outlined text-pink-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminSidebar 
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLogout={onLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 lg:ml-72 min-h-screen relative flex flex-col min-w-0 max-w-full overflow-x-hidden">
        <header className="h-20 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40 shadow-sm gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-fit">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Open Admin Menu Bar"
              aria-label="Open Admin Menu Bar"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
              <span className="material-symbols-outlined text-white text-lg sm:text-xl font-bold">admin_panel_settings</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight capitalize leading-none">
                {activeNav.replace('-', ' ')}
              </h1>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest sm:hidden mt-0.5">Admin</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center relative group">
            <div className="absolute left-4 flex items-center justify-center text-slate-400 group-focus-within:text-pink-500 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              type="text" 
              placeholder="Search user by name, email, or ID (e.g., #8492)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-inner"
            />
            <div className="absolute right-3 flex items-center justify-center">
              <kbd className="hidden lg:inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-500 text-[10px] font-extrabold font-mono border border-slate-300">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-fit">
            <button 
              onClick={() => {
                setHasUnreadNotifications(false);
                triggerToast("You're all caught up! No new notifications.");
              }}
              className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
            >
              <span className="material-symbols-outlined text-slate-600">notifications</span>
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-pink-500 border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                KK
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900">Kavya Krishnan</span>
                <span className="text-[10px] text-pink-600 font-extrabold uppercase">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 lg:p-10 w-full max-w-[1440px] mx-auto pb-10 min-w-0">
          {renderContent()}
        </div>
      </main>

      {activeStatDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined font-bold">query_stats</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{activeStatDetail.title}</h2>
                  <p className="text-xs font-bold text-slate-500">Showing specific data records</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveStatDetail(null);
                  setModalSearch('');
                  setSelectedUserForDetails(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
              {selectedUserForDetails ? (
                
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setSelectedUserForDetails(null)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 w-fit cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to List
                  </button>
                  
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserForDetails.name)}&background=random&color=fff&size=128`}
                      alt={selectedUserForDetails.name} 
                      className="w-24 h-24 rounded-2xl bg-slate-200 shadow-md"
                    />
                    <div className="flex flex-col flex-1 gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900">{selectedUserForDetails.name}</h3>
                          <p className="text-sm font-medium text-slate-500">{selectedUserForDetails.email} • ID: #{selectedUserForDetails.id}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedUserForDetails.status === 'Suspended' ? 'bg-amber-50 text-amber-600' :
                          selectedUserForDetails.status === 'Banned' ? 'bg-rose-50 text-rose-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {selectedUserForDetails.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Age</span>
                          <span className="text-sm font-bold text-slate-900">{selectedUserForDetails.age}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">City</span>
                          <span className="text-sm font-bold text-slate-900">{selectedUserForDetails.city}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Match Score</span>
                          <span className="text-sm font-bold text-pink-600">{selectedUserForDetails.matchScore}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Verification</span>
                          <span className="text-sm font-bold text-slate-900">{selectedUserForDetails.verified ? 'Verified ✓' : 'Pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder={`Search within ${activeStatDetail.title}...`} 
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 shadow-sm"
                    />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/80 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-5">User / Entity</div>
                      <div className="col-span-4">Status</div>
                      <div className="col-span-3 text-right">Action</div>
                    </div>
                    
                    <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
                      {mockUsers
                        .filter(u => {
                          
                          if (activeStatDetail.data === 'suspended' && u.status !== 'Suspended') return false;
                          if (activeStatDetail.data === 'banned' && u.status !== 'Banned') return false;
                          if (activeStatDetail.data === 'reports' && u.status !== 'Suspended' && u.status !== 'Banned') return false;
                          if (activeStatDetail.data === 'verifications' && u.verified) return false;
                          
                          if (modalSearch) {
                            const q = modalSearch.toLowerCase();
                            if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) {
                              return false;
                            }
                          }
                          return true;
                        })
                        .map((user) => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                          <div className="col-span-5 flex items-center gap-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=64`}
                              alt={user.name} 
                              className="w-8 h-8 rounded-full bg-slate-200 shadow-sm"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">{user.name}</span>
                              <span className="text-[10px] font-medium text-slate-500">{user.email}</span>
                            </div>
                          </div>
                          <div className="col-span-4 flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              user.status === 'Suspended' ? 'bg-amber-50 text-amber-600' :
                              user.status === 'Banned' ? 'bg-rose-50 text-rose-600' :
                              'bg-emerald-50 text-emerald-600'
                            }`}>
                              {user.status}
                            </span>
                            {!user.verified && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">Unverified</span>
                            )}
                          </div>
                          <div className="col-span-3 flex justify-end">
                            <button 
                              onClick={() => setSelectedUserForDetails(user)}
                              className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, color, isAlert, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border ${isAlert ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'} shadow-sm flex flex-col gap-1.5 sm:gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group cursor-pointer`}
    >
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider z-10 truncate">{title}</span>
      <span className={`text-xl sm:text-3xl font-extrabold ${color} z-10`}>{value}</span>
      <span className={`text-[10px] sm:text-xs font-bold ${isAlert ? 'text-amber-600' : 'text-slate-500'} z-10 truncate`}>{change}</span>
      
      <div className={`absolute -bottom-6 -right-6 w-20 sm:w-24 h-20 sm:h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-current ${color}`}></div>
    </div>
  );
}
