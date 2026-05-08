import React, { useState, useEffect } from 'react';
import { Target, Gift } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export function SpinView() {
  const { spinsLeft, spinRefreshTime, useSpin, addBalance } = useAppContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const REWARD = 0.001;
  const SETTINGS = [0.001, 0.002, 0.001, 0, 0.001, 0.005, 0.001, 0];

  useEffect(() => {
    if (!spinRefreshTime) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = spinRefreshTime - now;
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [spinRefreshTime]);

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    if (useSpin()) {
      setIsSpinning(true);
      // Determine landing spot (mock)
      const targetIndex = 0; // Fixed 0.001 reward as required
      const segmentAngle = 360 / SETTINGS.length;
      
      // Calculate rotation to land exactly on index 0
      const extraSpins = 5;
      const baseRotation = extraSpins * 360;
      // We want the top of the wheel (0 deg) to point to index 0, but it already does if not rotated
      // So let's spin completely some times.
      const newRotation = rotation + baseRotation;

      setRotation(newRotation);

      setTimeout(() => {
        setIsSpinning(false);
        addBalance(REWARD);
      }, 3000); // Wait for spin animation (3s)
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20">
            <Target className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">Lucky Spin</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Win {REWARD} Zer instantly</p>
          </div>
        </div>
        
        <div className="sm:text-right w-full sm:w-auto bg-slate-800/40 p-3 rounded-xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Spins Left</div>
          <div className="text-xl font-bold text-white flex items-center sm:justify-end gap-2">
            <Gift className="w-4 h-4 text-cyan-400" />
            {spinsLeft} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        {/* Simple wheel representation */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-10 mt-6">
          <div className="absolute top-0 left-1/2 -ml-3 -mt-4 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-cyan-400 drop-shadow-md"></div>
          
          <motion.div 
            className="w-full h-full rounded-full border-8 border-slate-800 bg-slate-900 relative overflow-hidden shadow-xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: 'easeOut' }}
          >
            {/* Wheel segments */}
            {SETTINGS.map((val, i) => {
              const angle = i * (360 / SETTINGS.length);
              return (
                <div 
                  key={i} 
                  className="absolute top-1/2 left-1/2 origin-left border-b border-t border-white/5 flex items-center justify-end pr-4 text-[10px] sm:text-xs font-mono font-bold"
                  style={{
                    width: '50%',
                    height: '24px',
                    marginTop: '-12px',
                    backgroundColor: i % 2 === 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.05)',
                    transform: `rotate(${angle}deg)`,
                    color: val > 0 ? '#22d3ee' : '#64748b'
                  }}
                >
                  <span style={{ transform: 'rotate(180deg)' }}>
                    {val > 0 ? val : 'ZERO'}
                  </span>
                </div>
              );
            })}
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -ml-4 -mt-4 sm:-ml-6 sm:-mt-6 w-8 h-8 sm:w-12 sm:h-12 bg-slate-800 flex items-center justify-center text-xl sm:text-2xl rounded-full shadow-md z-10">🎡</div>
          </motion.div>
        </div>

        {timeLeft && spinsLeft === 0 ? (
          <div className="w-full py-3 sm:py-4 text-center rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 font-mono text-xs sm:text-sm">
            Next spins in: <span className="text-cyan-400 font-bold">{timeLeft}</span>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning || spinsLeft <= 0}
            className={`
              w-full py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95
              ${(isSpinning || spinsLeft <= 0)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/20 border border-white/10'
              }
            `}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
          </button>
        )}
      </div>
    </div>
  );
}
