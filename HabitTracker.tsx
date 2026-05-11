'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Check, Plus, Flame, Award, BarChart3 } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function HabitTracker() {
  const { userData, tasks } = useFirebase();
  const [newHabit, setNewHabit] = useState('');

  // Mock habits for demo if none exist
  const mockHabits = [
    { id: 'h1', title: 'Deep Work Session', streak: 12, completedToday: true },
    { id: 'h2', title: 'Neural Refactor (Coding)', streak: 5, completedToday: false },
    { id: 'h3', title: 'Bio-Sync (Exercise)', streak: 8, completedToday: true },
  ];

  const handleAddHabit = async () => {
    if (!newHabit || !userData) return;
    try {
      await addDoc(collection(db, 'habits'), {
        userId: userData.userId,
        title: newHabit,
        streak: 0,
        lastCompleted: null,
        createdAt: serverTimestamp()
      });
      setNewHabit('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Habit Protocols</h1>
        <p className="text-slate-500 text-sm font-medium">Recalibrate your daily execution consistency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Add Habit */}
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 flex items-center gap-4">
            <input 
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Initialize new habit loop..."
              className="flex-1 bg-transparent border-none text-white focus:ring-0 text-lg font-medium placeholder:text-slate-600 outline-none"
            />
            <button 
              onClick={handleAddHabit}
              className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Habit List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockHabits.map((habit, i) => (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-8 rounded-[40px] border transition-all group relative overflow-hidden",
                  habit.completedToday 
                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]" 
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                )}
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xl font-display font-black text-white tracking-tight uppercase">{habit.title}</h4>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={habit.completedToday ? {
                            scale: [1, 1.2, 1],
                            filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Flame className={cn(
                            "w-4 h-4 transition-colors", 
                            habit.completedToday ? "text-orange-500 fill-orange-500/20" : "text-slate-600"
                          )} />
                        </motion.div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{habit.streak} Day Streak</span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      habit.completedToday ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-600 group-hover:text-emerald-400"
                    )}>
                      <Check className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-slate-500">
                      <span>Streak Level</span>
                      <span>{Math.min(100, (habit.streak / 30) * 100).toFixed(0)}% to Milestone</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (habit.streak / 30) * 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          habit.completedToday ? "bg-gradient-to-r from-orange-500 to-yellow-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-slate-700"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={i} className={cn(
                        "flex-1 h-1.5 rounded-full",
                        i < 4 ? "bg-emerald-500" : "bg-white/5"
                      )} />
                    ))}
                  </div>
                </div>
                {habit.completedToday && (
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-16 h-16 text-emerald-500 fill-current" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Performance Insights</h3>
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">92% Consistency</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Habit Sync</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Habit Master</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Unlocked at lvl 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
