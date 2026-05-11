'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Clock, Target, Zap, Activity } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', tasks: 12, focus: 4 },
  { name: 'Tue', tasks: 19, focus: 6 },
  { name: 'Wed', tasks: 15, focus: 5 },
  { name: 'Thu', tasks: 22, focus: 8 },
  { name: 'Fri', tasks: 18, focus: 7 },
  { name: 'Sat', tasks: 10, focus: 3 },
  { name: 'Sun', tasks: 8, focus: 2 },
];

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b'];

export function Analytics() {
  const { tasks, userData } = useFirebase();

  const stats = [
    { title: 'Project Velocity', value: '84%', icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Avg Focus Depth', value: '5.2h', icon: Clock, color: 'text-purple-400' },
    { title: 'Goal Alignment', value: '92%', icon: Target, color: 'text-emerald-400' },
    { title: 'Cognitive Load', value: 'Medium', icon: Activity, color: 'text-orange-400' },
  ];

  if (userData?.subscriptionTier === 'free') {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-[32px] bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 blur-sm">
          <BarChart3 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-4">Neural Analytics Encrypted</h2>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
          Detailed cognitive performance metrics and velocity heatmaps are exclusive to the <span className="text-blue-400 font-bold italic">PRO Protocol</span>.
        </p>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
          Unlock Analytics Node
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header>
        <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Performance Matrix</h1>
        <p className="text-slate-500 text-sm font-medium">Real-time data synchronization of your cognitive and project velocity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group hover:border-white/20 transition-all"
          >
            <stat.icon className={cn("w-6 h-6 mb-4 opacity-50 group-hover:opacity-100 transition-opacity", stat.color)} />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.title}</h4>
            <p className="text-3xl font-display font-black text-white tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[48px] bg-white/[0.03] border border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Velocity</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Tasks</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-10 rounded-[48px] bg-white/[0.03] border border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cognitive Distribution</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase">Focus</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                   itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Bar dataKey="focus" fill="#a855f7" radius={[10, 10, 10, 10]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-12 rounded-[48px] bg-gradient-to-br from-blue-600/[0.05] to-emerald-500/[0.05] border border-white/10 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-display font-black text-white tracking-tighter uppercase mb-4">Daily Flow Report</h3>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Your "Deep Focus" windows are increasing in length by <span className="text-emerald-400 font-black">12% weekly</span>. We recommend scheduling high-complexity architectural tasks between <span className="text-blue-400 font-black">09:00 - 11:30</span> for maximum output.
          </p>
        </div>
        <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative z-10">
          <Zap className="w-12 h-12 text-yellow-500 fill-current animate-pulse" />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(ellipse_at_right,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      </div>
    </div>
  );
}
