
import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, ChevronRight, FileText, Shield, Zap, TrendingUp, Cpu, 
  Quote, Landmark, Globe, Activity, Gamepad2, Trophy, Coins,
  ZapOff, Sparkles, Repeat
} from 'lucide-react';

interface WhitepaperProps {
  onClose: () => void;
}

const Whitepaper: React.FC<WhitepaperProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0E17]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="w-full max-w-5xl h-full bg-[#101620] border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#00F0FF]/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Current Protocol V3.0</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sovereign Financial Framework</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-12 no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-24">
            
            {/* The Heritage Section: Satoshi Nakamoto */}
            <section className="space-y-8 relative">
              <div className="absolute -left-12 top-0 text-[#00F0FF]/10">
                <Quote size={80} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-[#00F0FF]">00.</span> The Heritage
                </h3>
                <p className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-[0.3em] font-bold">Inspiration: Satoshi Nakamoto</p>
              </div>
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                <p>
                  On Halloween of 2008, <span className="text-white font-bold">Satoshi Nakamoto</span> shared a vision that would fundamentally decouple wealth from the whim of centralized states. By introducing the proof-of-work consensus, Satoshi didn't just invent a digital asset; they invented <span className="text-[#00F0FF] italic">Sovereignty-as-a-Service</span>.
                </p>
                <div className="p-8 bg-[#0A0E17] border-l-4 border-[#00F0FF] rounded-r-3xl italic font-serif text-xl text-gray-300">
                  "The root problem with conventional currency is all the trust that’s required to make it work... history is full of breaches of that trust."
                </div>
                <p>
                  Current is the architectural manifestation of that 2008 Genesis Block. We recognize that while Bitcoin solved the "what" of digital cash, the "where" remained tethered to legacy banking rails. Our protocol is built to serve as the missing <strong>Settlement Layer</strong>—ensuring that the speed of Satoshi’s internet-cash matches the requirements of real-world survival.
                </p>
              </div>
            </section>

            {/* Abstract */}
            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-[#00F0FF]">01.</span> Abstract
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                The Current Protocol establishes a high-throughput liquidity bridge. By utilizing an MPC-based vault architecture, we fragments authorization across global nodes to ensure that no single entity—including Current itself—can ever compromise your bridge egress.
              </p>
            </section>

            {/* Advanced Tokenomics */}
            <section className="space-y-12 p-10 bg-gradient-to-br from-[#FF00E5]/5 to-transparent border border-[#FF00E5]/10 rounded-[40px]">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-[#FF00E5]">02.</span> $CURR Economy & Staking
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The $CURR token serves as the protocol's metabolic fuel. It utilizes a <strong>Dynamic Burn & Rebate</strong> mechanism to reward active participants and penalize ecosystem friction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#0A0E17]/60 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-[#00F0FF] font-bold uppercase tracking-widest text-xs">
                    <Repeat size={16} /> Fee-Rebate Protocol
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Innovation: Users earn back <strong>0.001 $CURR</strong> for every transaction initiated on the bridge. We don't just charge fees; we recirculate them into the hands of the sovereign users.
                  </p>
                </div>
                <div className="p-6 bg-[#0A0E17]/60 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-[#39FF14] font-bold uppercase tracking-widest text-xs">
                    <TrendingUp size={16} /> Hyper-Deflation
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    0.5% of every swap is automatically converted to $CURR and permanently removed from circulation via the <strong>Genesis Burn Address</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                <div className="space-y-6">
                  <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest font-bold">Staking Yields</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Sovereign Staker', yield: '14.2% APY', requirement: '100k $CURR' },
                      { label: 'Liquidity Miner', yield: '8.5% APY', requirement: '10k $CURR' },
                    ].map((stake, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-white">{stake.label}</span>
                        <div className="text-right">
                          <p className="text-xs font-mono text-[#39FF14]">{stake.yield}</p>
                          <p className="text-[9px] text-gray-500 font-mono uppercase">{stake.requirement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest font-bold">Future Allocation</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <Coins className="text-amber-400" size={20} />
                        <div>
                           <p className="text-xs font-bold">Transaction Rebate Pool</p>
                           <p className="text-[10px] text-gray-500">20% Reserved for Fee-Backs</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Esports & Gaming Nexus */}
            <section className="space-y-8">
               <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-[#39FF14]">03.</span> The Gaming Nexus
                </h3>
                <p className="text-[10px] font-mono text-[#39FF14] uppercase tracking-[0.3em] font-bold">Esports & Play-to-Bridge</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                 <div className="md:col-span-7 space-y-6 text-gray-400 text-lg leading-relaxed">
                    <p>
                      Current is officially expanding into the **Esports Ecosystem**. We are building direct settlement APIs for major competitive gaming platforms, allowing professional and amateur players to earn $CURR and ZAR through tournament victories.
                    </p>
                    <p>
                      In our upcoming <strong>Play-to-Bridge</strong> module, users will be able to link their gaming profiles to earn back their platform transaction fees in $CURR. We believe the future of work is play, and the future of banking is the bridge that makes that play liquid.
                    </p>
                 </div>
                 <div className="md:col-span-5 grid grid-cols-2 gap-4">
                    {[
                      { icon: Gamepad2, label: 'Instant Payouts', color: '#00F0FF' },
                      { icon: Trophy, label: 'Arena Rewards', color: '#FFD700' },
                      { icon: Zap, label: 'Ultra Low Latency', color: '#39FF14' },
                      { icon: Sparkles, label: 'Nexus NFTs', color: '#FF00E5' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                         <item.icon size={24} style={{ color: item.color }} />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">{item.label}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-gray-500">04.</span> Network Resilience
              </h3>
              <p className="text-gray-400 leading-relaxed">
                The bridge operations are secured by 1,024 geographically distributed nodes. Every request undergoes a **Consensus Handshake** before any ZAR is released.
              </p>
              <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] font-mono text-xs text-gray-500 leading-relaxed relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Globe size={40} className="text-[#00F0FF]" />
                </div>
                <code className="block whitespace-pre">
                  {`// Bridge Settlement Verification
[NEXUS] Handshake with Esports Node 42...
[CURR] Calculating 0.001 Fee Rebate...
[SETTLE] ZAR Credit Released to Sovereign Ledger
[STATUS] Hash: 0xCURR_NEXUS_8829... PASS`}
                </code>
              </div>
            </section>

            {/* Footer Call to Action */}
            <div className="py-20 text-center border-t border-white/5 space-y-8">
               <Cpu size={48} className="mx-auto text-[#00F0FF] opacity-50" />
               <div className="space-y-2">
                 <h4 className="text-2xl font-bold">Join the Sovereign Resistance</h4>
                 <p className="text-gray-500 text-sm">Experience the bridge that Satoshi would have used.</p>
               </div>
               <button className="px-8 py-4 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl flex items-center gap-2 mx-auto hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                 Establish Connection <ChevronRight size={18} />
               </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Whitepaper;
