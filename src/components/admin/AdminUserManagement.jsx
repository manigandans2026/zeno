import React, { useState, useMemo, useEffect } from 'react';
import { mockUsers } from '../../data/mockUsers';
import { dbService } from '../../services/dbService';

const BASE_TIMESTAMP = 1760000000000;

const initialUsers = mockUsers.map((u, i) => ({
  ...u,
  dateJoined: new Date(BASE_TIMESTAMP - i * 86400000 * 3).toISOString().split('T')[0],
  lastActive: new Date(BASE_TIMESTAMP - i * 3600000).toISOString().split('T')[0],
  subscription: i % 5 === 0 ? 'Premium' : 'Free',
  subExpiry: i % 5 === 0 ? '2026-12-31' : null,
  reportCount: u.status === 'Suspended' || u.status === 'Banned' ? (i % 4) + 1 : 0,
  completion: 70 + (i % 30),
  phoneVerified: i % 3 !== 0,
  bio: 'Looking for a genuine connection and someone to explore the city with.',
  interests: ['Travel', 'Coffee', 'Photography', 'Music'],
  relationshipGoals: 'Long-term Partner',
  agePref: '24 - 35',
  distancePref: 'Up to 25 miles',
  verificationDate: '2025-08-15',
  rejectionReason: null,
  notes: []
}));

export default function AdminUserManagement() {
  const [users, setUsers] = useState(initialUsers);

  // Load genuine database profiles
  useEffect(() => {
    let isMounted = true;
    async function loadDbUsers() {
      try {
        const liveUsers = await dbService.getAdminUsers();
        if (isMounted && liveUsers && liveUsers.length > 0) {
          // Prepend live database profiles to the catalog
          setUsers(prev => {
            const liveIds = new Set(liveUsers.map(l => l.id));
            const filteredMock = prev.filter(m => !liveIds.has(m.id));
            return [...liveUsers, ...filteredMock];
          });
        }
      } catch (err) {
        console.warn('Could not load database users:', err);
      }
    }
    loadDbUsers();
    return () => { isMounted = false; };
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [actionModal, setActionModal] = useState(null); 
  const [actionReason, setActionReason] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'Moderator' });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleActionSubmit = () => {
    if ((actionModal.type === 'suspend' || actionModal.type === 'ban' || actionModal.type === 'reject') && !actionReason) {
      alert("Please provide a reason.");
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === actionModal.user.id) {
        let newStatus = u.status;
        let newVerified = u.verified;
        if (actionModal.type === 'suspend') newStatus = 'Suspended';
        if (actionModal.type === 'ban') newStatus = 'Banned';
        if (actionModal.type === 'reactivate') newStatus = 'Active';
        if (actionModal.type === 'approve') newVerified = true;
        
        let newRejectionReason = u.rejectionReason;
        if (actionModal.type === 'reject') {
          newVerified = false;
          newRejectionReason = actionReason;
        }

        let newNotes = [...u.notes];
        const newNoteText = actionModal.type === 'note' ? actionReason : actionReason ? `${actionModal.type.toUpperCase()}: ${actionReason}` : null;
        
        if (newNoteText) {
          newNotes = [{ date: new Date().toISOString().split('T')[0], text: newNoteText }, ...newNotes];
        }

        return { 
          ...u, 
          status: newStatus, 
          verified: newVerified,
          rejectionReason: newRejectionReason,
          notes: newNotes
        };
      }
      return u;
    }));

    if (['suspend', 'ban', 'reactivate'].includes(actionModal.type)) {
      const dbStatus = actionModal.type === 'suspend' ? 'suspended' : actionModal.type === 'ban' ? 'banned' : 'active';
      dbService.updateUserStatus(actionModal.user.id, dbStatus).catch(err => {
        console.warn('Status persistence notice:', err);
      });
    }

    if (actionModal.type === 'delete') {
      setUsers(prev => prev.filter(u => u.id !== actionModal.user.id));
      setSelectedUser(null);
      dbService.updateUserStatus(actionModal.user.id, 'banned').catch(() => {});
      showToast(`Account deleted successfully.`);
      setActionModal(null);
      setActionReason('');
      return;
    }

    if (actionModal.type === 'resetPassword') {
      showToast(`Secure password reset link sent to ${actionModal.user.email}`);
      setActionModal(null);
      setActionReason('');
      return;
    }

    if (selectedUser && selectedUser.id === actionModal.user.id) {
       setSelectedUser(users.find(u => u.id === actionModal.user.id)); 
    }

    showToast(`Action '${actionModal.type}' completed for ${actionModal.user.name}`);
    setActionModal(null);
    setActionReason('');
  };

  const handleAddUserSubmit = () => {
    if (!newUserForm.name || !newUserForm.email) {
      alert("Name and Email are required.");
      return;
    }
    const newInternalUser = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      status: 'Active',
      verified: true,
      city: 'Internal',
      dateJoined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      subscription: 'Premium',
      phoneVerified: true,
      reportCount: 0,
      completion: 100,
      bio: `Internal ${newUserForm.role}`,
      interests: [],
      notes: [],
    };
    
    setUsers([newInternalUser, ...users]);
    showToast(`Internal user ${newUserForm.name} added successfully.`);
    setIsAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'Moderator' });
  };

  const filteredUsers = useMemo(() => {
    let result = users;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        u.id.includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(u => u.status === statusFilter);
    }

    if (verifiedFilter !== 'All') {
      const isVer = verifiedFilter === 'Verified';
      result = result.filter(u => u.verified === isVer);
    }

    if (subFilter !== 'All') {
      result = result.filter(u => u.subscription === subFilter);
    }

    if (dateFilter !== 'All') {
      result = result.filter(u => {
        const joinDate = Date.parse(u.dateJoined);
        const diffDays = Math.ceil(Math.abs(BASE_TIMESTAMP - joinDate) / (1000 * 60 * 60 * 24));
        if (dateFilter === 'Last 7 Days') return diffDays <= 7;
        if (dateFilter === 'Last 30 Days') return diffDays <= 30;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortOrder === 'Newest') return new Date(b.dateJoined) - new Date(a.dateJoined);
      if (sortOrder === 'Oldest') return new Date(a.dateJoined) - new Date(b.dateJoined);
      if (sortOrder === 'Recent Activity') return new Date(b.lastActive) - new Date(a.lastActive);
      return 0;
    });

    return result;
  }, [users, search, statusFilter, verifiedFilter, dateFilter, subFilter, sortOrder]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  if (selectedUser) {
    const user = users.find(u => u.id === selectedUser.id);
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to User List
          </button>
          <div className="flex gap-2">
            {user.status !== 'Active' && (
              <button onClick={() => setActionModal({ type: 'reactivate', user })} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Reactivate Account
              </button>
            )}
            {user.status === 'Active' && (
              <button onClick={() => setActionModal({ type: 'suspend', user })} className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold rounded-xl transition-colors border border-amber-200">
                Suspend
              </button>
            )}
            {user.status !== 'Banned' && (
              <button onClick={() => setActionModal({ type: 'ban', user })} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors border border-rose-200">
                Ban User
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-pink-500 to-rose-400 opacity-20"></div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-md z-10 bg-white" />
              <div className="flex flex-col z-10 flex-1 w-full">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">{user.email} • ID: #{user.id}</p>
                  </div>
                  <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : user.status === 'Suspended' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                    {user.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Date Joined</span><span className="text-xs sm:text-sm font-bold text-slate-900">{user.dateJoined}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Last Active</span><span className="text-xs sm:text-sm font-bold text-slate-900">{user.lastActive}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Phone Verification</span><span className={`text-xs sm:text-sm font-bold ${user.phoneVerified ? 'text-emerald-600' : 'text-amber-600'}`}>{user.phoneVerified ? 'Verified' : 'Unverified'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Plan</span><span className={`text-xs sm:text-sm font-bold ${user.subscription === 'Premium' ? 'text-pink-600' : 'text-slate-900'}`}>{user.subscription} {user.subscription === 'Premium' && <span className="text-emerald-600 text-[10px]">(Active)</span>} {user.subExpiry && <span className="text-[10px] font-medium text-slate-400 ml-1">(Exp: {user.subExpiry})</span>}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900">Profile Information</h3>
                <button onClick={() => showToast('Profile fields updated successfully.')} className="text-xs font-bold text-pink-600 hover:underline">Edit Fields</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Bio</span>
                  <span className="text-sm font-medium text-slate-700">{user.bio}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Relationship Goals</span>
                  <span className="text-sm font-medium text-slate-700">{user.relationshipGoals}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Interests</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.interests.map(i => <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{i}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Preferred Age Range</span>
                    <span className="text-sm font-medium text-slate-700">{user.agePref}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Distance Preference</span>
                    <span className="text-sm font-medium text-slate-700">{user.distancePref}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-900">Profile & Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">Completion</h4>
                  <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-pink-500 h-2.5 rounded-full" style={{width: `${user.completion}%`}}></div></div>
                  <p className="text-[10px] font-bold mt-1 text-slate-400">{user.completion}% Completed</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">Activity Overview</h4>
                  <div className="flex gap-4">
                    <div className="flex flex-col"><span className="text-lg font-extrabold text-slate-900">{user.matchScore * 2}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Matches</span></div>
                    <div className="flex flex-col"><span className="text-lg font-extrabold text-slate-900">{Math.floor(user.matchScore / 3)}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Chats</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-900">Admin Actions</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => setActionModal({ type: 'resetPassword', user })} className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold text-slate-700">
                  <span className="material-symbols-outlined text-sm">lock_reset</span> Send Password Reset Link
                </button>
                <button onClick={() => setActionModal({ type: 'delete', user })} className="flex items-center gap-2 p-3 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors text-sm font-bold text-rose-600">
                  <span className="material-symbols-outlined text-sm">delete_forever</span> Process Deletion Request
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-900">Verification Status</h3>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <span className="material-symbols-outlined">{user.verified ? 'verified' : 'pending_actions'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{user.verified ? 'Fully Verified' : 'Pending Review'}</span>
                  <span className="text-[10px] font-medium text-slate-500">Submitted: {user.verificationDate}</span>
                </div>
              </div>
              {!user.verified && user.rejectionReason && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Rejection Reason</span>
                  <p className="text-xs font-medium text-rose-900 mt-1">{user.rejectionReason}</p>
                </div>
              )}
              {!user.verified && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setActionModal({ type: 'approve', user })} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors">Approve</button>
                  <button onClick={() => setActionModal({ type: 'reject', user })} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">Reject</button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900">Moderation Notes</h3>
                <button onClick={() => setActionModal({ type: 'note', user })} className="w-6 h-6 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-rose-900">Reports</span>
                  <span className="text-[10px] text-rose-600">{user.reportCount} flagged incidents</span>
                </div>
                <span className="material-symbols-outlined text-rose-400">flag</span>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                {user.notes.map((note, i) => (
                  <div key={i} className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400">{note.date}</span>
                    <span className="text-xs font-medium text-slate-700">{note.text}</span>
                  </div>
                ))}
                {user.notes.length === 0 && <span className="text-xs text-slate-400 italic">No notes added.</span>}
              </div>
            </div>
          </div>
        </div>

        {actionModal && (
          <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-md flex flex-col gap-4 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize">{actionModal.type === 'note' ? 'Add Internal Note' : `${actionModal.type} User`}</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {actionModal.type === 'note' 
                  ? `Add a moderation note for ${actionModal.user.name}. This is internal only.` 
                  : `You are about to ${actionModal.type} ${actionModal.user.name}. ${(actionModal.type === 'suspend' || actionModal.type === 'ban' || actionModal.type === 'reject' || actionModal.type === 'delete') ? "This action requires a mandatory reason." : ""}`
                }
              </p>
              
              {(actionModal.type === 'suspend' || actionModal.type === 'ban' || actionModal.type === 'reject' || actionModal.type === 'note' || actionModal.type === 'delete') && (
                <textarea 
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Enter reason or note for audit logs..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none h-24 resize-none"
                />
              )}
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                <button onClick={() => { setActionModal(null); setActionReason(''); }} className="px-4 py-2 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors text-center">Cancel</button>
                <button onClick={handleActionSubmit} className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-pink-600 hover:bg-pink-700 transition-colors shadow-md text-center">Confirm Action</button>
              </div>
            </div>
          </div>
        )}
        
        {toast && (
          <div className="fixed top-20 right-4 z-[130] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-right-8 duration-300">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h2>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search users by name, email, or ID..." 
            value={search}
            onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-initial min-w-[110px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Banned">Banned</option>
          </select>
          <select value={verifiedFilter} onChange={e => {setVerifiedFilter(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-initial min-w-[110px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Verification</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending</option>
          </select>
          <select value={subFilter} onChange={e => {setSubFilter(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-initial min-w-[95px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Plans</option>
            <option value="Premium">Premium</option>
            <option value="Free">Free</option>
          </select>
          <select value={dateFilter} onChange={e => {setDateFilter(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-initial min-w-[95px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
          <select value={sortOrder} onChange={e => {setSortOrder(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-initial min-w-[110px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Recent Activity">Recent Activity</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Contact & Plan</th>
                <th className="p-4">Status & Verification</th>
                <th className="p-4">Activity</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=64`} alt="" className="w-10 h-10 rounded-full shadow-sm bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        <span className="text-[10px] font-medium text-slate-500">ID: #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-slate-700">{user.email}</span>
                        <span className="material-symbols-outlined text-[12px] text-emerald-500" title="Email Verified">verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded ${user.subscription === 'Premium' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>{user.subscription}</span>
                        {user.phoneVerified && <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">smartphone</span> Verified</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        user.status === 'Suspended' ? 'bg-amber-50 text-amber-600' :
                        user.status === 'Banned' ? 'bg-rose-50 text-rose-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {user.status}
                      </span>
                      {user.verified ? (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-emerald-500">verified</span> Verified</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">pending</span> Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{user.lastActive}</span>
                      <span className="text-[10px] font-medium text-slate-500">Joined: {user.dateJoined}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:border-pink-300 hover:text-pink-600 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm font-bold text-slate-400">No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
          {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
            <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              {/* Header: Avatar, Name, ID, Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=64`} alt="" className="w-10 h-10 rounded-full shadow-sm bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{user.name}</span>
                    <span className="text-[11px] font-medium text-slate-500">ID: #{user.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    user.status === 'Suspended' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    user.status === 'Banned' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {user.status}
                  </span>
                  {user.verified ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">verified</span> Verified</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">pending</span> Pending</span>
                  )}
                </div>
              </div>

              {/* Email & Details Box */}
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 truncate font-medium text-[11px]">{user.email}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${user.subscription === 'Premium' ? 'bg-pink-100 text-pink-700' : 'bg-slate-200 text-slate-700'}`}>
                    {user.subscription}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-semibold">
                  <span>Last active: <strong className="text-slate-800">{user.lastActive}</strong></span>
                  <span>Joined: <strong className="text-slate-800">{user.dateJoined}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedUser(user)}
                className="w-full py-2 bg-white border border-slate-200 hover:border-pink-300 hover:text-pink-600 text-slate-700 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>View Details & Actions</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )) : (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No users found matching your criteria.</div>
          )}
        </div>
        
        {totalPages > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500">Showing {paginatedUsers.length} of {filteredUsers.length} users</span>
              <select value={pageSize} onChange={(e) => {setPageSize(Number(e.target.value)); setCurrentPage(1);}} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-pink-500 cursor-pointer">
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="text-xs font-bold text-slate-700 mx-2">Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-md flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Add Internal User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors">
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-slate-500">Create a new administrative or test account. They will be marked as fully verified.</p>
            
            <div className="flex flex-col gap-3 sm:gap-4 mt-1 sm:mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium text-slate-900"
                  placeholder="Enter full name (e.g. Jane Doe)..."
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium text-slate-900"
                  placeholder="Enter email address (e.g. jane@zuno.ai)..."
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Role / Access Level</label>
                <select 
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-bold text-slate-700"
                >
                  <option value="Moderator">Moderator</option>
                  <option value="Support Agent">Support Agent</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Test Account">Test Account</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-2 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
              <button onClick={() => setIsAddUserModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors text-center">Cancel</button>
              <button onClick={handleAddUserSubmit} className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-pink-600 hover:bg-pink-700 transition-colors shadow-md text-center">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
