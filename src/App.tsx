import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ActivityFeed } from './components/ActivityFeed';
import { AdPlaceholder } from './components/AdPlaceholder';
import { MiningView } from './views/MiningView';
import { SpinView } from './views/SpinView';
import { FaucetView } from './views/FaucetView';
import { WithdrawView } from './views/WithdrawView';
import { TasksView } from './views/TasksView';
import { LandingView } from './views/LandingView';
import { Coins, Pickaxe, Target, Droplet, Wallet, Menu, X, Bell, CheckSquare, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { balance, notification, user, logout } = useAppContext();
  const [currentView, setCurrentView] = useState<'mining' | 'spin' | 'faucet' | 'tasks' | 'withdraw'>('mining');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'mining', label: 'Mining', icon: Pickaxe },
    { id: 'spin', label: 'Lucky Spin', icon: Target },
    { id: 'faucet', label: 'Faucet', icon: Droplet },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet },
  ] as const;

  if (!user) {
    return <LandingView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden pt-14">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-white/10 bg-slate-900/50 backdrop-blur-md z-50 transition-all flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <img src="https://i.ibb.co.com/JwxrZDYY/1578.png" alt="Zer Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">ZERO COIN</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`transition-colors ${currentView === item.id ? 'text-cyan-400' : 'hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hidden sm:inline-block">Balance</span>
              <span className="text-cyan-400 font-mono font-semibold">{balance.toFixed(5)} Zer</span>
            </div>

            <button 
              onClick={logout}
              title="Logout"
              className="hidden md:flex p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 z-40 p-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              <div className="p-4 bg-slate-800/50 rounded-xl mb-2 border border-white/5 flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>

              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    p-4 rounded-xl font-medium text-left transition-all flex items-center gap-3
                    ${currentView === item.id 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={logout}
                className="mt-2 p-4 rounded-xl font-medium text-left transition-all flex items-center gap-3 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
            className="fixed top-20 right-6 z-[100]"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/50 backdrop-blur-md px-4 py-3 rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_theme(colors.emerald.500)]"></div>
              <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">{notification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Top Ad */}
        <div className="mb-8 flex justify-center w-full overflow-hidden">
          <div className="hidden md:block">
            <iframe src="https://ad2bitcoin.com/ad.php?ref=tdsimranali25&width=728" marginWidth={0} marginHeight={0} width="728" height="90" scrolling="no" frameBorder="0" style={{ border: 0 }}></iframe>
          </div>
          <div className="md:hidden overflow-x-auto max-w-full">
            <iframe src="https://zerads.com/ad/ad.php?width=728&ref=11154" marginWidth={0} marginHeight={0} width="728" height="90" scrolling="no" frameBorder="0" style={{ border: 0 }}></iframe>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Ad */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <AdPlaceholder width="160px" height="600px" className="sticky top-28" text="160x600 Left Skyscraper" />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'mining' && <MiningView />}
                {currentView === 'spin' && <SpinView />}
                {currentView === 'faucet' && <FaucetView />}
                {currentView === 'tasks' && <TasksView />}
                {currentView === 'withdraw' && <WithdrawView />}
              </motion.div>
            </AnimatePresence>

            {/* Content Bottom Ad */}
            <div className="mt-8 flex justify-center">
              <div className="flex justify-center w-full overflow-hidden">
                <iframe src="https://ad2bitcoin.com/ad.php?ref=tdsimranali25&width=300" marginWidth={0} marginHeight={0} width="300" height="250" scrolling="no" frameBorder="0" style={{ border: 0 }}></iframe>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <ActivityFeed />
            
            <div className="sticky top-28">
              <AdPlaceholder width="100%" height="250px" text="Responsive Sidebar Ad" />
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
