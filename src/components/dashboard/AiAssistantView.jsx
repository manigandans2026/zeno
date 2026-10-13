import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../../services/aiService';

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AiAssistantView({ user = null }) {
  const [activeMode, setActiveMode] = useState('dating');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chatContainerRef = useRef(null);

  const currentUser = user || {
    name: 'Kavya',
    profession: 'Architectural Designer',
    location: 'Brooklyn, NY',
    intent: 'Slow Romance',
    interests: ['Analog Vinyl', 'Brutalism', 'Matcha', '35mm Film']
  };

  const modules = [
    {
      id: 'dating',
      title: 'AI Dating Assistant',
      shortLabel: 'Dating Assistant',
      icon: 'favorite',
      badgeColor: 'bg-rose-500',
      welcome: `Hello ${currentUser.name}! Ask me for icebreakers, conversation starters, or intentional dating advice.`
    },
    {
      id: 'profile',
      title: 'AI Profile Assistant',
      shortLabel: 'Profile Assistant',
      icon: 'badge',
      badgeColor: 'bg-pink-500',
      welcome: `Profile Studio active. Ask me to polish your bio, write voice prompt answers, or suggest aura tags.`
    },
    {
      id: 'compatibility',
      title: 'AI Match Compatibility',
      shortLabel: 'Match Compatibility',
      icon: 'join_inner',
      badgeColor: 'bg-cyan-500',
      welcome: `Compatibility Engine ready. Ask me to analyze synergy between your profile and any match.`
    },
    {
      id: 'relationship',
      title: 'AI Relationship Coach',
      shortLabel: 'Relationship Coach',
      icon: 'psychology',
      badgeColor: 'bg-emerald-500',
      welcome: `Relationship Coach online. Ask about healthy pacing, attachment styles, or communicating boundaries.`
    },
    {
      id: 'conversation',
      title: 'AI Conversation Analysis',
      shortLabel: 'Chat Analysis',
      icon: 'insights',
      badgeColor: 'bg-amber-500',
      welcome: `Chat Analyst ready. Paste a message or ask how to reply to someone to spark genuine chemistry.`
    },
    {
      id: 'dates',
      title: 'AI Date Suggestion',
      shortLabel: 'Date Suggestion',
      icon: 'local_activity',
      badgeColor: 'bg-purple-500',
      welcome: `Date Planner active. Ask for custom date ideas, vinyl listening bars, or quiet aesthetic spots.`
    }
  ];

  const currentModule = modules.find(m => m.id === activeMode) || modules[0];

  const modePresets = {
    dating: [
      "Captivating icebreaker about analog music and architecture",
      "How to transition from texting to a relaxed first meet",
      "Express slow romance boundary without sounding distant",
      "Ask an open-ended question about weekend rituals"
    ],
    profile: [
      "Rewrite my bio with a magnetic minimalist brutalist aesthetic hook",
      "Give me 3 captivating voice prompt talking points",
      "Suggest 5 aura interest tags to stand out in Brooklyn",
      "Review my current bio and suggest 3 high-spark variations"
    ],
    compatibility: [
      "Analyze compatibility between Kavya (Architect) and Kavin (Sound Designer)",
      "Compare core values: Slow Romance vs Casual Exploratory intent",
      "What shared rituals would spark chemistry with an analog music creator?",
      "Calculate synergy with Ananya (Ceramist in Brooklyn)"
    ],
    relationship: [
      "How to navigate different texting tempos without getting anxious?",
      "What are healthy green flags to look for on dates 1 to 3?",
      "How to express emotional needs without feeling demanding?",
      "Techniques for deepening vulnerability on a quiet evening walk"
    ],
    conversation: [
      "Analyze recent conversation tone with Kavin (Audio Engineer)",
      "How to revive a conversation that is starting to feel like small talk?",
      "Evaluate my response: 'That sound installation in Red Hook sounds wild!'",
      "Detect whether their replies show genuine interest or polite courtesy"
    ],
    dates: [
      "Plan an intimate 3-stage evening date in Red Hook / Brooklyn",
      "Low-pressure daytime date: Specialty matcha & design bookstore",
      "Audiophile date: Vinyl listening lounge with acoustic ambient lighting",
      "Creative weekend date: Ceramics wheel throwing & quiet dinner"
    ]
  };

  const [chatLogs, setChatLogs] = useState({
    dating: [{ sender: 'ai', text: modules[0].welcome, time: 'Just now' }],
    profile: [{ sender: 'ai', text: modules[1].welcome, time: 'Just now' }],
    compatibility: [{ sender: 'ai', text: modules[2].welcome, time: 'Just now' }],
    relationship: [{ sender: 'ai', text: modules[3].welcome, time: 'Just now' }],
    conversation: [{ sender: 'ai', text: modules[4].welcome, time: 'Just now' }],
    dates: [{ sender: 'ai', text: modules[5].welcome, time: 'Just now' }]
  });

  // Scroll ONLY the inner chat feed, never scrolling the browser window!
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatLogs, activeMode, isLoading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };


  const handleExecutePrompt = async (promptText) => {
    if (!promptText.trim()) return;

    const currentModeKey = activeMode;
    const userTime = getTimestamp();

    const userMessage = {
      sender: 'user',
      text: promptText,
      time: userTime
    };

    setChatLogs(prev => ({
      ...prev,
      [currentModeKey]: [...(prev[currentModeKey] || []), userMessage]
    }));

    setCustomPrompt('');
    setIsLoading(true);

    try {
      const result = await askAiAssistant({
        prompt: promptText,
        mode: currentModeKey,
        userContext: currentUser
      });

      const reply = result.completion;
      const aiTime = getTimestamp();

      setChatLogs(prev => ({
        ...prev,
        [currentModeKey]: [
          ...(prev[currentModeKey] || []),
          { sender: 'ai', text: reply, time: aiTime }
        ]
      }));

    } catch (err) {
      console.error('AI assistant request failed:', err);
      const errorMessage = `⚠️ AI Service Notice:\n${err.message || 'Unable to connect to OpenRouter AI service.'}\n\nPlease verify that your server is running (PORT 5000) and that OPENROUTER_API_KEY is configured in your backend environment.`;
      const aiTime = getTimestamp();

      setChatLogs(prev => ({
        ...prev,
        [currentModeKey]: [
          ...(prev[currentModeKey] || []),
          { sender: 'ai', text: errorMessage, time: aiTime, isError: true }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatLogs(prev => ({
      ...prev,
      [activeMode]: [{ sender: 'ai', text: currentModule.welcome, time: 'Just now' }]
    }));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-slate-800">
      
      {/* Clean Top Header */}
      <div className="shrink-0 px-5 py-3 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-cyan-500 flex items-center justify-center text-white shadow-xs shrink-0">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {currentModule.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                API Connected
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Reset conversation"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          <span>Clear</span>
        </button>
      </div>

      {/* 6 AI Modules Tab Switcher */}
      <div className="shrink-0 grid grid-cols-3 sm:grid-cols-6 border-b border-slate-200 bg-slate-50/90 p-1.5 gap-1.5 overflow-x-auto no-scrollbar">
        {modules.map((mod) => {
          const isActive = activeMode === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveMode(mod.id)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 ring-1 ring-pink-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={`material-symbols-outlined text-base ${isActive ? 'text-pink-600' : 'text-slate-400'}`}>
                {mod.icon}
              </span>
              <span className="truncate">{mod.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Prompts Chips Carousel - Slim single line */}
      <div className="shrink-0 px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider shrink-0 flex items-center gap-0.5 mr-1">
          <span className="material-symbols-outlined text-xs">bolt</span>
          <span>Quick:</span>
        </span>
        {modePresets[activeMode]?.map((preset, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleExecutePrompt(preset)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-pink-50 border border-slate-200/80 text-[11px] font-medium text-slate-700 shrink-0 transition-colors cursor-pointer shadow-2xs hover:border-pink-300"
          >
            ✨ {preset.length > 38 ? preset.substring(0, 38) + '...' : preset}
          </button>
        ))}
      </div>

      {/* Dedicated Scrollable Chat Feed */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5 bg-gradient-to-b from-slate-50/30 to-white"
      >
        {(chatLogs[activeMode] || []).map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-2.5 max-w-2xl ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {!isUser && (
                <div className={`w-7 h-7 rounded-lg ${currentModule.badgeColor} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {currentModule.icon}
                  </span>
                </div>
              )}

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              <div className="flex flex-col gap-1 min-w-0">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.text}

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {currentModule.shortLabel}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-600 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">
                          {copiedIndex === idx ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className={`text-[9px] font-semibold text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 self-start max-w-md animate-fadeIn">
            <div className={`w-7 h-7 rounded-lg ${currentModule.badgeColor} text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse`}>
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </div>
            <div className="p-2.5 rounded-xl rounded-tl-none bg-white border border-slate-200 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" style={{ animationDelay: '200ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" style={{ animationDelay: '400ms' }}></span>
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecutePrompt(customPrompt);
        }}
        className="shrink-0 p-3 bg-white border-t border-slate-200/90 flex items-center gap-2"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            placeholder={`Type your prompt or question for ${currentModule.title}...`}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-medium transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!customPrompt.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-pink-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <span>Send</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>
    </div>
  );
}
