import React, { useState } from 'react';

export default function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'matching', label: 'Neural Matching' },
    { id: 'audio', label: 'Voice & Vibe' },
    { id: 'safety', label: 'Privacy & Safety' }
  ];

  const featuresList = [
    {
      id: 1,
      category: 'audio',
      icon: 'mic_double',
      title: 'Voice-First Audio Prompts',
      tag: 'Audio Vibe',
      desc: 'Listen to natural speech cadence, authentic laughter, and ambient playlists before ever typing a text line.',
      benefit: 'Eliminates flat profile impressions'
    },
    {
      id: 2,
      category: 'matching',
      icon: 'vital_signs',
      title: 'Dynamic Spark Resonance',
      tag: 'Algorithmic Depth',
      desc: 'Real-time 80% to 99% compatibility scores calculated from conversational rhythm, humor styles, and core values.',
      benefit: '98% higher response rates'
    },
    {
      id: 3,
      category: 'matching',
      icon: 'target',
      title: 'Explicit Intent Alignment',
      tag: 'Zero Misalignment',
      desc: 'Select your target trajectory: Slow Romance, Deep Talks, Casual Banter, or Activity Co-creator.',
      benefit: 'No wasted time or guessing'
    },
    {
      id: 4,
      category: 'safety',
      icon: 'verified_user',
      title: '3D Biometric Liveness Check',
      tag: '100% Real Humans',
      desc: 'Encrypted biometric verification seals your profile with the authentic Zuno Violet Ring badge.',
      benefit: 'Zero bots, syndicates, or catfishes'
    },
    {
      id: 5,
      category: 'matching',
      icon: 'auto_awesome',
      title: 'AI Conversation Catalyst',
      tag: 'Flow Assistant',
      desc: 'Contextual icebreaker nudges sparked by shared niche interests, eliminating dull "hey" openings.',
      benefit: 'Instant flow-state dialogue'
    },
    {
      id: 6,
      category: 'safety',
      icon: 'visibility_off',
      title: 'Incognito Sovereign Controls',
      tag: 'Stealth Mode',
      desc: 'Browse anonymously, hide your online status, and sync contact lists to block work colleagues.',
      benefit: 'Total personal peace of mind'
    }
  ];

  const filteredFeatures = activeCategory === 'all'
    ? featuresList
    : featuresList.filter((f) => f.category === activeCategory);

  return (
    <div className="mt-space-xl pt-12 max-w-7xl mx-auto px-4 sm:px-8 text-left" id="features">
      
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700">
          <span className="material-symbols-outlined text-[14px] text-pink-500">grid_view</span>
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
            Complete Feature Ecosystem
          </span>
        </div>

        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight font-extrabold">
          Engineered for Deep Human Connection
        </h2>
        <p className="font-body-md text-slate-600 mt-1 text-base max-w-xl">
          Discover the suite of intelligent tools designed to replace superficial swiping with genuine chemistry.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-cyan-50 border border-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-cyan-700 font-semibold">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>{item.benefit}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
