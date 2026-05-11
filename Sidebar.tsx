'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Focus as FocusIcon, 
  Calendar, 
  Target, 
  StickyNote,
  Activity,
  Settings,
  Sparkles,
  LogIn
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CheckCircle2, label: 'My Tasks' },
  { icon: Calendar, label: 'Calendar' },
  { icon: Target, label: 'Goals' },
  { icon: Activity, label: 'Habits' },
  { icon: StickyNote, label: 'Notes' },
  { icon: FocusIcon, label: 'Focus Mode' },
  { icon: BarChart3, label: 'Analytics', pro: true },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 h-screen border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col p-6 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div 
        onClick={() => onViewChange('dashboard')}
        className="flex items-center gap-3 mb-12 px-2 group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all group-hover:scale-110 group-hover:rotate-3">
          <Zap className="text-white w-5 h-5 fill-current" />
        </div>
        <span className="text-lg font-display font-black text-white tracking-widest uppercase">SmartFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black px-3 mb-4">Workspace</div>
        {navItems.map((item, index) => {
          const viewId = item.label.toLowerCase().replace(' ', '-');
          const isActive = currentView === viewId || (currentView === 'dashboard' && viewId === 'dashboard');
          
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onViewChange(viewId)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all group relative",
                isActive 
                  ? "bg-white/5 text-white border border-white/10 shadow-sm" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive ? (
                <div className="absolute left-0 w-1 h-6 bg-purple-500 rounded-full" />
              ) : (
                <item.icon className="w-4 h-4 group-hover:text-purple-400" />
              )}
              <span className="text-sm font-semibold">{item.label}</span>
              {item.pro && (
                <span className="ml-auto text-[8px] font-black bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded shadow-sm tracking-tighter">PRO</span>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="mt-auto px-1 pb-4">
        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-pink-400 hover:bg-pink-500/5 transition-all group font-bold text-xs uppercase tracking-widest"
        >
          <LogIn className="w-4 h-4 rotate-180" />
          Disconnect Sync
        </button>
      </div>

      <div className="pt-2">
        <div 
          onClick={() => onViewChange('analytics')}
          className="p-5 rounded-[24px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group cursor-pointer hover:border-purple-500/40 transition-all shadow-lg"
        >
          <div className="absolute top-0 right-0 p-1">
            <Sparkles className="w-8 h-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
          </div>
          <div className="text-[10px] font-black text-indigo-400 mb-1 uppercase tracking-widest">SmartFlow Pro</div>
          <div className="text-xs text-white font-bold mb-3 leading-tight">Unlock AI Cog Deepsync</div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold">Limit: 85%</span>
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
