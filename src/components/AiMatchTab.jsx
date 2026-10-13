import React, { useState } from 'react';
import AiExperienceSection from './AiExperienceSection';

export default function AiMatchTab({ onOpenWaitlist }) {
  const [mood, setMood] = useState('Deep Introspective');
  const [partnerInterest, setPartnerInterest] = useState('Film Photography');
  const [customIcebreaker, setCustomIcebreaker] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const moods = [
    'Deep Introspective',
    'Weekend Wanderlust',
    'Late Night Vinyl',
    'Creative Flow',
    'Cozy Coffee'
  ];

  const generateCustomPrompt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const templates = [
        `"Since you're both into ${partnerInterest} and in a ${mood} mood, ask them about the last project that made them lose track of time."`,
        `"Idea: 'If we were at a cozy spot right now listening to jazz, what story would you tell first?'"`,
        `"Pacing Check: You both share an ambivert rhythm. Start with: 'What is your favorite low-key Sunday ritual?'"`
      ];
      const selected = templates[Math.floor(Math.random() * templates.length)];
      setCustomIcebreaker(selected);
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="pt-space-lg pb-space-xl max-w-7xl mx-auto px-4 sm:px-8 flex flex-col">
      
      <div className="text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold text-xs mb-2">
          <span className="material-symbols-outlined text-[16px] text-cyan-600">psychology</span>
          <span>AI Connection Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Match Engine
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Tune your frequency and test the neural compatibility synthesis in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-left">
        
        <div className="bg-white rounded-2xl border border-cyan-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-cyan-600">vital_signs</span>
                Your Daily Energetic Frequency
              </span>
              <span className="text-[10px] bg-cyan-50 text-cyan-700 font-mono px-2.5 py-1 rounded-full border border-cyan-200 font-bold">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Select your mental state to recalculate real-time spark compatibility.
            </p>

            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-xs px-3.5 py-2 rounded-full border font-semibold transition-all cursor-pointer ${
                    mood === m
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-sm scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-cyan-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Current Status: <strong className="text-cyan-700">{mood}</strong></span>
            <span className="text-cyan-600 font-bold">Sync Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-pink-500 text-[20px]">auto_awesome</span>
              Personalized Icebreaker Generator
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Type an interest to simulate the AI Flow Assistant opening line.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={partnerInterest}
                onChange={(e) => setPartnerInterest(e.target.value)}
                placeholder="Enter an interest (e.g. Vintage synth, Ceramics)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-pink-500"
              />
              <button
                onClick={generateCustomPrompt}
                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                {isGenerating ? 'Generating...' : 'Generate Line'}
              </button>
            </div>
          </div>

          {customIcebreaker ? (
            <div className="p-4 bg-pink-50/60 border border-pink-100 rounded-xl text-xs sm:text-sm text-slate-800 italic animate-fade-in mt-2">
              {customIcebreaker}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic mt-2">
              Click generate to preview contextual prompts.
            </div>
          )}
        </div>

      </div>

      <AiExperienceSection />

      {onOpenWaitlist && (
        <div className="mt-8 text-center flex justify-center">
          <button
            onClick={onOpenWaitlist}
            className="h-11 px-6 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Experience AI Match in Live Deck</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
