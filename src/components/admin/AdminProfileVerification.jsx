import React, { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockUsers';

const BASE_TIMESTAMP = 1760000000000;

const initialRequests = mockUsers.slice(0, 30).map((u, i) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  status: u.verified ? 'Approved' : (i % 2 === 0) ? 'Pending' : 'Rejected',
  submitDate: new Date(BASE_TIMESTAMP - i * 86400000).toISOString().split('T')[0],
  reviewDate: u.verified ? new Date(BASE_TIMESTAMP - i * 43200000).toISOString().split('T')[0] : null,
  rejectionReason: null,
  idDocument: `https://picsum.photos/seed/${u.id}doc/400/250`,
  selfieImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff&size=256`
}));

export default function AdminProfileVerification() {
  const [requests, setRequests] = useState(initialRequests);

  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEvidenceUnlocked, setIsEvidenceUnlocked] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRequests = useMemo(() => {
    let res = requests.filter(r => r.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(r => r.name.toLowerCase().includes(q) || r.id.includes(q) || r.email.toLowerCase().includes(q));
    }
    if (dateFilter !== 'All') {
      res = res.filter(r => {
        const d = Date.parse(r.submitDate);
        const diffDays = Math.ceil(Math.abs(BASE_TIMESTAMP - d) / (1000 * 60 * 60 * 24));
        if (dateFilter === 'Last 7 Days') return diffDays <= 7;
        if (dateFilter === 'Last 30 Days') return diffDays <= 30;
        return true;
      });
    }
    return res.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
  }, [requests, activeTab, search, dateFilter]);

  const handleApprove = () => {
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Approved', reviewDate: new Date().toISOString().split('T')[0] } : r));
    showToast(`Verification approved for ${selectedRequest.name}`);
    setSelectedRequest(null);
    setIsEvidenceUnlocked(false);
  };

  const handleReject = () => {
    if (!actionReason) {
      alert("A rejection reason is required.");
      return;
    }
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected', reviewDate: new Date().toISOString().split('T')[0], rejectionReason: actionReason } : r));
    showToast(`Verification rejected for ${selectedRequest.name}`);
    setSelectedRequest(null);
    setIsRejecting(false);
    setActionReason('');
    setIsEvidenceUnlocked(false);
  };

  const openReview = (req) => {
    setSelectedRequest(req);
    setIsEvidenceUnlocked(false);
    setIsRejecting(false);
    setActionReason('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Profile Verification</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Review identity documents and selfies.</p>
        </div>
      </div>

      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/80 rounded-xl w-full sm:flex sm:w-auto">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-center whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white shadow-sm text-pink-600 border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search verification requests by user or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-pink-500">
            <option value="All">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submit Date</th>
                <th className="p-4">Review Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{req.name}</span>
                      <span className="text-[10px] font-medium text-slate-500">ID: #{req.id} • {req.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700">{req.submitDate}</td>
                  <td className="p-4 text-sm font-bold text-slate-700">{req.reviewDate || '-'}</td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => {
                            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved', reviewDate: new Date().toISOString().split('T')[0] } : r));
                            showToast(`Verification approved for ${req.name}`);
                          }} className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold group shadow-sm cursor-pointer">
                            <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">check_circle</span>
                            <span className="text-xs">Approve</span>
                          </button>
                          <button onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) {
                              setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected', reviewDate: new Date().toISOString().split('T')[0], rejectionReason: reason } : r));
                              showToast(`Verification rejected for ${req.name}`);
                            }
                          }} className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold group shadow-sm cursor-pointer">
                            <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">cancel</span>
                            <span className="text-xs">Reject</span>
                          </button>
                        </>
                      )}
                      <button onClick={() => openReview(req)} className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-lg transition-all border border-transparent hover:shadow-sm cursor-pointer">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm font-bold text-slate-400">No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
          {filteredRequests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              {/* Header: User name, ID, status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img src={req.selfieImage} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{req.name}</span>
                    <span className="text-[11px] font-medium text-slate-500">ID: #{req.id}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                  req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Email & Date metadata */}
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex flex-col gap-1">
                <div className="text-slate-600 truncate font-medium">{req.email}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-semibold">
                  <span>Submitted: <strong className="text-slate-800">{req.submitDate}</strong></span>
                  {req.reviewDate && <span>Reviewed: <strong className="text-slate-800">{req.reviewDate}</strong></span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {req.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => {
                        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved', reviewDate: new Date().toISOString().split('T')[0] } : r));
                        showToast(`Verification approved for ${req.name}`);
                      }}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected', reviewDate: new Date().toISOString().split('T')[0], rejectionReason: reason } : r));
                          showToast(`Verification rejected for ${req.name}`);
                        }
                      }}
                      className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">cancel</span>
                      Reject
                    </button>
                    <button 
                      onClick={() => openReview(req)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                      title="View Evidence"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => openReview(req)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View Evidence Vault
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No requests found.</div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Verification Review: {selectedRequest.name}</h3>
                <span className="text-xs font-bold text-slate-500">Submitted {selectedRequest.submitDate}</span>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-lg font-bold">close</span>
              </button>
            </div>
            
            <div className="flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 flex-1">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">lock</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Secure Evidence Vault</h4>
                </div>
                <p className="text-xs text-slate-500 font-medium">Access to identity documents is strictly monitored. Do not screenshot or download this information.</p>
                
                {!isEvidenceUnlocked ? (
                  <button onClick={() => setIsEvidenceUnlocked(true)} className="mt-2 w-full py-6 border-2 border-dashed border-pink-200 bg-pink-50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-pink-100 transition-colors group cursor-pointer">
                    <span className="material-symbols-outlined text-3xl text-pink-500 group-hover:scale-110 transition-transform">visibility</span>
                    <span className="text-sm font-bold text-pink-700">Click to Unlock Evidence</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 animate-in fade-in duration-500">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Government ID</span>
                      <img src={selectedRequest.idDocument} alt="ID Document" className="w-full h-44 sm:h-48 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Selfie</span>
                      <img src={selectedRequest.selfieImage} alt="Selfie" className="w-full h-44 sm:h-48 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    </div>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'Rejected' && selectedRequest.rejectionReason && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Rejection Reason</span>
                  <p className="text-sm font-medium text-rose-900 mt-1">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.status === 'Pending' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
                  <h4 className="text-sm font-extrabold text-slate-900">Decision</h4>
                  {isRejecting ? (
                    <div className="flex flex-col gap-3 animate-in fade-in">
                      <textarea 
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        placeholder="Enter the reason for rejection (e.g. blurry ID photo)..."
                        className="w-full bg-slate-50 border border-rose-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 h-24 resize-none"
                      />
                      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                        <button onClick={() => {setIsRejecting(false); setActionReason('');}} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={handleReject} className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-500/20">Confirm Rejection</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button onClick={handleApprove} disabled={!isEvidenceUnlocked} className="w-full sm:flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span> Approve Profile
                      </button>
                      <button onClick={() => setIsRejecting(true)} disabled={!isEvidenceUnlocked} className="w-full sm:flex-1 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:border-slate-200 disabled:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">cancel</span> Reject
                      </button>
                    </div>
                  )}
                  {!isEvidenceUnlocked && (
                    <p className="text-xs text-center font-bold text-slate-400 mt-2">You must unlock and review evidence before making a decision.</p>
                  )}
                </div>
              )}
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
