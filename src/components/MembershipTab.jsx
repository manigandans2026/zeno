import React from 'react';
import VelvetMembershipSection from './VelvetMembershipSection';

export default function MembershipTab({ onOpenWaitlist }) {
  const comparison = [
    { feature: 'Daily Neural Matches', free: '3 - 5 Intros', velvet: 'Unlimited Priority' },
    { feature: 'Voice Note Playback', free: 'Full Preview', velvet: 'Full + Replay Analytics' },
    { feature: 'Liveness Verification Badge', free: 'Included', velvet: 'VIP Ring Included' },
    { feature: 'AI Icebreaker Assistant', free: 'Standard', velvet: 'Personalized Concierge' },
    { feature: 'Incognito Stealth Roaming', free: '—', velvet: 'Unlimited Stealth' },
    { feature: 'Offline Concierge Dates', free: '—', velvet: 'Curated Itineraries' }
  ];

  return (
    <div className="pt-space-lg pb-space-xl max-w-7xl mx-auto px-4 sm:px-8 flex flex-col">
      
      <div className="text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 font-semibold text-xs mb-2">
          <span className="material-symbols-outlined text-[16px] text-pink-500">verified</span>
          <span>Zuno Velvet Membership</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Elevate Your Connection
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Everything included in Zuno, plus sovereign privacy and unlimited depth.
        </p>
      </div>

      <VelvetMembershipSection onOpenWaitlist={onOpenWaitlist} />

      <div className="mt-space-xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-left">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-4">
          Plan Comparison Matrix
        </h3>

        <div className="flex flex-col divide-y divide-slate-100">
          <div className="py-3 grid grid-cols-3 text-xs sm:text-sm font-bold text-slate-500 uppercase">
            <span>Feature</span>
            <span className="text-center">Free Tier</span>
            <span className="text-right text-pink-600">Velvet VIP</span>
          </div>

          {comparison.map((row, i) => (
            <div key={i} className="py-3.5 grid grid-cols-3 text-xs sm:text-sm items-center">
              <span className="font-medium text-slate-800">{row.feature}</span>
              <span className="text-center text-slate-500">{row.free}</span>
              <span className="text-right font-semibold text-pink-600">{row.velvet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
