'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Shield, Lock, Check, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { userData } = useFirebase();
  const [mode, setMode] = useState<'card' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);
    // Simulate processing
    await new Promise(r => setTimeout(r, 2000));

    try {
      if (mode === 'card') {
        await updateDoc(doc(db, 'users', userData.userId), {
          paymentMethod: {
            last4: cardNumber.slice(-4) || '4242',
            brand: 'visa',
            expiry: expiry
          },
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'users', userData.userId), {
          bankAccount: {
            last4: bankAccount.slice(-4) || '8888',
            routing: routingNumber || '123456789'
          },
          updatedAt: serverTimestamp()
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userData.userId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[48px] shadow-3xl overflow-hidden p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase">{mode === 'card' ? 'Secure Node' : 'Payout Node'}</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Neural Link Sublayer</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!success && (
              <div className="flex gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setMode('card')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    mode === 'card' ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  Link Card
                </button>
                <button 
                  onClick={() => setMode('bank')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    mode === 'bank' ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  Link Bank
                </button>
              </div>
            )}

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">SYNCED.</h3>
                <p className="text-slate-500 text-sm">Payment method linked to neural profile.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-6">
                {/* Virtual Preview */}
                <div className="w-full h-48 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Zap className="w-24 h-24 text-white fill-current" />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30" />
                    <span className="text-white/20 font-black tracking-widest text-[10px] uppercase">{mode === 'card' ? 'SmartFlow Velocity' : 'Direct Payout Protocol'}</span>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className="text-lg font-mono text-white tracking-[0.2em]">
                      {mode === 'card' 
                        ? (cardNumber || '•••• •••• •••• ••••')
                        : (bankAccount || '••••••••••••••••')
                      }
                    </p>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">{mode === 'card' ? 'Expiry' : 'Routing'}</p>
                        <p className="text-xs font-mono text-white uppercase">{mode === 'card' ? (expiry || 'MM/YY') : (routingNumber || 'SYNC-WAIT')}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Owner</p>
                        <p className="text-xs font-black text-white uppercase">{userData?.name || 'Architect'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {mode === 'card' ? (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <CreditCard className="w-4 h-4 text-slate-500" />
                        </div>
                        <input 
                          required
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          required
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                        />
                        <div className="relative">
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <Lock className="w-3 h-3 text-slate-600" />
                          </div>
                          <input 
                            required
                            type="password"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Shield className="w-4 h-4 text-slate-500" />
                        </div>
                        <input 
                          required
                          placeholder="Account Number"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Activity className="w-4 h-4 text-slate-500" />
                        </div>
                        <input 
                          required
                          placeholder="Routing Number"
                          value={routingNumber}
                          onChange={(e) => setRoutingNumber(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-5 bg-white text-slate-950 font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50 text-xs uppercase tracking-widest"
                >
                  {loading ? 'SYNCHRONIZING...' : 'INITIALIZE SYNC'}
                </button>

                <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-2">
                  <span className="flex items-center gap-2">
                    <Shield className="w-3 h-3" /> PCI-DSS COMPLIANT ARCHITECTURE
                  </span>
                  <span className="opacity-40">Secured via Razorpay & Stripe Nodes</span>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
