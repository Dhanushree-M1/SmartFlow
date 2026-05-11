'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Zap, LogIn } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Auth() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20">
          <Zap className="text-white w-8 h-8 fill-current" />
        </div>
        
        <h1 className="text-4xl font-display font-black text-white mb-3 tracking-tighter">SMARTFLOW</h1>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
          Step into the future of productivity. <br /> 
          Neural architecture for the next-gen performer.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full py-4 px-6 bg-white text-slate-950 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 group"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          CONTINUE WITH GOOGLE
        </button>

        <div className="mt-12 pt-8 border-t border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Secure Neural Handshake via Firebase Auth 3.0
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-3xl rotate-45 opacity-20" />
      <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rounded-[40px] -rotate-12 opacity-20" />
    </div>
  );
}
