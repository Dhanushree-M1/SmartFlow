'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'purple' | 'pink' | 'blue' | 'orange' | 'emerald';
  data: any[];
}

export function StatCard({ title, value, change, icon: Icon, color, data }: StatCardProps) {
  const colorMap = {
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', stroke: '#a855f7' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', stroke: '#ec4899' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', stroke: '#3b82f6' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', stroke: '#f97316' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', stroke: '#10b981' },
  };

  const theme = colorMap[color];

  return (
    <div className={cn(
      "p-6 rounded-[32px] border bg-white/[0.02] transition-all hover:bg-white/[0.04] group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
      theme.border
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", theme.bg, theme.text)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn("text-[10px] font-black tracking-widest", theme.text)}>
          {change}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-display font-black text-white">{value}</h4>
      </div>

      <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={theme.stroke} 
              fill="transparent" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
