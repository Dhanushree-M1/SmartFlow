'use client';

import React from 'react';
import { motion } from 'motion/react';

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse" />
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full relative z-10 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        />
        <div className="mt-8 text-[10px] text-slate-500 font-black tracking-[0.5em] uppercase text-center ml-1">
          Syncing Neural State
        </div>
      </div>
    </div>
  );
}
