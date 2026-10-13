import React, { useState } from 'react';
import VoicePlayer from './VoicePlayer';

export default function HeroSection({ onOpenWaitlist, onExplore }) {
  const [resonance, setResonance] = useState(98);
  const [isResonanceHovered, setIsResonanceHovered] = useState(false);

  return (
    <div className="relative pt-space-lg lg:pt-12 max-w-7xl mx-auto px-4 sm:px-8" id="home">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
        
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-white/90 border border-pink-200 shadow-sm backdrop-blur-xl animate-fade-in">
            <span className="material-symbols-outlined text-[16px] text-pink-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm text-slate-800 font-semibold tracking-wide uppercase">
              The New Standard in Connection
            </span>
          </div>

          <h1 className="mt-space-md text-3xl sm:text-4xl lg:text-5xl lg:leading-tight text-slate-900 tracking-tight font-extrabold max-w-xl">
            Find people who actually want to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500">
              talk, connect,
            </span>{' '}
            and stay.
          </h1>

          <p className="mt-space-sm text-base sm:text-lg text-slate-800 font-medium max-w-lg leading-relaxed">
            More than just matches — discover meaningful conversations and emotional chemistry powered by emotional resonance.
          </p>

          <div className="mt-space-lg w-full sm:w-auto flex flex-col sm:flex-row gap-space-sm items-center justify-center lg:justify-start">
            <button
              onClick={onOpenWaitlist}
              className="w-full sm:w-auto h-12 px-8 rounded-md bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-base font-semibold flex items-center justify-center gap-space-xs shadow-[0_6px_22px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <span className="material-symbols-outlined text-[25px]">arrow_forward</span>
            </button>

            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                onExplore();
              }}
              className="w-full sm:w-auto h-12 px-6 rounded-md bg-white border border-slate-200 shadow-sm text-slate-800 text-base font-medium flex items-center justify-center gap-space-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[30px] text-cyan-600">play_circle</span>
              <span>Explore Zuno</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 w-full flex items-center justify-center lg:justify-start gap-8 text-slate-700 text-xs sm:text-sm">
            <div>
              <div className="font-extrabold text-slate-900 text-base sm:text-lg">98.4%</div>
              <div className="text-slate-500 text-xs">Verified Members</div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <div className="font-extrabold text-slate-900 text-base sm:text-lg">Voice-First</div>
              <div className="text-slate-500 text-xs">Authentic Vibe Check</div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <div className="font-extrabold text-slate-900 text-base sm:text-lg">Zero Bots</div>
              <div className="text-slate-500 text-xs">Biometric Liveness</div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-6 mt-12 lg:mt-0 w-full relative">
          <div className="flex flex-col gap-space-md relative z-10 max-w-md mx-auto lg:max-w-none">
            
            <div className="w-full rounded-2xl bg-white border border-pink-100/90 shadow-[0_8px_30px_rgba(244,63,94,0.08)] p-5 flex flex-col text-left relative overflow-hidden transition-transform hover:-translate-y-0.5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-cyan-400 opacity-90"></div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-pink-400/50 bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] sm:text-[38px] text-pink-400">person</span>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <span className="material-symbols-outlined text-[12px] text-white">verified</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 truncate">
                      Ananya, 23
                    </span>
                    <span className="text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full">
                      Deep Talks
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate mt-0.5">
                    UX Designer • Chennai, TN
                  </span>
                  
                  <VoicePlayer title="Voice Note: “My favorite Sunday playlist”" duration="0:42" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-cyan-200 text-cyan-800 font-medium">
                  Indie Cinema
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 font-medium">
                  Stargazing
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                  Filter Coffee Rituals
                </span>
              </div>
            </div>

            <div className="relative my-[-10px] self-center z-20 flex flex-col items-center group cursor-pointer"
                 onMouseEnter={() => setIsResonanceHovered(true)}
                 onMouseLeave={() => setIsResonanceHovered(false)}>
              <div className="h-6 w-0.5 bg-gradient-to-b from-pink-500 to-cyan-400 shadow-sm"></div>
              
              <div className="px-5 py-2 rounded-full bg-white border border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)] flex items-center gap-2 transition-all transform hover:scale-105">
                <span className="material-symbols-outlined text-[18px] text-pink-500 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  {resonance}% Spark Resonance
                </span>
                <span className="text-cyan-600 text-[10px] font-bold uppercase tracking-wider pl-1 border-l border-cyan-200">
                  Vibe Synced
                </span>
              </div>

              {isResonanceHovered && (
                <div className="absolute top-12 bg-white border border-pink-200 p-3 rounded-xl shadow-xl z-30 w-64 text-left animate-fade-in">
                  <div className="flex justify-between items-center mb-1.5 text-xs text-slate-700 font-semibold">
                    <span>Simulate Spark Resonance</span>
                    <span className="text-pink-600 font-bold text-sm">{resonance}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="99"
                    value={resonance}
                    onChange={(e) => setResonance(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400 to-pink-500 shadow-sm"></div>
            </div>

            <div className="w-full rounded-2xl bg-white border border-cyan-100/90 shadow-[0_8px_30px_rgba(6,182,212,0.08)] p-5 flex flex-col text-left relative overflow-hidden transition-transform hover:-translate-y-0.5">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 opacity-90"></div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-cyan-400/50 bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] sm:text-[38px] text-cyan-500">person</span>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <span className="material-symbols-outlined text-[12px] text-white font-bold">verified</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 truncate">
                      Aditya, 24
                    </span>
                    <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                      Slow Dating
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate mt-0.5">
                    Architect • Bengaluru, KA
                  </span>
                  
                  <div className="flex items-center gap-1.5 mt-2 text-pink-600 bg-pink-50/70 p-2 rounded-lg border border-pink-100">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span className="text-xs font-semibold">High Conversational Flow Sync</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 font-medium">
                  Carnatic Fusion
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-cyan-200 text-cyan-800 font-medium">
                  Design Systems
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                  Trekking
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
