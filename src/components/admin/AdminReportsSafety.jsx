import React, { useState, useMemo } from 'react';

const mockReports = [
  {
    id: 'RPT-8492-1',
    reporterName: 'Isabella C.',
    reporterId: '9921',
    reportedName: 'John Doe',
    reportedId: '8492',
    category: 'Harassment',
    description: 'Sent multiple unwanted inappropriate messages after being asked to stop.',
    submitDate: '2026-10-09',
    status: 'Open',
    moderator: null,
    resolutionNotes: null,
    evidenceContext: 'User sent 5 messages in 10 minutes containing profanity.'
  },
  {
    id: 'RPT-3321-2',
    reporterName: 'James W.',
    reporterId: '7721',
    reportedName: 'Sarah Smith',
    reportedId: '3321',
    category: 'Fake profile',
    description: 'Using photos of a known celebrity.',
    submitDate: '2026-10-08',
    status: 'Under Review',
    moderator: 'Admin Jane',
    resolutionNotes: null,
    evidenceContext: 'Profile images match reverse image search for a public figure.'
  },
  {
    id: 'RPT-1123-1',
    reporterName: 'Emily R.',
    reporterId: '5542',
    reportedName: 'Mike T.',
    reportedId: '1123',
    category: 'Scams or fraud',
    description: 'Asked for money for travel expenses.',
    submitDate: '2026-10-07',
    status: 'Resolved',
    moderator: 'Admin Jane',
    resolutionNotes: 'User was banned permanently for fraud.',
    evidenceContext: 'Message history shows crypto wallet links and requests for wire transfers.'
  },
  {
    id: 'RPT-8891-3',
    reporterName: 'David K.',
    reporterId: '4432',
    reportedName: 'Unknown Bot',
    reportedId: '8891',
    category: 'Spam',
    description: 'Sent the same promotional link 15 times.',
    submitDate: '2026-10-06',
    status: 'Open',
    moderator: null,
    resolutionNotes: null,
    evidenceContext: 'Automated high-frequency message sending detected with external links.'
  },
  {
    id: 'RPT-9012-1',
    reporterName: 'Lisa M.',
    reporterId: '2211',
    reportedName: 'Jane Smith',
    reportedId: '9012',
    category: 'Impersonation',
    description: 'Using my exact name and photos.',
    submitDate: '2026-10-05',
    status: 'Under Review',
    moderator: 'Admin Alex',
    resolutionNotes: null,
    evidenceContext: 'Two accounts found with identical photo hashes and names.'
  },
  {
    id: 'RPT-5566-2',
    reporterName: 'Tom B.',
    reporterId: '6677',
    reportedName: 'Chris P.',
    reportedId: '5566',
    category: 'Inappropriate behavior',
    description: 'Rude and abusive language during a video date.',
    submitDate: '2026-10-04',
    status: 'Resolved',
    moderator: 'Admin Jane',
    resolutionNotes: 'User warned for community guideline violation.',
    evidenceContext: 'User flagged during real-time video session by automated moderation for offensive speech.'
  }
];

export default function AdminReportsSafety() {
  const [reports, setReports] = useState(mockReports);
  const [activeTab, setActiveTab] = useState('Active'); 
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [isEvidenceUnlocked, setIsEvidenceUnlocked] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [actionType, setActionType] = useState(null); 
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredReports = useMemo(() => {
    let res = reports.filter(r => 
      activeTab === 'Active' 
        ? (r.status === 'Open' || r.status === 'Under Review')
        : (r.status === 'Resolved' || r.status === 'Dismissed')
    );
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(r => r.reportedName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') {
      res = res.filter(r => r.category === categoryFilter);
    }
    return res.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
  }, [reports, activeTab, search, categoryFilter]);

  const handleClaimReport = (e, reqId) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Under Review', moderator: 'You' } : r));
    showToast('Report claimed for review.');
  };

  const executeAction = () => {
    if (!actionReason) {
      alert("Please provide resolution notes for the audit log.");
      return;
    }
    
    let newStatus = actionType === 'dismiss' ? 'Dismissed' : 'Resolved';
    let msg = '';
    
    if (actionType === 'warn') msg = `Warning sent to ${selectedReport.reportedName}.`;
    if (actionType === 'suspend') msg = `Account ${selectedReport.reportedName} suspended.`;
    if (actionType === 'ban') msg = `Account ${selectedReport.reportedName} permanently banned.`;
    if (actionType === 'dismiss') msg = `Report dismissed.`;

    setReports(prev => prev.map(r => r.id === selectedReport.id ? { 
      ...r, 
      status: newStatus, 
      resolutionNotes: `[${actionType.toUpperCase()}] ${actionReason}`,
      moderator: r.moderator || 'You'
    } : r));
    
    showToast(msg);
    setSelectedReport(null);
    setActionType(null);
    setActionReason('');
    setIsEvidenceUnlocked(false);
  };

  const openReview = (req) => {
    setSelectedReport(req);
    setIsEvidenceUnlocked(false);
    setActionType(null);
    setActionReason('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Safety</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Investigate and resolve user safety reports.</p>
        </div>
      </div>

      <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-2xl sm:rounded-full w-full sm:w-max shadow-inner">
          {['Active', 'Closed'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-4 sm:px-8 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex flex-col items-center justify-center leading-tight sm:min-w-[140px] ${
                activeTab === tab 
                  ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-pink-600 border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <span>{tab === 'Active' ? 'Active' : 'Resolved /'}</span>
              <span>{tab === 'Active' ? 'Reports' : 'Dismissed'}</span>
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search reports by ID, User, or Category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Categories</option>
            <option value="Fake profile">Fake profile</option>
            <option value="Harassment">Harassment</option>
            <option value="Inappropriate behavior">Inappropriate behavior</option>
            <option value="Spam">Spam</option>
            <option value="Scams or fraud">Scams or fraud</option>
            <option value="Impersonation">Impersonation</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Report Info</th>
                <th className="p-4">Reported User</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-rose-600">{req.category}</span>
                      <span className="text-[10px] font-medium text-slate-500">{req.id} • {req.submitDate}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{req.reportedName}</span>
                      <span className="text-[10px] font-medium text-slate-500">ID: #{req.reportedId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                      req.status === 'Dismissed' ? 'bg-slate-100 text-slate-600' :
                      req.status === 'Under Review' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700">{req.moderator || '-'}</td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {req.status === 'Open' && (
                        <button onClick={(e) => handleClaimReport(e, req.id)} className="px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm transition-all border border-indigo-100 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px] font-bold">front_hand</span>
                          <span className="text-xs font-bold">Claim</span>
                        </button>
                      )}
                      <button onClick={() => openReview(req)} className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-all border border-slate-200 shadow-sm cursor-pointer">
                        Investigate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm font-bold text-slate-400">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
          {filteredReports.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              {/* Header: Category & Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wide">{req.category}</span>
                  <span className="text-[10px] font-medium text-slate-400">{req.id} • {req.submitDate}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                  req.status === 'Dismissed' ? 'bg-slate-100 text-slate-600' :
                  req.status === 'Under Review' ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Reported details */}
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-[11px]">Reported:</span>
                  <span className="font-bold text-slate-900 text-xs">{req.reportedName} (ID: #{req.reportedId})</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium text-[11px]">Reporter:</span>
                  <span className="font-semibold text-slate-700 text-xs">{req.reporterName}</span>
                </div>
                {req.moderator && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium text-[11px]">Assigned to:</span>
                    <span className="font-bold text-indigo-600 text-xs">{req.moderator}</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-600 mt-1 italic bg-white p-2 rounded-lg border border-slate-200/60">"{req.description}"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {req.status === 'Open' && (
                  <button 
                    onClick={(e) => handleClaimReport(e, req.id)}
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">front_hand</span>
                    Claim
                  </button>
                )}
                <button 
                  onClick={() => openReview(req)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">search_check</span>
                  Investigate
                </button>
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No reports found.</div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Safety Report: {selectedReport.id}</h3>
                <span className="text-xs font-bold text-slate-500 mt-1">
                  Reported against <span className="text-slate-800">{selectedReport.reportedName} (ID: {selectedReport.reportedId})</span> by <span className="text-slate-800">{selectedReport.reporterName} (ID: {selectedReport.reporterId})</span>
                </span>
              </div>
              <button onClick={() => setSelectedReport(null)} className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-lg font-bold">close</span>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
              
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto md:border-r border-b md:border-b-0 border-slate-100 bg-white">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Category</span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{selectedReport.category}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description provided by reporter</span>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">{selectedReport.description}</p>
                  </div>

                  <div className="mt-4 sm:mt-6 border-t border-slate-100 pt-4 sm:pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-amber-500">lock</span>
                      <h4 className="text-sm font-extrabold text-slate-900">Restricted Evidence Context</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-4">Access to private chat history and sensitive context is restricted. Unlock only if strictly necessary to resolve this case.</p>
                    
                    {!isEvidenceUnlocked ? (
                      <button onClick={() => setIsEvidenceUnlocked(true)} className="w-full py-6 sm:py-8 border-2 border-dashed border-rose-200 bg-rose-50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-rose-100 transition-colors group cursor-pointer">
                        <span className="material-symbols-outlined text-3xl text-rose-500 group-hover:scale-110 transition-transform">vpn_key</span>
                        <span className="text-sm font-bold text-rose-700">Authorize & View Evidence</span>
                      </button>
                    ) : (
                      <div className="bg-slate-900 rounded-xl p-4 animate-in fade-in">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">System Extracted Context</span>
                        <p className="text-xs sm:text-sm text-slate-200 font-mono break-words">{selectedReport.evidenceContext}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedReport.resolutionNotes && (
                    <div className="mt-4 sm:mt-6 border-t border-slate-100 pt-4 sm:pt-6">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Resolution Notes</span>
                      <p className="text-xs sm:text-sm font-medium text-slate-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 mt-1">{selectedReport.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-80 bg-slate-50 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
                {(selectedReport.status === 'Open' || selectedReport.status === 'Under Review') ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">Resolution Action</h4>
                      <p className="text-xs font-medium text-slate-500 mb-2">Select an enforcement action.</p>
                      
                      <button onClick={() => setActionType('warn')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'warn' ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-white border-slate-200 hover:border-amber-300'}`}>
                        <span className={`material-symbols-outlined text-lg ${actionType === 'warn' ? 'text-amber-600' : 'text-slate-400'}`}>warning</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Warn User</span>
                          <span className="text-[10px] text-slate-500">Send an official warning message.</span>
                        </div>
                      </button>

                      <button onClick={() => setActionType('suspend')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'suspend' ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-slate-200 hover:border-orange-300'}`}>
                        <span className={`material-symbols-outlined text-lg ${actionType === 'suspend' ? 'text-orange-600' : 'text-slate-400'}`}>block</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Suspend Account</span>
                          <span className="text-[10px] text-slate-500">Temporarily restrict access.</span>
                        </div>
                      </button>

                      <button onClick={() => setActionType('ban')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'ban' ? 'bg-rose-50 border-rose-500 shadow-sm' : 'bg-white border-slate-200 hover:border-rose-300'}`}>
                        <span className={`material-symbols-outlined text-lg ${actionType === 'ban' ? 'text-rose-600' : 'text-slate-400'}`}>gavel</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Ban Account</span>
                          <span className="text-[10px] text-slate-500">Permanent removal.</span>
                        </div>
                      </button>

                      <button onClick={() => setActionType('dismiss')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'dismiss' ? 'bg-slate-100 border-slate-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                        <span className={`material-symbols-outlined text-lg ${actionType === 'dismiss' ? 'text-slate-600' : 'text-slate-400'}`}>visibility_off</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Dismiss Report</span>
                          <span className="text-[10px] text-slate-500">No violation found.</span>
                        </div>
                      </button>
                    </div>

                    {actionType && (
                      <div className="flex flex-col gap-3 animate-in fade-in duration-200 mt-2">
                        <textarea 
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Enter decision details and reason for the audit log..."
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 h-24 resize-none"
                        />
                        <button onClick={executeAction} disabled={!isEvidenceUnlocked} className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md">
                          Confirm & Resolve
                        </button>
                        {!isEvidenceUnlocked && <p className="text-[10px] font-bold text-rose-500 text-center leading-tight mt-1">You must unlock evidence before applying enforcement actions.</p>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center text-slate-500 py-6 md:py-0">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">task_alt</span>
                    <h4 className="text-sm font-extrabold text-slate-900">Case Closed</h4>
                    <p className="text-xs">This report has been resolved and no further action can be taken.</p>
                  </div>
                )}
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
