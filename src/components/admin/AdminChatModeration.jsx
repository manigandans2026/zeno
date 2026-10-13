import React, { useState, useMemo } from 'react';

const mockChatReports = [
  {
    id: 'CHAT-8492-1',
    reporterName: 'Isabella C.',
    reportedName: 'John Doe',
    category: 'Harassment',
    date: '2026-10-09',
    status: 'Open',
    privateLog: [
      { sender: 'John Doe', text: 'Why are you ignoring me???', time: '10:05 PM' },
      { sender: 'John Doe', text: 'Answer me [profanity].', time: '10:12 PM' },
      { sender: 'Isabella C.', text: 'Please stop messaging me.', time: '10:15 PM' },
      { sender: 'John Doe', text: 'Or what?', time: '10:16 PM' },
    ],
    resolutionNotes: null,
  },
  {
    id: 'CHAT-3321-2',
    reporterName: 'James W.',
    reportedName: 'Sarah Smith',
    category: 'Spam/Bots',
    date: '2026-10-08',
    status: 'Resolved',
    privateLog: [
      { sender: 'Sarah Smith', text: 'Check out my premium link! www.example.com/scam', time: '09:00 AM' },
      { sender: 'Sarah Smith', text: 'Check out my premium link! www.example.com/scam', time: '09:05 AM' },
    ],
    resolutionNotes: 'Banned for spam.',
  },
];

export default function AdminChatModeration() {
  const [reports, setReports] = useState(mockChatReports);
  const [search, setSearch] = useState('');
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLogUnlocked, setIsLogUnlocked] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [actionType, setActionType] = useState(null);
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredReports = useMemo(() => {
    let res = reports;
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(r => r.reportedName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    return res;
  }, [reports, search]);

  const executeAction = () => {
    if (!actionReason) {
      alert("Resolution notes are required.");
      return;
    }
    
    setReports(prev => prev.map(r => r.id === selectedChat.id ? { 
      ...r, 
      status: 'Resolved', 
      resolutionNotes: `[${actionType.toUpperCase()}] ${actionReason}`
    } : r));
    
    showToast(`Chat report resolved.`);
    setSelectedChat(null);
    setActionType(null);
    setActionReason('');
    setIsLogUnlocked(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Chat Moderation</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Review flagged conversations. Strict privacy rules apply.</p>
        </div>
      </div>

      <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Enter user name or report keywords to search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Report ID</th>
                <th className="p-4">Reported User</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 text-sm font-bold text-slate-900">{req.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{req.reportedName}</td>
                  <td className="p-4 text-sm font-bold text-rose-600">{req.category}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={() => { setSelectedChat(req); setIsLogUnlocked(false); setActionType(null); setActionReason(''); }} className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-full transition-all shadow-sm cursor-pointer">
                      Review Context
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
          {filteredReports.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{req.id}</span>
                  <span className="text-[11px] font-bold text-rose-600 mt-0.5">{req.category}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[11px]">Reported User:</span>
                <span className="font-bold text-slate-800 text-xs">{req.reportedName} • {req.date}</span>
              </div>

              <button 
                onClick={() => { setSelectedChat(req); setIsLogUnlocked(false); setActionType(null); setActionReason(''); }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                Review Private Chat Context
              </button>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-sm font-bold text-slate-400">No chat reports found.</div>
          )}
        </div>
      </div>

      {selectedChat && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Chat Log Review: {selectedChat.id}</h3>
                <span className="text-xs font-bold text-slate-500">Only review messages relevant to the reported incident.</span>
              </div>
              <button onClick={() => setSelectedChat(null)} className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-lg font-bold">close</span>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto md:border-r border-b md:border-b-0 border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-rose-500">security</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Privacy Restricted Context</h4>
                </div>
                
                {!isLogUnlocked ? (
                  <button onClick={() => setIsLogUnlocked(true)} className="w-full py-8 sm:py-12 border-2 border-dashed border-rose-200 bg-rose-50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-rose-100 transition-colors group">
                    <span className="material-symbols-outlined text-3xl text-rose-500 group-hover:scale-110 transition-transform">lock_open_right</span>
                    <span className="text-sm font-bold text-rose-700">Authorize Private Log Access</span>
                    <span className="text-[10px] text-rose-500 font-medium">This action is logged for audit purposes.</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 animate-in fade-in bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    {selectedChat.privateLog.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === selectedChat.reportedName ? 'items-start' : 'items-end'}`}>
                        <span className="text-[10px] font-bold text-slate-400 mb-1">{msg.sender} • {msg.time}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                          msg.sender === selectedChat.reportedName ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-pink-600 text-white rounded-tr-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full md:w-80 bg-white p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
                {selectedChat.status === 'Open' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">Moderation Action</h4>
                      
                      <button onClick={() => setActionType('warn')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'warn' ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-200 hover:border-amber-300'}`}>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Warn User</span>
                        </div>
                      </button>
                      <button onClick={() => setActionType('ban')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'ban' ? 'bg-rose-50 border-rose-500' : 'bg-white border-slate-200 hover:border-rose-300'}`}>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Ban Account</span>
                        </div>
                      </button>
                      <button onClick={() => setActionType('dismiss')} className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${actionType === 'dismiss' ? 'bg-slate-100 border-slate-400' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Dismiss</span>
                        </div>
                      </button>
                    </div>

                    {actionType && (
                      <div className="flex flex-col gap-3 mt-2">
                        <textarea 
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Enter resolution notes and reason for action..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm h-24 resize-none focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                        <button onClick={executeAction} disabled={!isLogUnlocked} className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md">
                          Confirm Resolution
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center text-slate-500 py-6 md:py-0">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">task_alt</span>
                    <h4 className="text-sm font-extrabold text-slate-900">Case Resolved</h4>
                    <p className="text-xs">Notes: {selectedChat.resolutionNotes}</p>
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
