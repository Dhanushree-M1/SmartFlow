'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag, Zap, AlertCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { user } = useFirebase();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        priority,
        completed: false,
        userId: user.uid,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tags: ['New'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'notifications'), {
        title: 'New Neural Branch',
        content: `Objective "${title}" initialized in stack.`,
        type: 'task',
        read: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-white tracking-tight">ENCODE TASK</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">New Neural Entry</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block px-1">Blueprint Title</label>
                <input 
                  autoFocus
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Define task parameters..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500/40 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block px-1">Deep Metadata</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contextual details..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      priority === p 
                        ? p === 'high' ? "bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]" :
                          p === 'medium' ? "bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]" :
                          "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                        : "bg-white/5 border-white/5 text-slate-600 hover:border-white/10"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-white text-slate-950 font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-2xl shadow-white/5 disabled:opacity-50 text-sm uppercase tracking-widest"
              >
                {loading ? 'SYNCING...' : 'INITIALIZE TASK'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
