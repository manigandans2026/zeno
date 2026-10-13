import React, { useState } from 'react';

export default function CompatibilityView({ 
  partner = {
    id: 'sora',
    name: 'Sora',
    fullName: 'Sora Lin',
    age: 27,
    profession: 'Ceramist & Architect',
    location: 'Brooklyn, NY (2.4 mi away)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf-XNphcEY4_nkQs0mwkhAfAinSgL8m7R_2ZPI5LNh1oieOIOqBhenPr1tbi7AJAaj-yKb3mrMFLqlM09JI8_dSC9dx_vraNzyuuzhujXn2Asst8zsyPSVOIEAaM5k0ymd0tzioebQZM4Bwm49Sv_vt8B_MWtd1EtFt0PI9ynnIn0frymccl_4Ux2I5eSTZa5PH_XSJfZxJtfKMvFRd65vFVL0rgzAF4wEi-Cg1CmD',
    compatibilityScore: 87,
    intentLabel: 'Slow Romance',
    cohort: 'Top 4% Cohort',
    summary: 'High semantic overlap in design, quiet routines, & cultural pace',
    intentMatch: 92,
    cadenceMatch: 88,
    interestsMatch: 85,
    lifestyleMatch: 84
  },
  onStartChat,
  onBack
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    triggerToast(isBookmarked ? "Removed from saved vault." : "Analysis saved to your private vault!");
  };

  const partnerName = partner.name || 'Sora';
  const score = partner.compatibilityScore || partner.compatibility || 87;
  const location = partner.location || 'Brooklyn, NY (2.4 mi away)';
  const cohort = partner.cohort || 'Top 4% Cohort';

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto text-slate-800 relative pb-16">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-pink-400 text-sm">bookmark</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
          <button onClick={onBack} className="hover:text-pink-600 transition-colors flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-sm text-pink-500 font-bold">favorite</span> Matches
          </button>
          <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
          <span className="text-slate-700">{partnerName}, {partner.age || 27}</span>
          <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
          <span className="text-pink-600 font-bold">AI Compatibility Analysis</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold text-[10px] tracking-widest uppercase">
                Deep Synthesis
              </span>
              <span className="text-xs text-slate-500 font-medium">Updated 14m ago</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Connection Resonance &amp; Compatibility
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">
              A multidimensional analysis of conversational tempo, shared values, and mutual lifestyle aspirations.
            </p>
          </div>

        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-100/60 via-slate-50 to-blue-100/40 p-4 border border-pink-200/60 shadow-sm mb-6 mt-2">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-pink-500/10 blur-2xl pointer-events-none"></div>
        <div className="relative flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-sm shrink-0 font-bold border border-pink-100">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-extrabold text-pink-700 tracking-wide uppercase">
              AI-Generated Insight Note
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              This <strong className="font-extrabold text-pink-600">{score}% resonance score</strong> is an algorithmic reflection designed to illuminate mutual affinities and inspire thoughtful conversations, not an empirical guarantee or deterministic science. Treat it as a creative lens for curiosity.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 lg:p-8 border border-slate-200/80 shadow-md mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
                <circle className="text-slate-100" cx="80" cy="80" fill="transparent" r="68" stroke="currentColor" strokeWidth="12"></circle>
                <circle 
                  className="text-pink-600" 
                  cx="80" 
                  cy="80" 
                  fill="transparent" 
                  r="68" 
                  stroke="url(#resonanceGradComp)" 
                  strokeDasharray="427.26" 
                  strokeDashoffset={427.26 - (427.26 * score) / 100} 
                  strokeLinecap="round" 
                  strokeWidth="12"
                ></circle>
                <defs>
                  <linearGradient id="resonanceGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b10e6b"></stop>
                    <stop offset="50%" stopColor="#d23284"></stop>
                    <stop offset="100%" stopColor="#2170e4"></stop>
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-extrabold text-pink-600 tracking-widest uppercase">Resonance</span>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
                  <span className="text-lg font-bold text-pink-600">%</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Exceptional Spark</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 mt-3">
              Mutual Resonance Index · Level 4 Depth
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-3">
                  <div className="relative">
                    <img 
                      className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-pink-500 bg-slate-200" 
                      alt="Elena" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfvwQpaIkzNtkxa2Bcbnu3rmZfJQjqXOzsy1uZnm1jehQicPPv0ZVMI2751crfkJGNB1zR4KLEu8ajZSzOa-_fuyEErCIQR3FpJ_V5NRFLkKp0rOcrWZCiVVApofn7zl_rWZNZhMrRdc1sZWvrREbSTU5ZMpJjBbbJS6laH5XrRdDfbG5_aj0U39S9vdE2XqcpiAlQkBToTrYJEBv2goOpeyafk8qJJ3d_gVJE82LJPfJ5B7N5eNdA0Q"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px] font-bold border border-white">✓</div>
                  </div>

                  <div className="relative">
                    <img 
                      className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-cyan-500 bg-slate-200" 
                      alt={partnerName} 
                      src={partner.photo}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px] font-bold border border-white">✓</div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900">Elena &amp; {partnerName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    <span className="text-xs text-slate-500 font-medium">{location}</span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{partner.summary || 'High semantic overlap in design, quiet routines, & cultural pace'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold">
                <span className="material-symbols-outlined text-sm">bubble_chart</span> 
                <span>{cohort}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-pink-600">track_changes</span> Intent Compatibility
                  </span>
                  <span className="text-xs font-extrabold text-pink-600">{partner.intentMatch || 92}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: `${partner.intentMatch || 92}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Unanimous 'Slow Romance' approach</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-600">chat_bubble</span> Conversation Cadence
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">{partner.cadenceMatch || 88}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${partner.cadenceMatch || 88}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Reflective cadence &amp; voice note affinity</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-cyan-600">palette</span> Common Interests
                  </span>
                  <span className="text-xs font-extrabold text-cyan-600">{partner.interestsMatch || 85}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" style={{ width: `${partner.interestsMatch || 85}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Tactile arts, audiophile &amp; architecture</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-700">balance</span> Lifestyle Rhythms
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">{partner.lifestyleMatch || 84}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full" style={{ width: `${partner.lifestyleMatch || 84}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Low-stimulus evenings, studio mornings</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
          <h2 className="text-xl font-extrabold text-slate-900">Dimensional Breakdown</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Concrete qualitative evidence synthesizing text prompts, behavioral preferences, and mutual filters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">explore</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Intent Compatibility</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Goal &amp; Velocity Harmony</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold">
                {partner.intentMatch || 92}% Match
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              Both Elena and {partnerName} explicitly marked <em>'Slow Romance'</em> and <em>'Mindful Exploration'</em> as core relationship pillars. Neither party engages in high-velocity swiping or casual churn.
            </p>
            <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Dating Speed</span>
                <span className="font-bold text-pink-600">Intentional &amp; Unhurried</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Offline Transition</span>
                <span className="font-bold text-slate-800">Prompt (After 3-5 days)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Commitment Horizon</span>
                <span className="font-bold text-slate-800">Long-term Companionship</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-pink-600 text-xs font-bold border-t border-slate-100">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>Key Insight: Zero friction or misalignment on relationship pacing.</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">forum</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Conversational Rhythm</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Linguistic Style &amp; Tempo</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
                {partner.cadenceMatch || 88}% Match
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              Both users showcase a preference for reflective, paragraph-style storytelling rather than rapid-fire single-word messaging. Voice note synergy is exceptionally high.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Semantic Curiosity Overlap</span>
                <span className="font-bold text-blue-600">Very High</span>
              </div>
              <svg className="w-full h-8 text-blue-500" viewBox="0 0 300 30" preserveAspectRatio="none">
                <path d="M0,25 Q40,5 80,18 T160,8 T240,22 T300,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                <circle cx="80" cy="18" r="3" fill="#2170e4"></circle>
                <circle cx="160" cy="8" r="3" fill="#2170e4"></circle>
                <circle cx="240" cy="22" r="3" fill="#2170e4"></circle>
              </svg>
              <span className="text-[11px] text-slate-500 font-medium">Shared lexicon: Spatial design, acoustic textures, Japanese woodwork</span>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-blue-600 text-xs font-bold border-t border-slate-100">
            <span className="material-symbols-outlined text-sm">graphic_eq</span>
            <span>Key Insight: Symmetric response latency &amp; voice message receptivity.</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">interests</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Common Passions</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Cultural Overlap &amp; Tactile Arts</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-extrabold">
                {partner.interestsMatch || 85}% Match
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              Significant concentration in analog culture and minimalist crafts. High alignment on specialized interests.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Ceramics & Wheel Throwing', 'Brutalist Architecture', 'Hi-Fi Vinyl Bars', 'Kyoto Tea & Aesthetics', 'Single-Origin Pourovers'].map((tag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-xs text-pink-600">check_circle</span>
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-cyan-700 text-xs font-bold border-t border-slate-100">
            <span className="material-symbols-outlined text-sm">stars</span>
            <span>Key Insight: Top 3% affinity in analog craftsmanship and audiophile culture.</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">routine</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Lifestyle Rhythms</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Daily Cadence &amp; Energy</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold">
                {partner.lifestyleMatch || 84}% Match
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              Both identify as grounded ambiverts who recharge in peaceful, tactile domestic environments.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">Social Recharge</span>
                <span className="text-xs font-bold text-slate-800">Low-stimulus spaces</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">Travel Preference</span>
                <span className="text-xs font-bold text-slate-800">Design residencies</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">Weekend Rhythm</span>
                <span className="text-xs font-bold text-slate-800">Morning galleries</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">Work-Life Balance</span>
                <span className="text-xs font-bold text-slate-800">Creative studios</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-slate-800 text-xs font-bold border-t border-slate-100">
            <span className="material-symbols-outlined text-sm">wb_sunny</span>
            <span>Key Insight: Complementary chronotypes and weekend rejuvenation habits.</span>
          </div>
        </div>

      </div>

      <div className="rounded-3xl bg-white p-6 lg:p-8 border border-slate-200/80 shadow-md mb-12 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          <div className="relative w-full lg:w-5/12 h-64 rounded-2xl overflow-hidden shadow-sm shrink-0">
            <img 
              alt="Japanese hi-fi vinyl lounge"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGkTWThovFUsRTIh31toEvdNoi2mdPP6pj6Lx3zVunLCYNRPzai6v8zHbg1MMkmrBmiel2cdB0hpGhvlidLMoA_SRiJk7sBIsRrCGc-Otl5oITgDsRMB3G4js_12JjE36PIeFlkX-dvCcGzzhhD634EYD0kiRr57e97N1Re4cVi7-si68Guz8qXrZhC1ohYwBcxMcuG4KTfU5NR5l8_xpYePYgFMy-6_YxDmrkhOJrd84q_y1bERgy2Q"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-cyan-400">volume_down</span>
                <span>Acoustic: Conversational (52dB)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-pink-500 text-white font-extrabold">
                96% Venue Synergy
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-7/12">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[10px] uppercase tracking-wide">
                Zuno AI Curated Date Venue
              </span>
              <span className="text-xs text-slate-500 font-medium">Greenpoint · 1.8 mi</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">
              Low-Stimulus Hi-Fi Vinyl Lounge &amp; Japanese Tea Bar
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tailored to your collective preference for tactile music listening, craft tea rituals, and gentle acoustic environments.
            </p>

            <div className="flex flex-wrap items-center gap-3 py-1 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-pink-600">check</span>
                <span>Rotational Vinyl Selects</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-pink-600">check</span>
                <span>Uji Matcha &amp; Rare Oolongs</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-pink-600">check</span>
                <span>Semi-Private Booth Seating</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => window.alert(`Proposed Date spot at Hi-Fi Vinyl Lounge to ${partnerName}!`)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors text-xs font-extrabold flex items-center gap-1.5 cursor-pointer border border-slate-200"
                type="button"
              >
                <span className="material-symbols-outlined text-base text-pink-600">calendar_today</span>
                <span>Propose This Date Spot</span>
              </button>

              <button 
                onClick={() => window.alert("Opening Vibe Deck menu preview...")}
                className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Menu &amp; Vibe Deck</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="sticky bottom-6 z-30 mt-auto py-2">
        <div className="max-w-md mx-auto rounded-full bg-white/95 backdrop-blur-xl p-2 shadow-2xl flex items-center justify-center gap-3 border border-slate-200">
          <button 
            onClick={toggleBookmark}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            title="Save Analysis to Vault" 
            type="button"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          <button 
            onClick={() => onStartChat && onStartChat(partner)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-95 text-white text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
            type="button"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Start Conversation with {partnerName}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
