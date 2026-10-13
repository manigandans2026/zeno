import React, { useState } from 'react';

export default function ProfileDetailModal({ profile, onClose, onLike, onPass, isLiked }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!profile) return null;

  const galleryPhotos = profile.gallery || [
    profile.photo,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDf-XNphcEY4_nkQs0mwkhAfAinSgL8m7R_2ZPI5LNh1oieOIOqBhenPr1tbi7AJAaj-yKb3mrMFLqlM09JI8_dSC9dx_vraNzyuuzhujXn2Asst8zsyPSVOIEAaM5k0ymd0tzioebQZM4Bwm49Sv_vt8B_MWtd1EtFt0PI9ynnIn0frymccl_4Ux2I5eSTZa5PH_XSJfZxJtfKMvFRd65vFVL0rgzAF4wEi-Cg1CmD',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCP2_MAAePkyl409g7ba6OCXxkaEKFM2YYkbWTppmEJHDfQKfm4aX3IbIUS0VxhaQMFNscTAq1_YePRHHaujXLD834RhbUGHFlRqTQgnOZMvFDHatiFtWvnuuENTcXjnAdFkw7tasuD7a4s1P-yfl34dbaMieiNQgD95aXgzqNI4b0BRJtcxzm_XfLVxSN8Rp7aUX9rimyxDMSuBhSqGGqFh9Ht7K1CKJQR3Whv7udC'
  ];

  if (!profile) return null;

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          
          <div className="relative w-full h-96 bg-slate-900">
            <img 
              alt={profile.name}
              className="w-full h-full object-cover"
              src={galleryPhotos[activePhotoIdx]}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Today</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span>{profile.compatibility}% Spark Match</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-6 right-6 flex flex-col text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold drop-shadow-md">
                  {profile.name}, {profile.age}
                </h2>
                {profile.isVerified && (
                  <span className="material-symbols-outlined text-cyan-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {profile.profession} • {profile.location}
              </p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">

            <div className="flex items-center gap-3 mb-2">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx ? 'border-pink-500 ring-2 ring-pink-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-2">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">About Me</h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                “{profile.bio || `I'm ${profile.name}, a ${profile.profession} based in ${profile.location}. Always exploring new ideas and looking for deep, intentional connections.`}”
              </p>
            </div>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-cyan-50 border border-pink-200/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    graphic_eq
                  </span>
                  <span>Voice Prompt • "My Sunday Routine"</span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">0:28</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 flex items-center gap-1 h-8">
                  {[40, 70, 30, 85, 60, 95, 45, 80, 55, 30, 90, 65, 40, 75, 50, 85, 35, 60].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-pink-500 animate-pulse' : 'bg-pink-300'
                      }`}
                      style={{ height: isPlayingAudio ? `${Math.min(95, Math.max(20, (h * ((i % 4) + 1) * 0.35).toFixed(0)))}%` : `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-pink-600 font-extrabold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
                <span>Zuno AI Resonance Breakdown</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed italic">
                “{profile.aiInsight}”
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Thoughtful Prompts
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-pink-600">The song that stops my day in its tracks...</span>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  “Chet Baker's 'I Get Along Without You Very Well' on vintage vinyl on a rainy October morning.”
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-cyan-600">My ideal non-negotiable Sunday...</span>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  “Farmers market sourdough, slow-drip matcha, reading architectural monographs, and listening bars in Red Hook.”
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Connection Intent &amp; Passions
              </h4>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_stories</span>
                  <span>{profile.intentLabel}</span>
                </span>

                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-cyan-50 border border-pink-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-pink-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  Compatibility Match
                </h4>
                <div className="px-2 py-1 rounded-full bg-white text-pink-600 font-extrabold text-xs shadow-sm border border-pink-100">
                  {profile.compatibility}% Match
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {(profile.compatibilityTraits || ['Shared Values', 'Similar Rhythm', 'Intellectual Spark']).map((trait, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white text-slate-700 font-semibold text-xs border border-slate-100 shadow-sm flex items-center gap-1">
                    <span className="text-pink-400 text-xs">✨</span>
                    {trait}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="p-4 border-t border-slate-200/80 bg-white flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onLike(profile);
                onClose();
              }}
              disabled={isLiked}
              className={`py-2.5 px-4 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isLiked ? 'check_circle' : 'favorite'}
              </span>
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>

            <button
              onClick={() => alert('Message action clicked!')}
              className="py-2.5 px-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">forum</span>
              <span>Message</span>
            </button>

            <button
              onClick={() => {
                onPass(profile);
                onClose();
              }}
              className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              <span>Pass</span>
            </button>

            <button
              onClick={() => alert('Profile reported to safety team.')}
              className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              <span>Report</span>
            </button>
          </div>

          <button
            onClick={() => alert('User blocked successfully.')}
            className="w-full py-2.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <span className="material-symbols-outlined text-sm">block</span>
            <span>Block Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
