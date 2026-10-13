import React, { useState, useMemo } from 'react';

const mockMatches = [
  { id: 'M-10293', userA: 'James W. (ID: 3321)', userB: 'Sarah S. (ID: 4412)', date: '2026-10-09', status: 'Active' },
  { id: 'M-10294', userA: 'Emily R. (ID: 5542)', userB: 'Mike T. (ID: 1123)', date: '2026-10-08', status: 'Reported', complaint: 'Inappropriate behavior in chat' },
  { id: 'M-10295', userA: 'Isabella C. (ID: 9921)', userB: 'John D. (ID: 8492)', date: '2026-10-07', status: 'Unmatched' },
  { id: 'M-10296', userA: 'Lisa M. (ID: 2211)', userB: 'Tom B. (ID: 6677)', date: '2026-10-07', status: 'Active' },
  { id: 'M-10297', userA: 'Alex P. (ID: 1122)', userB: 'Chloe K. (ID: 3344)', date: '2026-10-06', status: 'Reported', complaint: 'Suspected scam/fraud bot' },
];

export default function AdminMatches() {
  const [matches, setMatches] = useState(mockMatches);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [actionReason, setActionReason] = useState('');
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredMatches = useMemo(() => {
    let res = matches;
    if (statusFilter !== 'All') res = res.filter(m => m.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(m => m.id.toLowerCase().includes(q) || m.userA.toLowerCase().includes(q) || m.userB.toLowerCase().includes(q));
    }
    return res;
  }, [matches, search, statusFilter]);

  const handleResolveComplaint = () => {
    if (!actionReason) {
      alert("Please enter resolution notes.");
      return;
    }
    setMatches(prev => prev.map(m => m.id === selectedMatch.id ? { ...m, status: 'Active', complaintResolved: true, resolutionNotes: actionReason } : m));
    showToast(`Complaint resolved for match ${selectedMatch.id}`);
    setSelectedMatch(null);
    setActionReason('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Matches & Connections</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Monitor aggregate match statistics and handle match-related complaints.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <button 
          onClick={() => setStatusFilter('All')}
          className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-start text-left transition-all cursor-pointer ${statusFilter === 'All' ? 'bg-white border-pink-500 ring-1 ring-pink-500 shadow-md' : 'bg-white border-slate-200 hover:border-pink-300 hover:shadow-sm'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase truncate w-full">Total Matches</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">1,840</span>
        </button>
        <button 
          onClick={() => setStatusFilter('Active')}
          className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-start text-left transition-all cursor-pointer ${statusFilter === 'Active' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-md' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase truncate w-full">Active Chats</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">1,402</span>
        </button>
        <button 
          onClick={() => setStatusFilter('Unmatched')}
          className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-start text-left transition-all cursor-pointer ${statusFilter === 'Unmatched' ? 'bg-slate-50 border-slate-500 ring-1 ring-slate-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase truncate w-full">Unmatched</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">421</span>
        </button>
        <button 
          onClick={() => setStatusFilter('Reported')}
          className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-start text-left transition-all cursor-pointer ${statusFilter === 'Reported' ? 'bg-rose-100 border-rose-500 ring-1 ring-rose-500 shadow-md' : 'bg-rose-50/50 border-rose-200 hover:border-rose-300 hover:shadow-sm hover:bg-rose-50'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase truncate w-full">Active Complaints</span>
          <span className="text-xl sm:text-2xl font-extrabold text-rose-700 mt-1">{matches.filter(m => m.status === 'Reported').length}</span>
        </button>
      </div>

      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search Match ID or User name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
        </div>
        
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-pink-500 w-full sm:w-auto">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Reported">Reported</option>
          <option value="Unmatched">Unmatched</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Match ID</th>
                <th className="p-4">User A</th>
                <th className="p-4">User B</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatches.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 text-sm font-bold text-slate-900">{m.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{m.userA}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{m.userB}</td>
                  <td className="p-4 text-sm font-medium text-slate-500">{m.date}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      m.status === 'Reported' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {m.status === 'Reported' ? (
                      <button onClick={() => setSelectedMatch(m)} className="text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-full transition-all shadow-sm shadow-rose-500/20">
                        Investigate
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">No Action Required</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredMatches.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm font-bold text-slate-400">No matches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
          {filteredMatches.map(m => (
            <div key={m.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-pink-500 text-base">favorite</span>
                  <span className="text-xs font-black text-slate-900">{m.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">{m.date}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                    m.status === 'Reported' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Users connection card */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                <div className="flex flex-col flex-1 truncate pr-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">User A</span>
                  <span className="font-bold text-slate-800 truncate text-[11px]">{m.userA}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                </div>
                <div className="flex flex-col flex-1 truncate pl-2 text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">User B</span>
                  <span className="font-bold text-slate-800 truncate text-[11px]">{m.userB}</span>
                </div>
              </div>

              {/* Complaint if present */}
              {m.complaint && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-rose-600 text-sm shrink-0 mt-0.5">warning</span>
                  <div>
                    <span className="font-bold">Complaint:</span> {m.complaint}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {m.status === 'Reported' ? (
                <button 
                  onClick={() => setSelectedMatch(m)} 
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">search_check</span>
                  Investigate Complaint
                </button>
              ) : (
                <div className="text-[11px] font-semibold text-slate-400 text-center py-0.5">
                  No moderation required
                </div>
              )}
            </div>
          ))}
          {filteredMatches.length === 0 && (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No matches found.</div>
          )}
        </div>
      </div>

      {selectedMatch && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl sm:rounded-t-[2rem]">
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Match Complaint: {selectedMatch.id}</h3>
                <span className="text-xs font-bold text-slate-500 mt-1">Between {selectedMatch.userA} and {selectedMatch.userB}</span>
              </div>
              <button onClick={() => {setSelectedMatch(null); setActionReason('');}} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 sm:p-4">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Complaint Detail</span>
                <p className="text-xs sm:text-sm font-medium text-rose-900 mt-1">{selectedMatch.complaint}</p>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <label className="text-xs sm:text-sm font-extrabold text-slate-900">Resolution & Audit Notes</label>
                <textarea 
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Enter resolution notes and audit actions taken..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 h-24 resize-none"
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
                <button onClick={() => {setSelectedMatch(null); setActionReason('');}} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button onClick={handleResolveComplaint} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md">Resolve Complaint</button>
              </div>
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
