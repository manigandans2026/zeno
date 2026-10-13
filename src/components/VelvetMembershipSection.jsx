import React from 'react';

export default function VelvetMembershipSection({ onOpenWaitlist }) {

  return (
    <div className="mt-space-xl pt-12 max-w-7xl mx-auto px-4 sm:px-8 text-left">
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-pink-200 shadow-[0_12px_36px_rgba(236,72,153,0.1)] relative overflow-hidden flex flex-col">
        
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-100/60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-100/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center relative z-10">
          
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                <span className="material-symbols-outlined text-[14px] text-pink-500">stars</span>
                <span className="font-label-sm text-label-sm text-pink-700 uppercase tracking-widest font-bold">
                  Zuno Velvet
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-cyan-700 font-semibold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
                VIP Tier
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-extrabold tracking-tight">
              Uncompromising Chemistry
            </h3>
            <p className="text-slate-600 mt-1 text-sm sm:text-base max-w-xl">
              Unlock the full breadth of AI compatibility insight and sovereign controls.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-pink-500">check_circle</span>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">See who replayed your voice intro</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-pink-500">check_circle</span>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">Unlimited daily intent & mood recalibrations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-pink-500">check_circle</span>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">Priority neural intros & concierge dates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-pink-500">check_circle</span>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">Stealth travel roaming & read receipts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 mt-8 lg:mt-0 bg-slate-50/90 border border-pink-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="material-symbols-outlined text-pink-500 text-[24px]">verified</span>
                <span>VIP Membership</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold">
                Priority Access
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Get instant lifetime priority matching, voice replay insights, and sovereign stealth privacy.
            </p>

            <button
              onClick={onOpenWaitlist}
              className="w-full h-12 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_6px_22px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.45)] active:scale-[0.99] transition-all cursor-pointer"
            >
              Claim Velvet Access
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
