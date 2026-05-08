import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

export function LandingView() {
  const { login, register } = useAppContext();
  const [view, setView] = useState<'landing' | 'login' | 'register'>('landing');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, pass);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !pass) {
      setError('All fields are required');
      return;
    }
    const success = register(name, email, pass);
    if (!success) {
      setError('Email already exists');
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-3xl w-full"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-28 h-28 mx-auto mb-10 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-5 border border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center relative group"
          >
             <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity blur-xl"></div>
             <img src="https://i.ibb.co.com/JwxrZDYY/1578.png" alt="Zer Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white mb-6 uppercase"
          >
            Welcome to <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Zero Coin</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium"
          >
            The next generation cloud mining platform. Start earning <span className="text-cyan-400 font-bold">Zer</span> tokens effortlessly today with our enterprise-grade infrastructure.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => setView('login')}
              className="w-full sm:w-auto px-10 py-5 bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/50 text-white border border-white/10 hover:border-white/20 rounded-2xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
            >
              <LogIn className="w-5 h-5" /> Member Login
            </button>
            <button
              onClick={() => setView('register')}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] border border-white/10 rounded-2xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              <UserPlus className="w-5 h-5" /> Start Earning Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
           <div className="w-20 h-20 bg-slate-800 rounded-2xl p-3 border border-white/10 shadow-lg relative group">
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-md group-hover:bg-cyan-500/30 transition-colors"></div>
              <img src="https://i.ibb.co.com/JwxrZDYY/1578.png" alt="Zer Logo" className="w-full h-full object-contain relative z-10" />
           </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-white mb-3 tracking-tight">
          {view === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8 font-medium">
          {view === 'login' ? 'Login to continue mining Zer' : 'Register to start earning Zer'}
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center font-bold tracking-wide"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-5">
          {view === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Gmail / Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              placeholder="name@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            {view === 'login' ? 'Secure Login' : 'Complete Registration'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <button 
            onClick={() => {
              setView(view === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors font-medium"
          >
            {view === 'login' ? (
              <span>Don't have an account? <span className="text-white font-bold underline decoration-cyan-500 underline-offset-4">Register</span></span>
            ) : (
              <span>Already have an account? <span className="text-white font-bold underline decoration-cyan-500 underline-offset-4">Login</span></span>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => setView('landing')}
            className="text-slate-600 hover:text-slate-300 text-[10px] uppercase tracking-widest font-bold transition-colors inline-flex items-center gap-1"
          >
            &larr; Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
