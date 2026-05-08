import React, { useEffect, useState } from 'react';
import { Pickaxe, Power, CircleDashed, Activity, Zap, Cpu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function MiningView() {
  const { miningActive, miningStartTime, startMining, claimMining } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [earned, setEarned] = useState(0);
  const [hashrate, setHashrate] = useState('14.50');

  const RATE_PER_HOUR = 0.001;
  const MINING_DURATION_MS = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!miningActive || !miningStartTime) return;
      
      const now = Date.now();
      const elapsed = now - miningStartTime;
      
      if (elapsed >= MINING_DURATION_MS) {
        setProgress(100);
        setEarned(RATE_PER_HOUR);
      } else {
        const percent = (elapsed / MINING_DURATION_MS) * 100;
        setProgress(percent);
        setEarned((elapsed / MINING_DURATION_MS) * RATE_PER_HOUR);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (miningActive) {
      animate();
    } else {
      setProgress(0);
      setEarned(0);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [miningActive, miningStartTime]);

  useEffect(() => {
    if (!miningActive) return;
    const interval = setInterval(() => {
      // Simulate hashrate fluctuation
      const base = 14.5;
      const fluctuation = (Math.random() * 0.8) - 0.4;
      setHashrate((base + fluctuation).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, [miningActive]);

  const handleAction = () => {
    if (miningActive) {
      if (progress >= 100) {
        claimMining(RATE_PER_HOUR);
        setProgress(0);
        setEarned(0);
      }
    } else {
      startMining();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20">
          <Pickaxe className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">Cloud Mining</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Passive earning up to {RATE_PER_HOUR} Zer / hour</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Main Mining Circle */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-2xl border border-white/5 shadow-inner">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90 absolute">
              <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
              
              {miningActive && (
                <circle 
                  cx="50%" cy="50%" r="44%" 
                  stroke="url(#gradient)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="276%"
                  strokeDashoffset={`${276 - (276 * progress) / 100}%`}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }}
                />
              )}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="text-center absolute flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {earned.toFixed(7)}
              </div>
              <div className="text-xs sm:text-sm text-cyan-400 font-bold tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Zer Mined
              </div>
            </div>
          </div>

          <button
            onClick={handleAction}
            className={`
              w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
              ${!miningActive 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/20 hover:brightness-110' 
                : progress >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-900/20 hover:brightness-110 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }
            `}
            disabled={miningActive && progress < 100}
          >
            {!miningActive ? (
              <><Power className="w-5 h-5" /> Start Engine</>
            ) : progress >= 100 ? (
              'Collect Zer'
            ) : (
              <><CircleDashed className="w-5 h-5 animate-spin" /> Extracting...</>
            )}
          </button>
        </div>

        {/* Live Metrics */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 shadow-inner flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Network Hashrate</div>
                <div className="text-lg font-mono font-bold text-slate-200">
                  {miningActive ? hashrate : '0.00'} <span className="text-xs text-slate-500">TH/s</span>
                </div>
              </div>
            </div>
            {miningActive && <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>}
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 shadow-inner flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Power Consumption</div>
              <div className="text-lg font-mono font-bold text-slate-200">
                {miningActive ? '45' : '0'} <span className="text-xs text-slate-500">W/h</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 shadow-inner flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Block Progress</div>
                <div className="text-lg font-mono font-bold text-slate-200">
                  {progress.toFixed(2)}<span className="text-xs text-slate-500">%</span>
                </div>
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-auto bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center">
             <span className="text-[10px] text-blue-400/80 uppercase tracking-widest font-bold">Estimated Daily Earnings</span>
             <div className="text-lg font-mono font-bold text-blue-400">{(RATE_PER_HOUR * 24).toFixed(3)} Zer</div>
          </div>
        </div>

      </div>
    </div>
  );
}
