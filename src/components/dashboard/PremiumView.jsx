import React, { useState } from 'react';

export default function PremiumView() {
  const [billingCycle, setBillingCycle] = useState('monthly'); 
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const benefits = [
    { title: 'See who is interested in you', icon: 'visibility', desc: 'Reveal who resonated with your prompt before swiping' },
    { title: 'More daily matches', icon: 'auto_awesome', desc: 'Receive up to 15 curated high-affinity resonances daily' },
    { title: 'Profile visibility boost', icon: 'bolt', desc: '3x higher deck priority in your primary location' },
    { title: 'Advanced filters', icon: 'tune', desc: 'Filter by exact conversation tempo, lifestyle & values' },
    { title: 'Unlimited connections', icon: 'all_inclusive', desc: 'Send unlimited spark notes and voice intros' },
    { title: 'Private rooms / curated groups', icon: 'groups', desc: 'Access exclusive Zuno listening lounge events & group salons' }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-4 text-slate-800 relative">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-pink-950 text-white shadow-2xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-2 relative z-10 max-w-xl">
          <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-max shadow-sm">
            Zuno Velvet Tier
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Unlock More Meaningful Connections.
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-medium pt-1">
            Say goodbye to endless swipe fatigue. Upgrade to Zuno Velvet for deeper AI insights, unlimited voice intros, and priority match curation.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0 relative z-10">
          <span className="text-xs text-purple-200 font-bold mb-2">Billing Cycle</span>
          <div className="flex bg-slate-900/80 p-1 rounded-full border border-purple-400/30">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'yearly' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold">SAVE 35%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col justify-between gap-6 relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Zuno Velvet Pass</h3>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                Most Popular
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">
                {billingCycle === 'monthly' ? '$14.99' : '$9.69'}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ month</span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Essential upgrade for intentional connectors seeking higher quality daily resonances.
            </p>
          </div>

          <button
            onClick={() => triggerToast("Subscribed to Zuno Velvet Pass!")}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 cursor-pointer text-center"
          >
            Upgrade to Premium
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-slate-950 text-white shadow-xl flex flex-col justify-between gap-6 border border-purple-500/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Zuno VIP Unlimited</h3>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                VIP Tier
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$24.99' : '$16.25'}
              </span>
              <span className="text-xs font-semibold text-purple-300">/ month</span>
            </div>

            <p className="text-xs text-purple-200 font-medium">
              Full unlimited access including priority AI concierge, private lounges &amp; stealth mode.
            </p>
          </div>

          <button
            onClick={() => triggerToast("Subscribed to Zuno VIP Unlimited!")}
            className="w-full py-3 rounded-full bg-white hover:bg-slate-100 text-purple-900 font-extrabold text-xs shadow-lg cursor-pointer text-center relative z-10"
          >
            Upgrade to Premium
          </button>
        </div>

      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-extrabold text-slate-900">
          All Premium Velvet Privileges Included
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-2 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {b.icon}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{b.title}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
