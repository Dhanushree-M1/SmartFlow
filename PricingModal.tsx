'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: (plan: string) => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for standard architecture.',
    features: ['8 Tasks per workflow', 'Basic AI tips', 'Community support'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'Neural augmentation for winners.',
    features: ['Unlimited tasks', 'Cog Deepsync AI', 'Advanced Analytics', 'Priority neural links'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$29',
    description: 'For high-performance teams.',
    features: ['Everything in Pro', 'Unlimited neural seats', 'VIP Strategy coach', 'Beta access to focus protocols'],
  }
];

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-[48px] shadow-3xl overflow-hidden flex flex-col p-12"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-2">UPGRADE PROTOCOL</h2>
                <p className="text-slate-500 text-sm">Select the augmentation level for your productivity engine.</p>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 text-slate-500 transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, idx) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-8 rounded-[40px] border flex flex-col relative group transition-all",
                    plan.popular 
                      ? "bg-white/5 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.1)]" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/20"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                      most requested
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{plan.name}</h3>
                    <p className="text-slate-500 text-xs mb-6 h-8">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white tracking-tighter">{plan.price}</span>
                      <span className="text-slate-500 text-xs">/month</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-10">
                    {plan.features.map(feat => (
                      <div key={feat} className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                        <div className="shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        {feat}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => !plan.current && onUpgrade && onUpgrade(plan.name.toLowerCase())}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                      plan.current 
                        ? "bg-white/5 text-slate-500 cursor-default border border-white/5" 
                        : plan.popular 
                          ? "bg-white text-slate-950 hover:bg-slate-200 shadow-xl shadow-white/5"
                          : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {plan.current ? 'Current Plan' : 'Select Plan'}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><Shield className="w-3 h-3" /> Encrypted Transaction</div>
              <div className="flex items-center gap-2"><Rocket className="w-3 h-3" /> Instant Deployment</div>
              <div className="flex items-center gap-2"><Zap className="w-3 h-3" /> 14-Day Velocity Trial</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
