'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  MoreHorizontal, 
  Tag,
  Paperclip,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  tags?: string[];
  isMock?: boolean;
}

const mockTasks: Task[] = [
  {
    id: 'mock-1',
    title: 'Neural Network Architecture Review',
    description: 'Optimize cognitive flow pathways for next-gen UI integration.',
    time: '9:00 AM',
    priority: 'high',
    completed: true,
    tags: ['Design', 'Core'],
    isMock: true
  },
  {
    id: 'mock-2',
    title: 'Collaborative Sync: Project Velocity',
    description: 'Syncing with the architecture team to align on performance goals.',
    time: '11:30 AM',
    priority: 'medium',
    completed: false,
    tags: ['Team'],
    isMock: true
  }
];

interface TimelineProps {
  tasks: Task[];
  onToggle?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
}

export function Timeline({ tasks: dynamicTasks, onToggle, onDelete }: TimelineProps) {
  const displayTasks = dynamicTasks.length > 0 ? dynamicTasks : mockTasks;

  const handleToggle = (task: Task) => {
    if (task.isMock || !onToggle) return;
    onToggle(task.id, task.completed);
  };

  const handleDelete = (task: Task) => {
    if (task.isMock || !onDelete) return;
    onDelete(task.id);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Temporal Workflow</h3>
        <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
      </div>

      <div className="relative space-y-6">
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-slate-800/50 shadow-[0_0_10px_rgba(255,255,255,0.02)]" />
        
        {displayTasks.map((task, index) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-8 group"
          >
            {/* Timeline Dot */}
            <div 
              onClick={() => handleToggle(task)}
              className={cn(
                "z-10 shrink-0 w-7 h-7 rounded-full border-4 bg-[#020617] mt-1.5 transition-all duration-500 flex items-center justify-center",
                !task.isMock && "cursor-pointer group-hover:scale-110",
                task.completed 
                  ? "border-emerald-500 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : task.priority === 'high' 
                    ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "border-slate-700",
                !task.isMock && !task.completed && "group-hover:border-blue-500"
              )}
            >
              {task.completed && <Check className="w-3 h-3 text-white" />}
            </div>

            {/* Content Card */}
            <div className={cn(
              "flex-1 p-5 rounded-[28px] border transition-all relative overflow-hidden group/card",
              !task.isMock && "cursor-pointer",
              task.completed 
                ? "bg-white/[0.02] border-white/5 opacity-50" 
                : "bg-white/5 border-white/10 shadow-lg",
              !task.isMock && !task.completed && "group-hover:bg-white/[0.08] group-hover:-translate-y-0.5"
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    task.priority === 'high' ? "text-purple-400" : "text-slate-500"
                  )}>
                    {task.time}
                  </span>
                  <span className={cn(
                    "text-[8px] px-2 py-0.5 rounded-md border font-black uppercase tracking-tighter",
                    task.priority === 'high' 
                      ? "bg-pink-500/10 text-pink-400 border-pink-500/20" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!task.isMock && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(task); }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 transition-all opacity-0 group-hover/card:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <MoreHorizontal className="w-4 h-4 text-slate-600 hover:text-white transition-colors" />
                </div>
              </div>

              <h4 className={cn(
                "text-base font-bold mb-2 tracking-tight",
                task.completed ? "line-through text-slate-500" : "text-white"
              )}>
                {task.title}
              </h4>
              
              {task.description && (
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{task.description}</p>
              )}

              <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Paperclip className="w-3 h-3" />
                  <span className="text-[10px] font-bold">2</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-[10px] font-bold">5</span>
                </div>
                {task.tags?.map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 ml-auto">
                    <Tag className="w-3 h-3 text-emerald-500/50" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
