'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickyNote, Plus, Search, Trash2, Edit3, Save, X, ExternalLink, Zap } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';
import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export function Notes() {
  const { userData, tasks } = useFirebase();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [search, setSearch] = useState('');

  // Mock notes for demo
  const mockNotes = [
    { id: 'n1', title: 'Product Launch Architecture', content: 'Focus on glassmorphism UI and optimized Firebase queries...', category: 'Work', date: '2h ago' },
    { id: 'n2', title: 'Daily Cognitive Reflections', content: 'Peak performance noted during morning focus mode session...', category: 'Insight', date: '5h ago' },
    { id: 'n3', title: 'React Performance Audit', content: 'Investigate component re-renders in the timeline view...', category: 'Code', date: '1d ago' },
  ];

  const handleCreateNote = async () => {
    if (!newNote.title || !userData) return;
    try {
      await addDoc(collection(db, 'notes'), {
        userId: userData.userId,
        ...newNote,
        createdAt: serverTimestamp(),
      });
      setNewNote({ title: '', content: '' });
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Knowledge Base</h1>
          <p className="text-slate-500 text-sm font-medium">Capture neural fragments and architectural blueprints.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Capture Fragment
        </button>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-600" />
        </div>
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search neural paths..."
          className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/30 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 rounded-[40px] bg-blue-600/10 border-2 border-blue-500/30 space-y-6 relative overflow-hidden"
            >
              <input 
                autoFocus
                placeholder="Fragment Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full bg-transparent border-none text-2xl font-display font-black text-white placeholder:text-blue-500/30 outline-none p-0 tracking-tighter uppercase"
              />
              <textarea 
                placeholder="Decrypt your thoughts here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full h-40 bg-transparent border-none text-slate-400 placeholder:text-blue-500/20 outline-none p-0 resize-none font-medium leading-relaxed"
              />
              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={handleCreateNote}
                  className="flex-1 py-4 bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-2xl"
                >
                  Save Fragment
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-4 bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10"
                >
                  Discard
                </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-32 h-32 text-blue-400 fill-current" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mockNotes.map((note, i) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] group transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                  {note.category}
                </span>
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{note.date}</span>
              </div>
              <h4 className="text-xl font-display font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                {note.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-4">
                {note.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-8">
              <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border-2 border-[#020617]" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-white/5 text-slate-600 hover:text-white transition-all">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button className="p-2.5 rounded-xl bg-white/5 text-slate-600 hover:text-white transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
