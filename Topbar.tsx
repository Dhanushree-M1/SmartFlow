'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, MessageSquare, Menu, Sparkles, X, Target, StickyNote, Activity, BellOff, Trash2, Check, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';
import { doc, updateDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface TopbarProps {
  onUpgradeClick?: () => void;
  onAddClick?: () => void;
}

export function Topbar({ onUpgradeClick, onAddClick }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { tasks, insights, notifications, user } = useFirebase();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.read) {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      }
    });
    await batch.commit();
  };

  const handleClearAll = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      batch.delete(doc(db, 'notifications', n.id));
    });
    await batch.commit();
    setIsNotifOpen(false);
  };

  const handleMarkRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const filteredTasks = searchQuery.length > 1 
    ? tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredInsights = searchQuery.length > 1
    ? insights.filter(i => 
        i.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredTasks.length > 0 || filteredInsights.length > 0;

  return (
    <header className="h-20 border-b border-white/5 bg-slate-950/20 backdrop-blur-md flex items-center px-10 gap-8 sticky top-0 z-40">
      {/* Mobile Menu Toggle (Simplified) */}
      <div className="xl:hidden">
        <Menu className="w-6 h-6 text-slate-400" />
      </div>

      {/* Command Bar */}
      <div ref={searchRef} className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Execute Neural Command... (⌘+K)" 
          className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 focus:bg-white/[0.08] transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-14 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden z-50 p-2"
            >
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {!hasResults ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-500">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No spectral matches found</p>
                    <p className="text-slate-600 text-[10px] mt-1">Refine your neural query parameters.</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-4">
                    {filteredTasks.length > 0 && (
                      <div>
                        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 px-4">Active Tasks</h3>
                        <div className="space-y-1">
                          {filteredTasks.map(task => (
                            <button 
                              key={task.id}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex items-center gap-4 transition-all group/item"
                            >
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                task.completed ? "bg-emerald-500" : task.priority === 'high' ? "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "bg-blue-500"
                              )} />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-white group-hover/item:text-purple-300 transition-colors">{task.title}</p>
                                <p className="text-[10px] text-slate-500 line-clamp-1">{task.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredInsights.length > 0 && (
                      <div>
                        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 px-4">Neural Insights</h3>
                        <div className="space-y-1">
                          {filteredInsights.map(insight => (
                            <button 
                              key={insight.id}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex items-center gap-4 transition-all group/item"
                            >
                              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Activity className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-white italic line-clamp-2">" {insight.content} "</p>
                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">{insight.type} protocol</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-slate-400">ESC</kbd>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Close</span>
                  </div>
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                  {filteredTasks.length + filteredInsights.length} Results
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onUpgradeClick}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest hover:border-purple-500/50 transition-all glow-purple active:scale-95"
        >
          <Sparkles className="w-3 h-3"  />
          Upgrade to Pro
        </button>

        <div className="w-px h-6 bg-white/5" />

        <div className="flex items-center gap-4">
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={cn(
                "p-2.5 rounded-xl transition-all relative",
                isNotifOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#020617] animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white tracking-widest uppercase">System Logs</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{unreadCount} Pending Neural Links</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={handleMarkAllRead}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                        title="Mark all as read"
                       >
                         <Check className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={handleClearAll}
                        className="p-2 rounded-lg bg-white/5 hover:bg-pink-500/10 text-slate-500 hover:text-pink-400 transition-all"
                        title="Clear all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-20 text-center px-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-600">
                          <BellOff className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                          No active neural signals detected. <br /> Systems are nominal.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id}
                            onClick={() => !notif.read && handleMarkRead(notif.id)}
                            className={cn(
                              "p-4 rounded-2xl transition-all cursor-pointer group flex items-start gap-4",
                              notif.read ? "opacity-40 hover:opacity-100" : "bg-white/5 border border-white/5"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                              notif.type === 'billing' ? "bg-emerald-500/10 text-emerald-400" :
                              notif.type === 'insight' ? "bg-purple-500/10 text-purple-400" :
                              "bg-blue-500/10 text-blue-400"
                            )}>
                              {notif.type === 'billing' ? <CreditCard className="w-4 h-4" /> :
                               notif.type === 'insight' ? <Sparkles className="w-4 h-4" /> :
                               <Activity className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-0.5">
                                <p className="text-xs font-bold text-white">{notif.title}</p>
                                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                                  {notif.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{notif.content}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                    <button 
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                    >
                      Return to Workspace
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={onAddClick}
          className="bg-white text-slate-950 px-6 py-2.5 rounded-2xl text-xs font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/10 flex items-center gap-2 active:scale-95 translate-y-0 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          ADD TASK
        </button>
      </div>
    </header>
  );
}
