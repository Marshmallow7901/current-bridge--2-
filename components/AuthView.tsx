
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Fingerprint, Cpu, Server, Activity } from 'lucide-react';

interface AuthViewProps {
  onLogin: (email: string, isNew?: boolean) => void;
  onBack: () => void;
  isLoading: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onBack, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [authStep, setAuthStep] = useState<'input' | 'signing'>('input');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setAuthStep('signing');
      // Simulated MPC delay
      setTimeout(() => {
        onLogin(email, mode === 'register');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center relative">
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#39FF14]/5 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {authStep === 'input' ? (
          <motion.div 
            key="auth-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#101620]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative"
          >
            <button 
              onClick={onBack}
              className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center mb-10 space-y-3">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#00F0FF] to-[#39FF14] rounded-2xl mx-auto flex items-center justify-center mb-6">
                <Fingerprint className="text-[#0A0E17]" size={32} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {mode === 'login' ? 'Terminal Auth' : 'Identity Registry'}
              </h2>
              <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">MPC Sovereign Access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Ledger Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00F0FF] transition-colors" size={18} />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#00F0FF]/50 transition-all font-medium text-white placeholder-gray-700"
                    placeholder="id@current.finance"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Terminal Passkey</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00F0FF] transition-colors" size={18} />
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#00F0FF]/50 transition-all font-medium text-white placeholder-gray-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:shadow-[0_0_50px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {mode === 'login' ? 'Authorize via Nodes' : 'Register Identity'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-500 text-xs">
                {mode === 'login' ? "Registry entry missing?" : "Known identity?"} 
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-[#00F0FF] font-bold hover:underline"
                >
                  {mode === 'login' ? 'Register Fragment' : 'Authorize Now'}
                </button>
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <ShieldCheck size={12} className="text-[#39FF14]" />
                AES-256 Ledger Encryption
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="signing-animation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#101620]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 text-center space-y-8 overflow-hidden"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-b-2 border-[#00F0FF] rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-t-2 border-[#39FF14] rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu size={40} className="text-[#00F0FF] animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Assembling Shards</h3>
              <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">Requesting 2-of-3 Node Signature...</p>
            </div>

            <div className="space-y-3">
               {[
                 { label: 'Global Node A (London)', active: true },
                 { label: 'Global Node B (Cape Town)', active: true },
                 { label: 'Local Shard (User Device)', active: false },
               ].map((node, i) => (
                 <motion.div 
                   key={i}
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: i * 0.5 }}
                   className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5"
                 >
                   <div className="flex items-center gap-2">
                     <Server size={14} className={node.active ? 'text-[#39FF14]' : 'text-gray-600'} />
                     <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">{node.label}</span>
                   </div>
                   <Activity size={12} className={node.active ? 'text-[#39FF14] animate-pulse' : 'text-gray-700'} />
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthView;
