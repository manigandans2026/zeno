import React, { useState } from 'react';
import VoicePlayer from './VoicePlayer';
import confetti from 'canvas-confetti';

export default function SparksTab({ onOpenWaitlist }) {
  const MAYA_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjovhGEdbUXZxRVOehz-vbBlhuV5zFFT09jm0gMHVQKoZ8R9iXL9vzB7UY_XVYOrzN-q-ieyr1LOQpkVoM6mfAKXXhKVi8j10XHv7sskP8zLJSQ9zA4bzJLWj8fOge3mcTsePDsrHGBGzicGSoVEZkEc9jesMTUb-B1YZFCqG9PM349IGWo6nhznhX3oQbdVqWtniptrE1KQuaa61fne-6isnzWEROxujX3VFbfpchjMJx5Id-fc_Wfw";
  const LEO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCYDortEtDT_dBUgzmC0Dog4IxyqCQw6I7_SbK2VbyM0OEevdkCjckLTMR6pB4fIrm6b5Re37UAGE_BSkEX-fIZUj6zpOL8HETX2C2h3Wx8yk5H1ZQdVnrIMCqlMIsj_eNbLIjOtLrl2WqMDo6q_pG9UQqjmRn1KOPEfT20H5UeHThKTuggoYc4DHQuWOfedFJ7hZkbdLeoG6TrDit-gn2W9xQcRTfmcItaSIaPWfbNhPt9cR_S0_Cx_g";

  const profiles = [
    {
      id: 1,
      name: 'Maya',
      age: 26,
      role: 'UX Designer',
      location: 'Brooklyn, NY',
      intent: 'Deep Talks',
      resonance: 98,
      voiceTitle: 'Voice Note: "My favorite Sunday playlist"',
      voiceDuration: '0:42',
      tags: ['Indie Cinema', 'Stargazing', 'Cold Brew Rituals'],
      img: MAYA_IMG,
      fallbackImg: '/avatars/elena.png',
      quote: 'Looking for someone who stays up discussing foreign films and mid-century architecture.',
      bio: 'Lover of analog synth sounds, 35mm film grain, rainy coffee shop mornings, and impromptu road trips to coastal towns.'
    },
    {
      id: 2,
      name: 'Leo',
      age: 28,
      role: 'Architect',
      location: 'Manhattan, NY',
      intent: 'Slow Dating',
      resonance: 96,
      voiceTitle: 'Voice Note: "Why vinyl sounds completely different"',
      voiceDuration: '0:35',
      tags: ['Analog Vinyl', 'Design Systems', 'Trail Running'],
      img: LEO_IMG,
      fallbackImg: '/avatars/kai.png',
      quote: 'Design purist by day, experimental acoustic music listener by night.',
      bio: 'Fascinated by urban spatial design, pour-over coffee single origins, and running trails before sunrise.'
    },
    {
      id: 3,
      name: 'Elena',
      age: 25,
      role: 'Creative Director',
      location: 'SoHo, NY',
      intent: 'Soul Connection',
      resonance: 94,
      voiceTitle: 'Voice Note: "Late night oil painting thoughts"',
      voiceDuration: '0:50',
      tags: ['Modern Art', 'Espresso', 'Ceramics'],
      img: '/avatars/elena.png',
      fallbackImg: MAYA_IMG,
      quote: 'Capturing lighting and shadows in everyday quiet moments.',
      bio: 'Working out of a sunlit studio in SoHo. Painting series based on urban reflections and evening neon.'
    },
    {
      id: 4,
      name: 'Kai',
      age: 27,
      role: 'Sound Producer',
      location: 'Williamsburg, NY',
      intent: 'Activity Co-creator',
      resonance: 97,
      voiceTitle: 'Voice Note: "Field recordings in the rain"',
      voiceDuration: '0:29',
      tags: ['Synthesizers', 'Cycling', 'Natural Wine'],
      img: '/avatars/kai.png',
      fallbackImg: LEO_IMG,
      quote: 'Always looking for new soundscapes and hidden jazz bars.',
      bio: 'Modular synth enthusiast, night cyclist, and collector of rare vinyl imports from Tokyo.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sparkedProfiles, setSparkedProfiles] = useState({});

  const currentProfile = profiles[currentIndex];

  const handleSpark = (profileId) => {
    setSparkedProfiles((prev) => ({ ...prev, [profileId]: true }));
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
  };

  return (
    <div className="pt-space-lg pb-space-xl max-w-7xl mx-auto px-4 sm:px-8 flex flex-col">
      
      <div className="text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs mb-2">
          <span className="material-symbols-outlined text-[16px] text-rose-500">local_fire_department</span>
          <span>Daily Resonance Introductions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sparks & Introductions
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Hand-picked profiles matched with your current emotional frequency.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        
        <div className="lg:col-span-5 bg-white rounded-2xl border border-pink-100 shadow-xl overflow-hidden relative flex flex-col">
          
          <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-400 to-cyan-400"></div>

          <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden">
            <img
              src={currentProfile.img}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = currentProfile.fallbackImg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 border border-pink-300 shadow-md backdrop-blur-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-pink-500 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-bold text-xs text-slate-900">
                {currentProfile.resonance}% Spark Match
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/80 backdrop-blur-sm border border-pink-400">
                  {currentProfile.intent}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                {currentProfile.role} • {currentProfile.location}
              </p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3 text-left">
            
            <VoicePlayer title={currentProfile.voiceTitle} duration={currentProfile.voiceDuration} />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Previous Profile"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <button
                onClick={() => handleSpark(currentProfile.id)}
                className={`flex-1 h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                  sparkedProfiles[currentProfile.id]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white shadow-[0_6px_22px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.45)]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {sparkedProfiles[currentProfile.id] ? 'check_circle' : 'favorite'}
                </span>
                <span>
                  {sparkedProfiles[currentProfile.id] ? 'Spark Sent!' : `Send Spark (${currentProfile.resonance}%)`}
                </span>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Next Profile"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 mt-6 lg:mt-0 flex flex-col gap-6 text-left">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Personal Philosophy</span>
              <p className="text-base text-slate-800 italic mt-1 font-medium bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                "{currentProfile.quote}"
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">About {currentProfile.name}</span>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">
                {currentProfile.bio}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-2 block">Interests & Quirks</span>
              <div className="flex flex-wrap gap-2">
                {currentProfile.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-500 text-[20px]">psychology</span>
              Compatibility Breakdown with You
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-xs text-slate-500 font-medium">Conversational Pacing</span>
                <span className="text-base font-bold text-pink-600 mt-1">99% Flow Sync</span>
                <span className="text-[11px] text-slate-500 mt-0.5">High natural back-and-forth</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-xs text-slate-500 font-medium">Value Trajectory</span>
                <span className="text-base font-bold text-cyan-600 mt-1">97% Aligned</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Shared relationship goals</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-xs text-slate-500 font-medium">Social Battery</span>
                <span className="text-base font-bold text-rose-600 mt-1">Ambivert Pair</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Balanced intro/extroversion</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-pink-50 border border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-pink-500 text-[24px]">stars</span>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Want 10+ Curated Sparks Daily?</h4>
                <p className="text-[11px] text-slate-600">Join Velvet VIP for unlimited neural intros.</p>
              </div>
            </div>
            <button
              onClick={onOpenWaitlist}
              className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-bold shadow-sm hover:bg-pink-600 transition-colors cursor-pointer shrink-0"
            >
              Upgrade to Velvet
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
