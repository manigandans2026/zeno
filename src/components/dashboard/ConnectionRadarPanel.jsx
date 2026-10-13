import React, { useState } from 'react';

export default function ConnectionRadarPanel({ 
  topProfileName = "Julian",
  userMood = "Introspective & Open",
  onOpenMoodModal,
  onCopyIcebreaker
}) {
  const [copied, setCopied] = useState(false);

  const icebreakerText = `Elena, ask ${topProfileName} about his Red Hook spatial sound exhibition. You both appreciate sound art and it guarantees a 3.4x higher response rate.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(icebreakerText);
    setCopied(true);
    if (onCopyIcebreaker) onCopyIcebreaker();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <aside className="flex flex-col gap-5">
      
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-pink-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            radar
          </span>
          <h2 className="text-base font-extrabold text-slate-900">
            Connection Radar
          </h2>
        </div>
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          Live Analysis
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-cyan-500/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900">AI Spark Concierge</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
            High Affinity
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          “Elena, ask <span className="font-bold text-pink-600">{topProfileName}</span> about his Red Hook spatial sound exhibition. You both appreciate sound art and it guarantees a 3.4x higher response rate.”
        </p>

        <button 
          onClick={handleCopy}
          className="w-full py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-pink-200/60"
        >
          <span className="material-symbols-outlined text-sm">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Suggested Icebreaker'}</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Today's Mood Frequency</span>
          <button 
            onClick={onOpenMoodModal}
            className="text-pink-600 hover:text-pink-700 font-bold text-xs flex items-center gap-0.5 cursor-pointer"
          >
            <span>Change</span>
            <span className="material-symbols-outlined text-xs">edit</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-xl">self_improvement</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-extrabold text-slate-900">{userMood}</span>
            <span className="text-[11px] text-slate-500 truncate">Prefers thoughtful messages over quick small talk</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Rhythm Tempo</span>
            <span className="font-bold text-pink-600">Slow &amp; Deep</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 w-3/4"></div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900">Profile Resonance Pulse</span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +18% this week
          </span>
        </div>

        <div className="w-full h-16 flex items-end">
          <svg className="w-full h-full text-pink-500" fill="none" viewBox="0 0 200 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,45 Q25,50 50,30 T100,25 T150,15 T200,8 L200,60 L0,60 Z" fill="url(#pulseGrad)"></path>
            <path d="M0,45 Q25,50 50,30 T100,25 T150,15 T200,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
            <circle cx="200" cy="8" r="4" className="fill-pink-500 animate-ping"></circle>
            <circle cx="200" cy="8" r="3" className="fill-pink-500"></circle>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-lg font-extrabold text-slate-900">34</span>
            <span className="text-[11px] text-slate-500 font-medium">Profile Views</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-lg font-extrabold text-pink-600">12</span>
            <span className="text-[11px] text-slate-500 font-medium">Prompt Sparks</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900">Recent Resonances</span>
          <span className="text-[10px] font-extrabold bg-pink-500 text-white px-2 py-0.5 rounded-full">
            4 new
          </span>
        </div>
        <p className="text-xs text-slate-500">These people resonated with your prompt “The song that stops my day”:</p>
        
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <img 
                alt="Theo" 
                className="w-9 h-9 rounded-full object-cover border border-pink-300"
                src="/avatars/kai.png"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Theo • 30</span>
                <span className="text-[10px] text-slate-500">Liked your vinyl prompt</span>
              </div>
            </div>
            <button 
              onClick={() => alert("Connected with Theo!")}
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">favorite</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <img 
                alt="Kael" 
                className="w-9 h-9 rounded-full object-cover border border-cyan-300"
                src="/avatars/ananya.png"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Kael • 28</span>
                <span className="text-[10px] text-slate-500">Listened to your voice intro</span>
              </div>
            </div>
            <button 
              onClick={() => alert("Playing Kael's voice note sample...")}
              className="w-8 h-8 rounded-full bg-cyan-50 hover:bg-cyan-500 hover:text-white text-cyan-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">graphic_eq</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-cyan-700 text-white shadow-lg shadow-pink-500/15 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
            Zuno Velvet Tier
          </span>
          <span className="material-symbols-outlined text-xl">star</span>
        </div>

        <div className="flex flex-col">
          <h4 className="text-base font-extrabold">Elevate Your Connection Rhythm</h4>
          <p className="text-xs opacity-90 pt-1 leading-relaxed">
            Unlock unlimited voice intro replays, see who resonated with your aura, and browse in stealth mode.
          </p>
        </div>

        <button 
          onClick={() => alert("Velvet Access: Upgrade for $14.99/mo to unlock full connection perks!")}
          className="mt-1 py-2.5 px-4 rounded-full bg-white text-pink-600 text-xs font-extrabold hover:bg-slate-50 active:scale-95 transition-all text-center cursor-pointer shadow-md"
        >
          Explore Velvet Privileges
        </button>
      </div>
    </aside>
  );
}
