import React from 'react';
import { cn } from '../lib/utils';
import { Info } from 'lucide-react';

interface AdPlaceholderProps {
  width: string;
  height: string;
  className?: string;
  text?: string;
}

export function AdPlaceholder({ width, height, className, text }: AdPlaceholderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden relative group",
        className
      )}
      style={{ width, height, minHeight: height, minWidth: width }}
    >
      <span className="absolute top-1.5 right-1.5 text-[8px] font-bold text-slate-600 bg-slate-950/50 px-1 rounded">AD</span>
      <span className="text-slate-500/50 font-mono text-[10px] sm:text-xs uppercase tracking-widest pointer-events-none text-center px-4">
        {text || `${width} x ${height} Ad Space`}
      </span>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-cyan-500/[0.03] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
}
