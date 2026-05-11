'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Zap, User, Settings, LogOut, Bell, LayoutDashboard, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands = [
    { id: 'dash', title: 'Dashboard', icon: LayoutDashboard, action: () => router.push('/') },
    { id: 'task', title: 'Create Task', icon: Plus, shortcut: 'T', action: () => console.log('Create Task') },
    { id: 'goal', title: 'Set New Goal', icon: Target, action: () => console.log('Set Goal') },
    { id: 'ai', title: 'Ask Coach', icon: Zap, action: () => console.log('Ask AI') },
    { id: 'settings', title: 'Settings', icon: Settings, action: () => router.push('/settings') },
    { id: 'logout', title: 'Sign Out', icon: LogOut, action: () => console.log('Sign Out') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (index: number) => {
    const cmd = filteredCommands[index];
    if (cmd) {
      cmd.action();
      setIsOpen(false);
      setSearch('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl glass rounded-3xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="flex items-center px-6 border-b border-white/5 h-16">
              <Search className="w-5 h-5 text-slate-500 mr-3" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What protocol should we execute?"
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:ring-0 outline-none text-lg"
              />
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500 font-bold uppercase">ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(i)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group",
                      selectedIndex === i ? "bg-blue-600/20 text-white" : "hover:bg-white/5 text-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <cmd.icon className={cn(
                        "w-5 h-5",
                        selectedIndex === i ? "text-blue-400" : "text-slate-500"
                      )} />
                      <span className="font-medium">{cmd.title}</span>
                    </div>
                    {cmd.shortcut && (
                      <span className="text-[10px] text-slate-600 font-bold uppercase border border-white/5 px-2 py-0.5 rounded group-hover:border-white/10">{cmd.shortcut}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-500 font-medium">No results found for "{search}"</p>
                  <p className="text-slate-600 text-sm mt-1">Try searching for tasks, goals, or AI coaching.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono">↑↓</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono">↵</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Select</span>
                </div>
              </div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">Neural Path Active</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
