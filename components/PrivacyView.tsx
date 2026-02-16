
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, EyeOff, Lock, Globe, ArrowLeft, Database, UserCheck } from 'lucide-react';

interface PrivacyViewProps {
  onBack: () => void;
}

const PrivacyView: React.FC<PrivacyViewProps> = ({ onBack }) => {
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
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Data <span className="text-[#00F0FF]">Sovereignty</span> Protocol.</h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          At Current, we believe financial privacy is a fundamental human right. Our architecture is designed to minimize data footprint while maximizing security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: EyeOff,
            title: 'Zero-Knowledge Proofs',
            desc: 'We verify your eligibility without ever storing the underlying raw document data on our primary servers.'
          },
          {
            icon: Lock,
            title: 'Non-Custodial Data',
            desc: 'Identity fragments are encrypted and stored across a decentralized MPC network. No single party holds your full profile.'
          },
          {
            icon: Database,
            title: 'Sovereign Audits',
            desc: 'Request a full cryptographic audit of your data footprint at any time via the Security Terminal.'
          },
          {
            icon: UserCheck,
            title: 'GDPR & POPIA Ready',
            desc: 'Fully compliant with South African POPIA and global GDPR standards for cross-border asset bridging.'
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-[#101620]/50 border border-white/5 rounded-[32px] space-y-4"
          >
            <item.icon size={24} className="text-[#00F0FF]" />
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="space-y-8 pt-10 border-t border-white/5">
        <h2 className="text-2xl font-bold">Operational Transparency</h2>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
          <p>
            Current Protocol collects "Telemetry Data" solely for the purpose of ensuring transaction finality and preventing network congestion. This includes device identifiers and approximate geolocation to satisfy South African anti-money laundering (AML) regulations.
          </p>
          <p>
            We do not share, sell, or trade your financial history with third-party marketing entities. Your data exists only within the encrypted enclave of the Current Bridge for as long as your account remains active.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyView;
