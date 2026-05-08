import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle2, PlayCircle, Loader2, CalendarHeart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function TasksView() {
  const { lastDailyClaim, claimDailyBonus, tasks, completeTask } = useAppContext();
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskTimeLeft, setTaskTimeLeft] = useState<number>(0);
  const [timeToNextDaily, setTimeToNextDaily] = useState<string | null>(null);

  const canClaimDaily = Date.now() - lastDailyClaim > 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (canClaimDaily) {
      setTimeToNextDaily(null);
      return;
    }

    const interval = setInterval(() => {
      const diff = (lastDailyClaim + 24 * 60 * 60 * 1000) - Date.now();
      if (diff <= 0) {
        setTimeToNextDaily(null);
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeToNextDaily(`${hrs}h ${mins}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastDailyClaim, canClaimDaily]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTask && taskTimeLeft > 0) {
      timer = setInterval(() => {
        setTaskTimeLeft(prev => {
          if (prev <= 1) {
            completeTask(activeTask);
            setActiveTask(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTask, taskTimeLeft, completeTask]);

  const startTask = (id: string, duration: number) => {
    if (activeTask) return; // Prevent multiple tasks at once
    setActiveTask(id);
    setTaskTimeLeft(duration);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 border border-pink-500/20">
              <CalendarHeart className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">Daily Bonus</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Claim free Zer every 24 hours</p>
            </div>
          </div>
          <div className="sm:text-right w-full sm:w-auto bg-slate-800/40 p-3 rounded-xl border border-white/5">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Reward</div>
             <div className="text-xl font-bold text-pink-400 font-mono">+0.005 Zer</div>
          </div>
        </div>

        <button
          onClick={claimDailyBonus}
          disabled={!canClaimDaily}
          className={`
            w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
            ${!canClaimDaily
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white shadow-pink-900/20'
            }
          `}
        >
          {canClaimDaily ? (
            <>Claim Daily Bonus <Gift className="w-5 h-5" /></>
          ) : (
            `Next claim in: ${timeToNextDaily}`
          )}
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
         <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">PTC Ads & Tasks</h3>
         </div>
         
         <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                  task.completed 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : activeTask === task.id
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex-1 w-full flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                     task.completed ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                     : 'bg-slate-900 border-white/10 text-slate-400'
                   }`}>
                      {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                   </div>
                   <div>
                     <h4 className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                       {task.title}
                     </h4>
                     <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
                       <span className="text-cyan-400 font-mono">+{task.reward} Zer</span>
                       <span>•</span>
                       <span>{task.duration} Seconds</span>
                     </p>
                   </div>
                </div>
                
                <div className="w-full sm:w-auto">
                   <button
                     disabled={task.completed || activeTask !== null}
                     onClick={() => startTask(task.id, task.duration)}
                     className={`w-full sm:w-32 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2
                       ${task.completed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                       : activeTask === task.id 
                         ? 'bg-cyan-500 text-slate-950' 
                         : activeTask !== null 
                           ? 'bg-slate-800 text-slate-500 border border-white/5'
                           : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                       }
                     `}
                   >
                     {task.completed ? 'Done' : activeTask === task.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {taskTimeLeft}s</>
                     ) : 'Start'}
                   </button>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
