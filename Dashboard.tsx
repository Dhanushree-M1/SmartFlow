'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, CheckCircle2, Calendar, Focus as FocusIcon, BarChart3, Target, StickyNote, Settings, Plus, Zap, Activity } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { RightPanel } from './RightPanel';
import { StatCard } from './StatCard';
import { Timeline } from './Timeline';
import { PricingModal } from './PricingModal';
import { TaskModal } from './TaskModal';
import { PaymentModal } from './PaymentModal';
import { Chatbot } from './Chatbot';
import { GoalPlanner } from './GoalPlanner';
import { HabitTracker } from './HabitTracker';
import { Analytics } from './Analytics';
import { Notes } from './Notes';
import { useFirebase } from '../context/FirebaseContext';
import { getCoachInsight } from '../lib/coach';
import { doc, updateDoc, deleteDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const mockChartData = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 35 }, { value: 60 }, { value: 55 }
];

export function Dashboard() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { userData, tasks, insights, notifications } = useFirebase();
  const [currentInsight, setCurrentInsight] = useState<any>(null);

  useEffect(() => {
    if (insights.length > 0) {
      setCurrentInsight(insights[0]);
    }
  }, [insights]);

  const handleCoachRequest = async () => {
    const insight = await getCoachInsight(tasks, userData);
    if (insight) {
      setCurrentInsight(insight);
      if (userData) {
        try {
          await addDoc(collection(db, 'notifications'), {
            title: 'Neural Insight Generated',
            content: insight.content,
            type: 'insight',
            read: false,
            userId: userData.userId,
            createdAt: serverTimestamp()
          });
        } catch (e) { console.error(e); }
      }
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (!userData) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: plan === 'pro' ? 1200 : 2900, // Amount in paise
      currency: "USD",
      name: "SmartFlow",
      description: `Upgrade to ${plan.toUpperCase()} protocol`,
      image: "https://picsum.photos/200",
      handler: async function (response: any) {
        try {
          // In a production app, you would verify the payment signature on the server here.
          // For this demo, we'll directly update the user's plan in Firestore.
          await updateDoc(doc(db, 'users', userData.userId), {
            plan: plan,
            subscriptionTier: plan,
            updatedAt: serverTimestamp()
          });

          await addDoc(collection(db, 'notifications'), {
            title: 'Protocol Augmented',
            content: `Your account has been successfully upgraded to the ${plan.toUpperCase()} tier.`,
            type: 'system',
            read: false,
            userId: userData.userId,
            createdAt: serverTimestamp()
          });

          setIsPricingOpen(false);
          alert(`Success! Payment ID: ${response.razorpay_payment_id}`);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${userData.userId}`);
        }
      },
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      theme: {
        color: "#3b82f6",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <header className="flex flex-col gap-2">
              <h1 className="text-5xl font-display font-light tracking-tighter text-white leading-none">
                HELLO, <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-500">{userData?.name?.split(' ')[0] || 'Architect'} 👋</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.1em]">
                Your cognitive peak is expected between 10:00 AM and 1:30 PM today.
              </p>
            </header>

            {currentInsight && (
              <div className="p-8 rounded-[40px] bg-gradient-to-r from-blue-600/[0.08] via-emerald-500/[0.08] to-transparent border border-white/[0.08] relative overflow-hidden group shadow-2xl">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-[24px] bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.25)] border border-blue-500/20">
                    <Zap className="w-7 h-7 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">AI PRO COACH</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-black border border-blue-500/20 uppercase tracking-tighter">
                         SYSTEM {currentInsight.type?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-white leading-relaxed italic">
                      " {currentInsight.content} "
                    </p>
                  </div>
                  <button 
                    onClick={handleCoachRequest}
                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                  >
                    REGEN
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-full bg-[radial-gradient(ellipse_at_right,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Protocol" value={tasks.filter(t => !t.completed).length.toString()} change="+2 active" icon={CheckCircle2} color="blue" data={mockChartData} />
              <StatCard title="Velocity" value="92" change="+12%" icon={Activity} color="emerald" data={mockChartData.map(d => ({ value: d.value * 0.8 }))} />
              <StatCard title="Focus Depth" value="4.2h" change="Peak reach" icon={FocusIcon} color="purple" data={mockChartData.map(d => ({ value: d.value * 1.2 }))} />
              <StatCard title="Streak" value="14d" change="Hot streak" icon={Zap} color="orange" data={mockChartData.map(d => ({ value: d.value * 1.05 }))} />
            </div>

            <div className="grid grid-cols-1 gap-12">
              <Timeline 
                tasks={tasks.slice(0, 5)} 
                onToggle={handleTaskToggle}
                onDelete={handleTaskDelete}
              />
            </div>
          </div>
        );
      case 'goals':
        return <GoalPlanner />;
      case 'habits':
        return <HabitTracker />;
      case 'analytics':
        return <Analytics />;
      case 'notes':
        return <Notes />;
      case 'my-tasks':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-display font-black text-white tracking-tighter uppercase">Global Stack</h1>
                <p className="text-slate-500 text-sm font-medium">Execute your architectural roadmap units.</p>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
                CREATE PROTOCOL
              </button>
            </header>
            <Timeline tasks={tasks} onToggle={handleTaskToggle} onDelete={handleTaskDelete} />
          </div>
        );
      case 'focus-mode':
        return (
          <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center space-y-16 animate-in zoom-in duration-1000">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full animate-pulse group-hover:bg-blue-500/30 transition-all" />
              <div className="relative w-80 h-80 rounded-full border border-white/5 bg-slate-950/20 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-blue-500/30 shadow-2xl">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mb-6 opacity-60">Focus Engine</span>
                <span className="text-8xl font-display font-light text-white tracking-tighter tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "mt-10 px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5",
                    isActive ? "bg-white/10 text-white border border-white/10" : "bg-white text-slate-950"
                  )}
                >
                  {isActive ? 'PAUSE SYNC' : 'INITIALIZE'}
                </button>
              </div>
            </div>
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Deep Work Protocol</h2>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">Neural noise reduction active. Productivity AI is monitoring cognitive velocity. Locked to 25-minute architectural standard.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl space-y-12 animate-in slide-in-from-left-4 duration-700">
            <header>
              <h1 className="text-4xl font-display font-black text-white tracking-tighter uppercase">Neural Configuration</h1>
              <p className="text-slate-500 text-sm font-medium">Calibrate your personal workspace protocols.</p>
            </header>
            
            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[32px] bg-slate-800 border-2 border-blue-500/20 p-1 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/${userData?.userId}/200/200`} alt="Profile" className="w-full h-full object-cover rounded-[28px]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white mb-1 uppercase tracking-tighter">{userData?.name}</p>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{userData?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Workspace Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => setIsPaymentOpen(true)} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                    <span className="text-sm font-bold text-white uppercase tracking-tight">Sync Payment Node</span>
                    <Settings className="w-4 h-4 text-slate-600" />
                  </button>
                  <button onClick={() => setIsPricingOpen(true)} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                    <span className="text-sm font-bold text-white uppercase tracking-tight">Upgrade Protocol Capacity</span>
                    <Zap className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
              <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Module Not Found</h2>
            <p className="text-slate-500 text-sm">Target sector is currently offline or under maintenance.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex text-slate-200 bg-[#020617] bg-velocity">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 pl-64 pr-[300px] transition-all relative flex flex-col min-h-screen">
        <Topbar onUpgradeClick={() => setIsPricingOpen(true)} onAddClick={() => setIsTaskModalOpen(true)} />
        
        <div className="p-10 space-y-10 flex-1 max-w-7xl mx-auto w-full">
          {renderView()}
        </div>

        <div className="fixed bottom-0 left-64 right-[300px] h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-30" />
      </main>

      <RightPanel />

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} onUpgrade={handleUpgrade} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
      <Chatbot />
    </div>
  );
}
