import React from 'react';

export default function ProfileCard({ 
  profile, 
  onPass, 
  onLike, 
  onViewProfile,
  isLiked = false,
  isPassed = false
}) {
  if (isPassed) return null;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      <div className="relative w-full h-80 overflow-hidden bg-slate-100">
        <img 
          alt={`${profile.name}, ${profile.age}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={profile.photo}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${profile.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{profile.activeTime || (profile.isActive ? 'Active Now' : 'Offline')}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-xs font-extrabold shadow-md shadow-pink-500/20">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span>{profile.compatibility}% Spark</span>
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex flex-col text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold drop-shadow-sm text-white">
              {profile.name}, {profile.age}
            </h3>
            {profile.isVerified && (
              <span className="material-symbols-outlined text-cyan-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-200 opacity-90 drop-shadow-sm font-medium">
            {profile.profession} • {profile.location}
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 justify-between bg-white">
        <div className="flex flex-col gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200/70 text-xs font-bold">
              <span className="material-symbols-outlined text-xs">
                {profile.intentCategory === 'talk' ? 'forum' : profile.intentCategory === 'friends' ? 'auto_awesome' : profile.intentCategory === 'long-term' ? 'all_inclusive' : 'auto_stories'}
              </span>
              <span>{profile.intentLabel}</span>
            </span>

            {profile.secondaryTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/70 text-xs font-semibold">
                <span>{profile.secondaryTag}</span>
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-pink-600 font-bold text-[11px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              <span>Zuno AI Resonance Insight</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-2">
              “{profile.aiInsight}”
            </p>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">
              Common Interests
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
          
          <button
            onClick={() => onPass(profile)}
            className="w-11 h-11 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Pass today"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <button
            onClick={() => onViewProfile(profile)}
            className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all cursor-pointer"
          >
            View Profile
          </button>

          <button
            onClick={() => onLike(profile)}
            disabled={isLiked}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isLiked
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-95 text-white shadow-pink-500/25 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isLiked ? 'check_circle' : 'favorite'}
            </span>
            <span>{isLiked ? 'Connected!' : 'Connect'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
