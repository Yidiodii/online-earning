import React, { useState, useEffect } from 'react';
import { Droplet, Check, ShieldQuestion } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function FaucetView() {
  const { faucetLeft, faucetRefreshTime, useFaucet, addBalance, showNotification } = useAppContext();
  
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const REWARD = 0.001;

  const generateCaptcha = () => {
    setNumA(Math.floor(Math.random() * 20) + 1);
    setNumB(Math.floor(Math.random() * 20) + 1);
    setAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (!faucetRefreshTime) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = faucetRefreshTime - now;
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [faucetRefreshTime]);

  const handleClaim = () => {
    if (faucetLeft <= 0) return;
    
    if (parseInt(answer) === numA + numB) {
      if (useFaucet()) {
        addBalance(REWARD);
        generateCaptcha();
      }
    } else {
      showNotification("Incorrect captcha response!");
      setAnswer('');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20">
            <Droplet className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">Instant Faucet</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Solve math to claim {REWARD} Zer</p>
          </div>
        </div>
        
        <div className="sm:text-right w-full sm:w-auto bg-slate-800/40 p-3 rounded-xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Claims Left</div>
          <div className="text-xl font-bold text-white flex items-center sm:justify-end gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            {faucetLeft} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        
        {timeLeft && faucetLeft === 0 ? (
          <div className="w-full py-6 mb-6 text-center rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 font-mono text-sm sm:text-base">
            Next claims available in: <br/>
            <span className="text-cyan-400 font-bold text-2xl mt-2 inline-block">{timeLeft}</span>
          </div>
        ) : (
          <>
            <div className="w-full bg-slate-900/80 border border-white/5 p-6 rounded-xl mb-6 shadow-inner relative overflow-hidden text-center">
              <ShieldQuestion className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800/50 rotate-12" />
              
              <div className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-widest relative z-10">Verify you are human</div>
              
              <div className="flex justify-center items-center relative z-10 mb-6">
                <div className="text-3xl sm:text-4xl font-mono font-bold text-cyan-400 tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {numA} + {numB} = ?
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                <input 
                  type="number" 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter Answer"
                  className="w-full sm:flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 sm:py-4 px-4 text-white text-lg font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner placeholder:text-slate-600"
                  onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
                />
                <button
                  onClick={handleClaim}
                  disabled={faucetLeft <= 0 || !answer}
                  className={`
                    w-full sm:w-auto py-3 sm:py-4 px-8 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95
                    ${(faucetLeft <= 0 || !answer)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                    }
                  `}
                >
                  Claim
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
