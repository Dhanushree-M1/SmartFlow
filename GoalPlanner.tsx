'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Plus, CheckCircle2, Circle, Clock, Brain, ArrowRight } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function GoalPlanner() {
  const { userData, tasks } = useFirebase();
  const [isGenerating, setIsGenerating] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const handleGenerateRoadmap = async () => {
    if (!goalInput || !userData) return;
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      // In a real app, we'd call the Gemini API here to get a structured roadmap.
      // For this demo, we'll create some "AI suggested" tasks.
      const milestones = [
        { title: `Phase 1: Research ${goalInput}`, complexity: 'Low' },
        { title: `Phase 2: Fundamental Setup`, complexity: 'Medium' },
        { title: `Phase 3: Deep Protocol Execution`, complexity: 'High' }
      ];

      for (const m of milestones) {
        await addDoc(collection(db, 'tasks'), {
          userId: userData.userId,
          title: m.title,
          description: `AI-generated milestone for goal: ${goalInput}`,
          priority: m.complexity === 'High' ? 'high' : 'medium',
          status: 'todo',
          category: 'career',
          isAiGenerated: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          completed: false
        });
      }

      await addDoc(collection(db, 'notifications'), {
        title: 'Roadmap Synchronized',
        content: `Neural architecture for "${goalInput}" has been mapped to your task stack.`,
        type: 'insight',
        read: false,
        userId: userData.userId,
        createdAt: serverTimestamp()
      });

      setGoalInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Architecture Lab</h1>
        <p className="text-slate-500 text-sm font-medium">Map out long-term trajectories for your personal and career evolution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[40px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border border-white/10 relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">Neural Roadmap Generator</h2>
              </div>

              <div className="space-y-4">
                <p className="text-slate-400 text-sm font-medium">What cinematic objective are we targeting? (e.g. "Become a Senior Embedded Engineer", "Build a FinTech Startup")</p>
                <div className="flex gap-4">
                  <input 
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Enter trajectory focus..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                  <button 
                    onClick={handleGenerateRoadmap}
                    disabled={isGenerating || !goalInput}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
                  >
                    {isGenerating ? 'MAPPING...' : 'INITIALIZE'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[400px] h-full bg-[radial-gradient(ellipse_at_right,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Active Trajectories</h3>
            <div className="grid grid-cols-1 gap-4">
              {tasks.filter(t => t.isAiGenerated && !t.completed).length === 0 ? (
                <div className="p-12 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                  <Target className="w-10 h-10 text-slate-700 mb-4" />
                  <p className="text-slate-500 text-sm font-medium">No active roadmaps detected in current sector.</p>
                </div>
              ) : (
                tasks.filter(t => t.isAiGenerated && !t.completed).map(task => (
                  <div key={task.id} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{task.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{task.priority} Priority Protocol</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Awaiting Execution</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Trajectory Insights</h3>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Users who build daily career roadmaps see a <span className="text-purple-400 font-bold">240% increase</span> in goal realization velocity.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Target className="w-4 h-4 text-emerald-400 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Your current skill domain (Software Architecture) has a high market resonance in the <span className="text-emerald-400 font-bold">Web3 and AI</span> sectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
