import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function MatchSuccessModal({ profile, onClose, onStartChat }) {
  useEffect(() => {
    if (profile) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5 border border-slate-200 animate-scaleUp relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-pink-500/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 font-extrabold text-xs shadow-sm">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span>MUTUAL RESONANCE SPARK!</span>
        </div>

        <div className="flex items-center justify-center -space-x-4 my-2">
          <div className="relative">
            <img 
              alt="Elena"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-pink-500"
              src="/avatars/elena.png"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center text-white z-10 shadow-lg font-bold text-sm">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <div className="relative">
            <img 
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-cyan-500"
              src={profile.photo}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            You &amp; {profile.name} Resonated!
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-xs leading-relaxed">
            You both share an intentional intent for <span className="font-bold text-pink-600">{profile.intentLabel}</span> and high vinyl &amp; cinema affinity.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 w-full text-left flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-500">AI Suggested First Message:</span>
          <p className="text-xs text-slate-800 font-semibold italic">
            “Hey {profile.name}! Saw your note on sound design &amp; vinyl bars—what’s your top Sunday listening spot?”
          </p>
        </div>

        <div className="flex flex-col w-full gap-2.5 pt-1">
          <button
            onClick={() => {
              onStartChat(profile);
              onClose();
            }}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">forum</span>
            <span>Send First Message</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Keep Exploring Deck
          </button>
        </div>
      </div>
    </div>
  );
}
