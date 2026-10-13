import React, { useState, useEffect, useRef } from 'react';

export default function VoicePlayer({ title = "Voice Note: My favorite Sunday playlist", duration = "0:32" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioCtxRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        const now = ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; 
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.2);
          gain.gain.setValueAtTime(0, now + idx * 0.2);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.2 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.2);
          osc.stop(now + idx * 0.2 + 0.45);
        });
      } catch (e) {
        console.log('Audio playback error', e);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 3;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 mt-1 text-cyan-600 bg-cyan-50/80 p-2 rounded-lg border border-cyan-100 transition-all hover:bg-cyan-100/60">
      <button 
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm hover:bg-cyan-600 transition-all active:scale-95"
        title={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm font-semibold truncate tracking-wide text-slate-800">
            {title}
          </span>
          <span className="text-[10px] text-cyan-700 font-mono pl-1">{duration}</span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {[40, 75, 50, 90, 65, 30, 80, 100, 45, 60, 85, 30, 70, 50].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                (i / 14) * 100 <= progress
                  ? 'bg-gradient-to-t from-pink-500 to-cyan-500'
                  : 'bg-cyan-200'
              } ${isPlaying ? `animate-wave-${(i % 5) + 1}` : ''}`}
              style={{ height: `${isPlaying ? Math.max(6, (h * (progress % 20 + 10)) / 25) : 8}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
