
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, Landmark, ArrowLeft, Cpu, Activity, Zap } from 'lucide-react';

interface ProtocolViewProps {
  onBack: () => void;
}

const ProtocolView: React.FC<ProtocolViewProps> = ({ onBack }) => {
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
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">The <span className="text-[#FF00E5]">Settlement</span> Engine.</h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          The Current Protocol V3.0 is a proprietary liquidity layer that synchronizes decentralized state with traditional financial ledger systems.
        </p>
      </div>

      <section className="p-12 bg-[#101620]/50 border border-white/5 rounded-[48px] space-y-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-[#FF00E5]/10 rounded-xl flex items-center justify-center text-[#FF00E5]">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-2xl font-bold">Liquidity Routing</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              When you bridge ETH or BTC, the protocol routes the request through a network of liquidity providers who lock ZAR in exchange for the decentralized asset, ensuring immediate local credit.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-[#00F0FF]">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold">Instant EFT Rails</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our direct integration with South African banking nodes allows us to initiate "Instant EFT" payments from our internal ZAR pool directly to your verified bank account.
            </p>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5">
           <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold mb-6">Settlement Cycles</h4>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Card Spend', time: 'Sub-second', status: 'Immediate' },
                { label: 'ZAR Withdrawal', time: '< 2 Minutes', status: 'Standard' },
                { label: 'Institutional OTC', time: '15 Minutes', status: 'Priority' },
              ].map((cycle, i) => (
                <div key={i} className="p-6 bg-[#0A0E17] border border-white/5 rounded-2xl space-y-1">
                  <p className="text-xs text-gray-400">{cycle.label}</p>
                  <p className="text-lg font-bold font-mono text-white">{cycle.time}</p>
                  <p className="text-[10px] text-[#39FF14] font-mono uppercase font-bold tracking-widest">{cycle.status}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-[#FF00E5]/10 to-transparent p-10 rounded-[40px] border border-[#FF00E5]/20">
         <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#FF00E5]" />
            <h3 className="text-xl font-bold">Cross-Chain Consensus</h3>
         </div>
         <p className="text-sm text-gray-400 leading-relaxed mb-6">
           Current utilizes an optimistic settlement model for incoming assets. We provide ZAR credit after the first network confirmation, backed by the protocol's insurance fund, providing the fastest bridging experience in the market.
         </p>
         <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-500 uppercase tracking-widest">BTC (1 Conf)</span>
            <span className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-500 uppercase tracking-widest">ETH (12 Confs)</span>
            <span className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-500 uppercase tracking-widest">SOL (Instant)</span>
         </div>
      </div>
    </div>
  );
};

export default ProtocolView;
