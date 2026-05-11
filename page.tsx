'use client';

import { useFirebase } from '../context/FirebaseContext';
import { Auth } from '../components/Auth';
import { Loading } from '../components/Loading';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const { user, loading, error } = useFirebase();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
        <div className="max-w-md w-full glass p-8 rounded-[32px] border-red-500/20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-2 uppercase tracking-tighter">Neural Link Error</h2>
          <p className="text-slate-400 text-sm mb-6 font-medium">
            We encountered a disruption in the secure data handshake.
          </p>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-[10px] font-mono text-red-400 break-all leading-tight">
              {error}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Attempt Resync
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (!user) return <Auth />;

  return <Dashboard />;
}
