'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';
import { getChatResponse } from '../lib/coach';
import { db } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Neural link established. I am SmartFlow Core. How can I optimize your trajectory today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useFirebase();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      chatHistory.push({ role: 'user', content: input });

      const response = await getChatResponse(chatHistory, userData);

      // Handle Function Calls
      if (response.functionCall?.name === 'create_task') {
        const args = response.functionCall.args;
        try {
          await addDoc(collection(db, 'tasks'), {
            ...args,
            userId: userData.userId,
            completed: false,
            createdAt: serverTimestamp(),
            isAiGenerated: true
          });
          
          await addDoc(collection(db, 'notifications'), {
            title: 'Neural Task Synced',
            content: `AI has successfully scheduled: ${args.title}. Trajectory updated.`,
            type: 'task',
            read: false,
            userId: userData.userId,
            createdAt: serverTimestamp(),
          });
        } catch (dbError) {
          console.error("Failed to sync neural task to database:", dbError);
        }
      }

      // Simple heuristic if getChatResponse catches internally but returns an error string
      const isResponseError = response.text.includes("disruption detected") || response.text.includes("offline");

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        isError: isResponseError
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot: Neural link failure:", error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "CRITICAL ERROR: Neural signal lost. System integrity compromised. Please re-initialize chat.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full bg-purple-600 text-white shadow-2xl flex items-center justify-center group overflow-hidden transition-all",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-8 h-8 relative z-10" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '600px',
              width: isMinimized ? '300px' : '400px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[110] bg-[#020617]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-3xl overflow-hidden flex flex-col transition-all duration-500"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-widest uppercase">SmartFlow Core</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Neural Link</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
                >
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                        m.role === 'user' 
                          ? "bg-white/10 text-white" 
                          : m.isError 
                            ? "bg-pink-500/20 text-pink-500" 
                            : "bg-purple-500/10 text-purple-400"
                      )}>
                        {m.role === 'user' ? <User className="w-4 h-4" /> : m.isError ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-purple-600 text-white rounded-tr-none" 
                          : m.isError
                            ? "bg-pink-500/10 border border-pink-500/20 text-pink-200 rounded-tl-none font-bold"
                            : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none"
                      )}>
                        {m.content}
                        <div className={cn(
                          "text-[8px] font-black uppercase mt-2 opacity-40",
                          m.role === 'user' ? "text-right" : "text-left"
                        )}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-1 items-center h-10">
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-bounce" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Transmit Command..."
                      className="w-full h-12 bg-[#020617] border border-white/10 rounded-2xl pl-5 pr-12 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 disabled:opacity-50 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.2em] mt-3">
                    Neural Processor: Gemini 2.0 Flash
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
