'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, TrendingUp, Zap, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export function RightPanel() {
  return (
    <aside className="w-[300px] h-screen border-l border-white/5 bg-slate-950/20 backdrop-blur-3xl fixed right-0 top-0 p-8 flex flex-col gap-10 overflow-y-auto">
      {/* Neural Link Status */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Sync</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500">ACTIVE</span>
          </div>
        </div>
        
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Attention Load</p>
              <p className="text-sm font-bold text-white">Focus: 92%</p>
            </div>
          </div>
          <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '92%' }}
              className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
            />
          </div>
        </div>
      </section>

      {/* Daily Target */}
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Global Objectives</h3>
        <div className="space-y-4">
          {[
            { icon: Target, label: 'Release Alpha OS', progress: 75, color: 'text-indigo-400' },
            { icon: Zap, label: 'Performance Audit', progress: 40, color: 'text-pink-400' },
          ].map((goal, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <goal.icon className={cn("w-4 h-4", goal.color)} />
                  <span className="text-xs font-bold text-white">{goal.label}</span>
                </div>
                <span className="text-[10px] font-black text-slate-600">{goal.progress}%</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Activity Pulse */}
      <section className="flex-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">AI Activity Pulse</h3>
        <div className="space-y-3">
          {[
            'Analyzing cognitive shifts...',
            'Optimizing neural pathways...',
            'Syncing temporal metadata...',
            'Encoding architecture logs...'
          ].map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-3 text-[10px] font-bold text-slate-600 px-3 py-1.5 border-l border-white/5"
            >
              <Sparkles className="w-3 h-3 text-purple-500/40" />
              {text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Banner */}
      <div className="mt-auto p-6 rounded-[32px] bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-center shadow-2xl shadow-purple-500/20 group cursor-pointer hover:scale-[1.02] transition-transform">
        <TrendingUp className="w-8 h-8 text-white mb-3 fill-current opacity-80 group-hover:scale-110 transition-transform" />
        <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Growth Engine</p>
        <p className="text-white/80 text-[10px] font-medium leading-tight px-4">Analyze long-term efficiency vectors</p>
      </div>
    </aside>
  );
}
