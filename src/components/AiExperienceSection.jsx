import React, { useState } from 'react';

export default function AiExperienceSection() {
  const [selectedTopic, setSelectedTopic] = useState('Kyoto Film');
  const [generatedPrompt, setGeneratedPrompt] = useState('“Ask Maya about the 35mm film camera she took to Kyoto last spring...”');
  const [isGenerating, setIsGenerating] = useState(false);

  const topics = [
    { name: 'Kyoto Film', text: '“Ask Maya about the 35mm film camera she took to Kyoto last spring...”' },
    { name: 'Vinyl Records', text: '“Leo loves 70s Japanese City Pop on vinyl. Ask him what album started his collection.”' },
    { name: 'Cold Brew', text: '“Compare your morning coffee ritual — ask if they prefer light roast pour-overs or dark espresso.”' },
    { name: 'Stargazing', text: '“Ask about the darkest night sky location they’ve ever seen the Milky Way from.”' }
  ];

  const handleTopicSelect = (t) => {
    setIsGenerating(true);
    setSelectedTopic(t.name);
    setTimeout(() => {
      setGeneratedPrompt(t.text);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="mt-space-xl pt-12 max-w-7xl mx-auto px-4 sm:px-8 text-left" id="ai-matching">
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800">
          <span className="material-symbols-outlined text-[14px] text-cyan-600">psychology_alt</span>
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
            Next-Gen Connection Intelligence
          </span>
        </div>

        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight font-extrabold">
          AI-Powered Experience
        </h2>
        <p className="font-body-md text-slate-600 mt-1 text-base max-w-xl">
          Subtle intelligence operating in the background to elevate natural human chemistry.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-pink-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full font-semibold">
                Flow Assistant
              </span>
              <span className="material-symbols-outlined text-pink-500 text-[24px]">chat_bubble_outline</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              AI Conversation Catalyst
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Personalized icebreakers derived from specific niche interests, eliminating awkward silence.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleTopicSelect(t)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    selectedTopic === t.name
                      ? 'bg-pink-500 text-white border-pink-500 font-semibold shadow-sm scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50 hover:border-pink-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-pink-100 flex flex-col gap-1 text-left min-h-[85px] justify-center">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-cyan-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Zuno Prompt Suggestion
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Demo</span>
            </div>
            
            <p className={`text-xs sm:text-sm text-slate-700 italic transition-opacity duration-300 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}>
              {generatedPrompt}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-cyan-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-semibold">
                Synthesis
              </span>
              <span className="material-symbols-outlined text-cyan-600 text-[24px]">insights</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Deep Compatibility Metrics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Comprehensive breakdowns covering communication frequencies, humor styles, and values.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-pink-100 flex flex-col">
              <span className="text-xs text-slate-500 font-medium">Humor Frequency</span>
              <span className="text-sm sm:text-base text-pink-600 font-bold mt-1">Dry / Witty</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-cyan-100 flex flex-col">
              <span className="text-xs text-slate-500 font-medium">Social Rhythm</span>
              <span className="text-sm sm:text-base text-cyan-600 font-bold mt-1">Ambivert Sync</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-pink-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full font-semibold">
                Real-World Magic
              </span>
              <span className="material-symbols-outlined text-pink-500 text-[24px]">location_on</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Curated Offline Encounters
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Context-aware date itineraries tailored to both people’s tastes, from late-night vinyl bars to ceramics classes.
            </p>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="material-symbols-outlined text-cyan-600 text-[28px]">coffee</span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate">
                The Listening Room & Espresso
              </span>
              <span className="text-xs text-slate-500 truncate">
                Shared overlap: Vinyl acoustics & natural wine
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
