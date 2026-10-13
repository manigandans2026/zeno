import React, { useState } from 'react';

export default function MoodModal({ isOpen, onClose, currentMood, onSaveMood }) {
  const [selectedMood, setSelectedMood] = useState(currentMood);

  if (!isOpen) return null;

  const moodOptions = [
    {
      id: 'Introspective & Open',
      icon: 'self_improvement',
      desc: 'Prefers thoughtful messages over quick small talk',
      tempo: 'Slow & Deep'
    },
    {
      id: 'Spontaneous & Playful',
      icon: 'sparkles',
      desc: 'Up for fun banter, quick coffee dates, and lively conversation',
      tempo: 'Upbeat & Lively'
    },
    {
      id: 'Deep Intellectual',
      icon: 'psychology',
      desc: 'Wants to discuss philosophy, design, books, and big ideas',
      tempo: 'Engaged & Focused'
    },
    {
      id: 'Creative & Artistic',
      icon: 'palette',
      desc: 'Focused on music, film, art exhibitions, and shared inspiration',
      tempo: 'Expressive & Flowing'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-slate-200 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-pink-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              tune
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              Set Today's Mood Frequency
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Zuno adjusts your daily 5 curated resonances to match your current emotional energy and conversation tempo.
        </p>

        <div className="flex flex-col gap-2.5">
          {moodOptions.map((opt) => {
            const isSelected = selectedMood === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedMood(opt.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-pink-50/80 border-pink-500 ring-2 ring-pink-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900">{opt.id}</span>
                  <span className="text-[11px] text-slate-500 leading-tight">{opt.desc}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-pink-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveMood(selectedMood);
              onClose();
            }}
            className="py-2.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            Update Frequency
          </button>
        </div>
      </div>
    </div>
  );
}
