import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const USERS = ['CryptoKing', 'Satoshi99', 'MoonWalker', 'HODLer', 'DogeLover', 'Whale123', 'NinjaMiner', 'CoinMaster'];
const ACTIONS = ['mined', 'claimed from faucet', 'won on spin', 'withdrew'];
const AMOUNTS = ['0.00100', '0.00200', '0.00500', '0.01000'];

type Activity = {
  id: string;
  user: string;
  action: string;
  amount: string;
  time: number;
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial fake data
    const initial = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random().toString(),
      user: USERS[Math.floor(Math.random() * USERS.length)],
      action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
      amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
      time: Date.now() - i * 15000,
    }));
    setActivities(initial);

    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = {
          id: Math.random().toString(),
          user: USERS[Math.floor(Math.random() * USERS.length)],
          action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
          amount: Math.random() > 0.8 ? '0.01000' : '0.00100',
          time: Date.now(),
        };
        return [newActivity, ...prev].slice(0, 5);
      });
    }, Math.random() * 5000 + 4000); // 4-9 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col mt-6 lg:mt-0 shadow-lg">
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Activity Feed</h4>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-3 font-mono text-[10px] sm:text-xs">
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-start gap-2 border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-cyan-500 font-bold">$</span>
              <span className="text-slate-400 flex-1 leading-snug">
                <span className="text-slate-300">{act.user}</span> {act.action} <span className="text-cyan-400 font-bold">{act.amount} Zer</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
