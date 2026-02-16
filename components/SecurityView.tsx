
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Cpu, Lock, Server, ArrowLeft, Fingerprint, Activity } from 'lucide-react';

interface SecurityViewProps {
  onBack: () => void;
}

const SecurityView: React.FC<SecurityViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Return to Terminal
      </motion.button>

      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Infrastructure <span className="text-[#39FF14]">Hardening.</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          Security isn't a feature—it's the foundation. Current utilizes military-grade cryptographic primitives to protect the bridge at every layer.
        </p>
      </div>

      <div className="relative p-1 bg-gradient-to-r from-[#00F0FF] via-[#39FF14] to-[#00F0FF] rounded-[40px] overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 blur-xl group-hover:opacity-100 transition-opacity opacity-50" />
        <div className="relative bg-[#0A0E17] rounded-[39px] p-12 space-y-10">
          <div className="flex items-center gap-4 border-b border-white/5 pb-8">
            <div className="w-16 h-16 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center text-[#39FF14]">
               <Cpu size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">The Secure Enclave</h3>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Hardware-Level Protection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="font-bold flex items-center gap-2"><Fingerprint size={18} className="text-[#00F0FF]" /> Biometric Signing</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Transactions on the bridge are never signed by a single persistent key. Instead, they require a 2-of-3 MPC fragment release triggered by your device's hardware-backed biometric authentication.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold flex items-center gap-2"><Lock size={18} className="text-[#39FF14]" /> Threshold Cryptography</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                By splitting keys using Shamir's Secret Sharing (SSS), Current ensures that even a total compromise of our central infrastructure would yield no usable private keys.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Server, title: 'Edge Redundancy', value: '1,024 Nodes' },
          { icon: Activity, title: 'Network Uptime', value: '99.999%' },
          { icon: ShieldAlert, title: 'Threat Response', value: '< 200ms' },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-[#101620]/50 border border-white/5 rounded-3xl flex flex-col items-center text-center space-y-4">
            <stat.icon size={24} className="text-[#00F0FF]" />
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.title}</p>
              <p className="text-xl font-bold font-mono">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityView;
