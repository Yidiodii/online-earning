import React, { useState } from 'react';
import { Wallet, History, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function WithdrawView() {
  const { balance, requestWithdraw, withdrawHistory } = useAppContext();
  
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const MIN_WITHDRAW = 0.01;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val < MIN_WITHDRAW) return;
    if (val > balance) return;
    if (address.length < 10) return;

    if (requestWithdraw(val, address)) {
      setAmount('');
      setAddress('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Success': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  // Safe checks for buttons
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= MIN_WITHDRAW && parsedAmount <= balance;
  const isValidAddress = address.length >= 10;
  const canWithdraw = isValidAmount && isValidAddress;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-full max-w-xl bg-slate-900/40 border border-white/5 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">Withdraw Funds</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Transfer Zer to your wallet</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Min: {MIN_WITHDRAW} Zer</span>
        </div>

        <div className="mb-6 bg-slate-800/30 rounded-xl p-4 border border-white/5 flex gap-4 justify-between items-center relative z-10">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Available</div>
          <div className="text-lg font-mono font-bold text-emerald-400">{balance.toFixed(5)} Zer</div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4 py-2 relative z-10">
          
          <div>
            <div className="relative">
              <input 
                type="number" 
                step="0.00001"
                min={MIN_WITHDRAW}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Amount (Min ${MIN_WITHDRAW})`}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 pr-16 text-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              />
              <button 
                type="button"
                onClick={() => setAmount(balance.toString())}
                className="absolute right-3 top-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                Max
              </button>
            </div>
            {parsedAmount < MIN_WITHDRAW && amount.length > 0 && (
              <p className="text-red-400 text-[10px] mt-1.5 uppercase font-bold tracking-wider">Minimum is {MIN_WITHDRAW} Zer</p>
            )}
            {parsedAmount > balance && (
              <p className="text-red-400 text-[10px] mt-1.5 uppercase font-bold tracking-wider">Insufficient balance</p>
            )}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Zer Wallet Address"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 pr-10 text-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
            <span className="absolute right-4 top-3.5 text-slate-600 text-sm">#</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!canWithdraw}
              className={`
                w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95
                ${!canWithdraw
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }
              `}
            >
              Request Withdrawal
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-1.5 pt-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Network: <span className="text-emerald-400">Stable</span></p>
          </div>
        </form>
      </div>

      {withdrawHistory.length > 0 && (
        <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">History</h3>
          </div>

          <div className="space-y-2">
            {withdrawHistory.map(record => (
              <div key={record.id} className="bg-slate-800/30 border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`text-[10px] px-2 py-1 rounded border font-bold tracking-widest uppercase ${getStatusColor(record.status)}`}>
                    {record.status}
                  </div>
                  <div>
                    <div className="text-slate-300 font-mono font-bold text-sm">{record.amount.toFixed(5)} Zer</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[150px]" title={record.address}>
                      {record.address}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-right uppercase tracking-wider font-bold">
                  {new Date(record.date).toLocaleDateString()} <br />
                  {new Date(record.date).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
