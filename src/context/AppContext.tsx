import React, { createContext, useContext, useEffect, useState } from 'react';

// Define types
export type WithdrawRecord = {
  id: string;
  amount: number;
  address: string;
  status: 'Pending' | 'Success' | 'Failed';
  date: number;
};

interface AppState {
  // Auth
  user: { name: string; email: string } | null;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;

  balance: number;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  
  // Mining
  miningActive: boolean;
  miningStartTime: number | null;
  startMining: () => void;
  claimMining: (amount: number) => void;

  // Spin
  spinsLeft: number;
  spinRefreshTime: number | null;
  useSpin: () => boolean;

  // Faucet
  faucetLeft: number;
  faucetRefreshTime: number | null;
  useFaucet: () => boolean;

  // New Earnings
  lastDailyClaim: number;
  claimDailyBonus: () => boolean;
  tasks: { id: string; title: string; reward: number; duration: number; completed: boolean }[];
  completeTask: (taskId: string) => void;

  // Withdraw
  withdrawHistory: WithdrawRecord[];
  requestWithdraw: (amount: number, address: string) => boolean;

  // Notification
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('zc_balance') || 0));
  
  const [miningActive, setMiningActive] = useState(() => localStorage.getItem('zc_miningActive') === 'true');
  const [miningStartTime, setMiningStartTime] = useState(() => {
    const val = localStorage.getItem('zc_miningStartTime');
    return val ? Number(val) : null;
  });

  const [spinsLeft, setSpinsLeft] = useState(() => Number(localStorage.getItem('zc_spinsLeft') || 10));
  const [spinRefreshTime, setSpinRefreshTime] = useState(() => {
    const val = localStorage.getItem('zc_spinRefreshTime');
    return val ? Number(val) : null;
  });

  const [faucetLeft, setFaucetLeft] = useState(() => Number(localStorage.getItem('zc_faucetLeft') || 10));
  const [faucetRefreshTime, setFaucetRefreshTime] = useState(() => {
    const val = localStorage.getItem('zc_faucetRefreshTime');
    return val ? Number(val) : null;
  });

  const [lastDailyClaim, setLastDailyClaim] = useState(() => Number(localStorage.getItem('zc_lastDailyClaim') || 0));
  const [tasks, setTasks] = useState(() => {
    const defaultTasks = [
      { id: '1', title: 'Watch Video Ad', reward: 0.002, duration: 15, completed: false },
      { id: '2', title: 'Visit Sponsor Page', reward: 0.001, duration: 10, completed: false },
      { id: '3', title: 'Subscribe to Newsletter', reward: 0.003, duration: 20, completed: false },
      { id: '4', title: 'Join Telegram Channel', reward: 0.002, duration: 5, completed: false },
    ];
    const val = localStorage.getItem('zc_tasks');
    const storedTasks = val ? JSON.parse(val) : defaultTasks;
    
    // Reset tasks if a new day has passed since last daily claim
    if (Date.now() - Number(localStorage.getItem('zc_lastDailyClaim') || 0) > 24 * 60 * 60 * 1000) {
       return defaultTasks;
    }
    return storedTasks;
  });

  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawRecord[]>(() => {
    const val = localStorage.getItem('zc_withdrawHistory');
    return val ? JSON.parse(val) : [];
  });

  const [notification, setNotification] = useState<string | null>(null);

  const [user, setUser] = useState<{name: string, email: string} | null>(() => {
    const val = localStorage.getItem('zc_currentUser');
    return val ? JSON.parse(val) : null;
  });

  const login = (email: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('zc_users') || '[]');
    const existing = users.find((u: any) => u.email === email && u.pass === pass);
    if (existing) {
      const userData = { name: existing.name, email: existing.email };
      setUser(userData);
      localStorage.setItem('zc_currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('zc_users') || '[]');
    const exists = users.find((u: any) => u.email === email);
    if (exists) return false;

    users.push({ name, email, pass });
    localStorage.setItem('zc_users', JSON.stringify(users));

    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('zc_currentUser', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zc_currentUser');
  };

  // Play sound effect
  const playClaimSound = () => {
    try {
      // Trying to construct a basic beep sequence
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {
      // Ignore
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => curr === msg ? null : curr);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('zc_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('zc_miningActive', miningActive.toString());
    if (miningStartTime) {
      localStorage.setItem('zc_miningStartTime', miningStartTime.toString());
    } else {
      localStorage.removeItem('zc_miningStartTime');
    }
  }, [miningActive, miningStartTime]);

  useEffect(() => {
    localStorage.setItem('zc_withdrawHistory', JSON.stringify(withdrawHistory));
  }, [withdrawHistory]);

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
    playClaimSound();
  };

  const deductBalance = (amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  // Check refresh timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (spinRefreshTime && now > spinRefreshTime) {
        setSpinsLeft(10);
        setSpinRefreshTime(null);
        localStorage.setItem('zc_spinsLeft', '10');
        localStorage.removeItem('zc_spinRefreshTime');
      }
      if (faucetRefreshTime && now > faucetRefreshTime) {
        setFaucetLeft(10);
        setFaucetRefreshTime(null);
        localStorage.setItem('zc_faucetLeft', '10');
        localStorage.removeItem('zc_faucetRefreshTime');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [spinRefreshTime, faucetRefreshTime]);

  const useSpin = () => {
    if (spinsLeft > 0) {
      setSpinsLeft(prev => {
        const newLeft = prev - 1;
        localStorage.setItem('zc_spinsLeft', newLeft.toString());
        if (newLeft === 0) {
          const refresh = Date.now() + 15 * 60 * 1000; // 15 mins
          setSpinRefreshTime(refresh);
          localStorage.setItem('zc_spinRefreshTime', refresh.toString());
        }
        return newLeft;
      });
      return true;
    }
    return false;
  };

  const useFaucet = () => {
    if (faucetLeft > 0) {
      setFaucetLeft(prev => {
        const newLeft = prev - 1;
        localStorage.setItem('zc_faucetLeft', newLeft.toString());
        if (newLeft === 0) {
          const refresh = Date.now() + 15 * 60 * 1000; // 15 mins
          setFaucetRefreshTime(refresh);
          localStorage.setItem('zc_faucetRefreshTime', refresh.toString());
        }
        return newLeft;
      });
      return true;
    }
    return false;
  };

  const startMining = () => {
    if (!miningActive) {
      setMiningActive(true);
      setMiningStartTime(Date.now());
      showNotification("Mining started!");
    }
  };

  const claimMining = (amount: number) => {
    addBalance(amount);
    setMiningActive(false);
    setMiningStartTime(null);
    showNotification(`Claimed ${amount.toFixed(5)} Zer`);
  };

  const claimDailyBonus = () => {
    if (Date.now() - lastDailyClaim > 24 * 60 * 60 * 1000) {
      addBalance(0.005);
      const now = Date.now();
      setLastDailyClaim(now);
      localStorage.setItem('zc_lastDailyClaim', now.toString());
      
      // Reset tasks for the new day
      const resetTasks = tasks.map((t: any) => ({ ...t, completed: false }));
      setTasks(resetTasks);
      localStorage.setItem('zc_tasks', JSON.stringify(resetTasks));
      
      showNotification("Daily Bonus Claimed! +0.005 Zer");
      return true;
    }
    return false;
  };

  const completeTask = (taskId: string) => {
    setTasks((prev: any) => {
      const updated = prev.map((t: any) => {
        if (t.id === taskId && !t.completed) {
          addBalance(t.reward);
          showNotification(`Task Completed! +${t.reward} Zer`);
          return { ...t, completed: true };
        }
        return t;
      });
      localStorage.setItem('zc_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const requestWithdraw = (amount: number, address: string) => {
    if (deductBalance(amount)) {
      const newRecord: WithdrawRecord = {
        id: Math.random().toString(36).substring(2, 9),
        amount,
        address,
        status: 'Success',
        date: Date.now()
      };
      setWithdrawHistory(prev => [newRecord, ...prev]);
      showNotification("Withdrawal requested successfully!");
      
      // Send Telegram notification
      const TELEGRAM_BOT_TOKEN = '8731122993:AAF_j1aOIHJWyaflBP7WaLVYuFUTKIxd8Io';
      const TELEGRAM_CHAT_ID = '8232891677';
      const text = `🚀 *New Withdrawal Request* 🚀\n\n💰 *Amount:* ${amount} Zer\n🏦 *Address:* \`${address}\`\n⏱ *Time:* ${new Date().toLocaleString()}`;

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      }).catch(err => console.error("Telegram error:", err));

      return true;
    }
    showNotification("Insufficient balance!");
    return false;
  };

  const value = {
    user,
    login,
    register,
    logout,
    balance,
    addBalance,
    deductBalance,
    miningActive,
    miningStartTime,
    startMining,
    claimMining,
    spinsLeft,
    spinRefreshTime,
    useSpin,
    faucetLeft,
    faucetRefreshTime,
    useFaucet,
    lastDailyClaim,
    claimDailyBonus,
    tasks,
    completeTask,
    withdrawHistory,
    requestWithdraw,
    notification,
    showNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
