import React, { useState, useMemo } from 'react';

const mockSubscribers = [
  { id: 'SUB-991', userId: '8492', name: 'John Doe', plan: 'Zuno Gold', status: 'Active', nextBilling: '2026-11-09', paymentStatus: 'Paid', amount: '₹1,499' },
  { id: 'SUB-992', userId: '5542', name: 'Emily R.', plan: 'Zuno Plus', status: 'Expired', nextBilling: '-', paymentStatus: 'Failed', amount: '₹899' },
  { id: 'SUB-993', userId: '9921', name: 'Isabella C.', plan: 'Zuno Gold', status: 'Active', nextBilling: '2026-10-15', paymentStatus: 'Paid', amount: '₹1,499' },
  { id: 'SUB-994', userId: '2211', name: 'Lisa M.', plan: 'Zuno Plus', status: 'Active', nextBilling: '2026-11-01', paymentStatus: 'Paid', amount: '₹899' },
];

const mockRefunds = [
  { id: 'REF-112', subId: 'SUB-881', userId: '4432', name: 'David K.', amount: '₹1,499', reason: 'Accidental renewal, forgot to cancel.', date: '2026-10-08', status: 'Pending' },
  { id: 'REF-113', subId: 'SUB-772', userId: '1123', name: 'Mike T.', amount: '₹899', reason: 'App crashes frequently.', date: '2026-10-05', status: 'Approved' },
];

const plans = [
  { name: 'Zuno Plus', price: '₹899/mo', activeUsers: 842, features: ['Unlimited Swipes', '5 Super Likes/week', 'Rewind'] },
  { name: 'Zuno Gold', price: '₹1,499/mo', activeUsers: 415, features: ['See Who Likes You', 'Priority Profile', 'All Plus Features'] },
];

export default function AdminSubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('Subscribers'); 
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [refunds, setRefunds] = useState(mockRefunds);
  const [search, setSearch] = useState('');
  
  const [subStatusFilter, setSubStatusFilter] = useState('All');
  const [refundStatusFilter, setRefundStatusFilter] = useState('All');
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSubscribers = useMemo(() => {
    let res = subscribers;
    if (subStatusFilter !== 'All') {
      res = res.filter(s => s.status === subStatusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.userId.includes(q));
    }
    return res;
  }, [subscribers, search, subStatusFilter]);

  const filteredRefunds = useMemo(() => {
    let res = refunds;
    if (refundStatusFilter !== 'All') {
      res = res.filter(r => r.status === refundStatusFilter);
    }
    return res;
  }, [refunds, refundStatusFilter]);

  const handleRefundAction = (refId, action) => {
    setRefunds(prev => prev.map(r => r.id === refId ? { ...r, status: action } : r));
    showToast(`Refund ${action.toLowerCase()} successfully.`);
  };

  const handleToggleSubscriberStatus = (subId) => {
    setSubscribers(prev => prev.map(s => s.id === subId ? {
      ...s,
      status: s.status === 'Active' ? 'Cancelled' : 'Active'
    } : s));
    showToast('Subscription status updated.');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Subscription Management</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Manage premium plans, active subscriptions, and refunds securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-md flex flex-col text-white">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Monthly Revenue</span>
          <span className="text-xl sm:text-3xl font-extrabold mt-1 truncate">₹4.25 Cr</span>
          <span className="text-[10px] font-medium text-emerald-400 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">trending_up</span> +12.4%
          </span>
        </div>
        <button 
          onClick={() => { setActiveTab('Subscribers'); setSubStatusFilter('Active'); }}
          className={`p-3.5 sm:p-5 rounded-2xl border flex flex-col justify-between text-left transition-all cursor-pointer ${activeTab === 'Subscribers' && subStatusFilter === 'Active' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase truncate">Active VIPs</span>
          <span className="text-xl sm:text-3xl font-extrabold text-emerald-700 mt-1">1,257</span>
        </button>
        <button 
          onClick={() => { setActiveTab('Refunds'); setRefundStatusFilter('Pending'); }}
          className={`p-3.5 sm:p-5 rounded-2xl border flex flex-col justify-between text-left transition-all cursor-pointer ${activeTab === 'Refunds' && refundStatusFilter === 'Pending' ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'}`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase truncate">Refunds</span>
          <span className="text-xl sm:text-3xl font-extrabold text-amber-700 mt-1">{refunds.filter(r => r.status === 'Pending').length}</span>
        </button>
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase truncate">Churn Rate</span>
          <span className="text-xl sm:text-3xl font-extrabold text-slate-700 mt-1">4.2%</span>
        </div>
      </div>

      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-2xl sm:rounded-full w-full md:w-max shadow-inner overflow-x-auto no-scrollbar">
          {['Subscribers', 'Refunds', 'Plans'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 sm:min-w-[120px] whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-pink-600 border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {activeTab === 'Subscribers' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search subscribers..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
            <select value={subStatusFilter} onChange={e => setSubStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-pink-500">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        )}
        {activeTab === 'Refunds' && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select value={refundStatusFilter} onChange={e => setRefundStatusFilter(e.target.value)} className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-pink-500">
              <option value="All">All Refunds</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'Subscribers' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full animate-in fade-in">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Subscription ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Next Billing</th>
                  <th className="p-4 pr-6">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-bold text-slate-900">{s.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{s.name} <span className="text-[10px] text-slate-400">({s.userId})</span></td>
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        s.plan === 'Zuno Gold' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                      }`}>
                        {s.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-500">{s.nextBilling}</td>
                    <td className="p-4 pr-6 flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold flex items-center gap-1 ${s.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {s.paymentStatus === 'Paid' ? 'check_circle' : 'error'}
                        </span>
                        {s.paymentStatus}
                      </span>
                      <button
                        onClick={() => handleToggleSubscriberStatus(s.id)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        {s.status === 'Active' ? 'Cancel' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
            {filteredSubscribers.map(s => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.id} • User #{s.userId}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border shrink-0 ${
                    s.plan === 'Zuno Gold' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  }`}>
                    {s.plan}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <span className={`text-[11px] font-bold mt-0.5 ${s.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.status}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Payment ({s.amount})</span>
                    <span className={`text-[11px] font-bold mt-0.5 flex items-center justify-end gap-1 ${s.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      <span className="material-symbols-outlined text-[13px]">{s.paymentStatus === 'Paid' ? 'check_circle' : 'error'}</span>
                      {s.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between px-1">
                  <span>Next billing date:</span>
                  <span className="text-slate-800 font-bold">{s.nextBilling}</span>
                </div>
              </div>
            ))}
            {filteredSubscribers.length === 0 && (
              <div className="p-8 text-center text-sm font-bold text-slate-400">No subscribers found.</div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs font-bold text-slate-400 flex items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-sm flex-shrink-0">lock</span>
            <span>Raw card details and payment processing are handled entirely by Stripe. Zuno Admin only views metadata.</span>
          </div>
        </div>
      )}

      {activeTab === 'Refunds' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col w-full animate-in fade-in">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Refund ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRefunds.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-bold text-slate-900">{r.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{r.name}</td>
                    <td className="p-4 text-sm font-extrabold text-slate-900">{r.amount}</td>
                    <td className="p-4 text-xs font-medium text-slate-600 max-w-xs truncate">{r.reason}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleRefundAction(r.id, 'Approved')} className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer">
                            Approve
                          </button>
                          <button onClick={() => handleRefundAction(r.id, 'Rejected')} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 flex flex-col p-3 gap-3">
            {filteredRefunds.map(r => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{r.name}</span>
                    <span className="text-[10px] text-slate-400">{r.id} • {r.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">{r.amount}</span>
                    <span className={`block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      r.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">"{r.reason}"</p>

                {r.status === 'Pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => handleRefundAction(r.id, 'Approved')} 
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all"
                    >
                      Approve Refund
                    </button>
                    <button 
                      onClick={() => handleRefundAction(r.id, 'Rejected')} 
                      className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredRefunds.length === 0 && (
              <div className="p-8 text-center text-sm font-bold text-slate-400">No refunds found.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in">
          {plans.map((plan, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex flex-col">
                  <h3 className={`text-xl sm:text-2xl font-extrabold ${plan.name.includes('Gold') ? 'text-amber-500' : 'text-indigo-500'}`}>{plan.name}</h3>
                  <span className="text-sm font-bold text-slate-900">{plan.price}</span>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Users</span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">{plan.activeUsers}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-6 flex-grow">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] flex-shrink-0">check_circle</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-all border border-slate-200">
                Edit Plan Details
              </button>
            </div>
          ))}
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
