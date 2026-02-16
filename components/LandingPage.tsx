
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Zap, Globe, CreditCard, Landmark, 
  ChevronRight, Share2, Wallet, LayoutDashboard, Quote, 
  Lock, Server, RefreshCw, Cpu, Activity 
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  onShowWhitepaper: () => void;
  onNavigate: (target: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onShowWhitepaper, onNavigate }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as const 
      } 
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E17] overflow-x-hidden selection:bg-[#00F0FF]/30 scroll-smooth">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#39FF14]/5 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-[#00F0FF]/3 rounded-full blur-[80px]" />
      </div>

      {/* Live Market Marquee */}
      <div className="fixed top-20 left-0 right-0 z-40 h-8 bg-[#00F0FF]/5 backdrop-blur-md border-y border-white/5 flex items-center overflow-hidden pointer-events-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-4">
          {[
            { pair: 'BTC/ZAR', price: '1,750,420', up: true },
            { pair: 'ETH/ZAR', price: '52,450', up: true },
            { pair: 'SOL/ZAR', price: '2,850', up: false },
            { pair: 'USDC/ZAR', price: '18.85', up: true },
            { pair: 'CURR/ZAR', price: '24.50', up: true },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold">
              <span className="text-gray-500">{stat.pair}</span>
              <span className="text-white">{stat.price}</span>
              <span className={stat.up ? 'text-[#39FF14]' : 'text-red-500'}>
                {stat.up ? '▲' : '▼'}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            { pair: 'BTC/ZAR', price: '1,750,420', up: true },
            { pair: 'ETH/ZAR', price: '52,450', up: true },
            { pair: 'SOL/ZAR', price: '2,850', up: false },
            { pair: 'USDC/ZAR', price: '18.85', up: true },
            { pair: 'CURR/ZAR', price: '24.50', up: true },
          ].map((stat, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold">
              <span className="text-gray-500">{stat.pair}</span>
              <span className="text-white">{stat.price}</span>
              <span className={stat.up ? 'text-[#39FF14]' : 'text-red-500'}>
                {stat.up ? '▲' : '▼'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-56 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 px-4 py-1.5 rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/5 backdrop-blur-md flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
          <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-[0.3em] font-bold">V3.0 Sovereign Auth Protocol</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#39FF14]">Liquid Finance.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          Inspired by Satoshi’s vision of decentralization, Current bridges the gap between sovereign assets and real-world liquidity. Built for the era of trustless banking.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <button 
            onClick={onEnter}
            className="group px-10 py-5 bg-[#00F0FF] text-[#0A0E17] font-bold text-lg rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all active:scale-95"
          >
            Access Terminal <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          <button 
            onClick={onShowWhitepaper}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all"
          >
            Read Protocol
          </button>
        </motion.div>
      </section>

      {/* Satoshi Quote Callout */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[#00F0FF] to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6 pt-12"
        >
          <Quote className="mx-auto text-[#00F0FF]/40 mb-4" size={40} />
          <p className="text-2xl md:text-3xl font-serif italic text-gray-300 leading-relaxed">
            "A peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."
          </p>
          <p className="text-xs font-mono text-[#00F0FF] uppercase tracking-[0.4em] font-bold">— Satoshi Nakamoto, 2008</p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-[0.4em] font-bold">Terminal Features</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Institutional Rails. <br /> Consumer Ease.</h3>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: 'Virtual Card Issuance',
              desc: 'Issue Mastercard virtual cards instantly. Spend your bridged ZAR anywhere online with zero FX markups.',
              icon: CreditCard,
              color: '#00F0FF'
            },
            {
              title: 'Bridge Terminal',
              desc: 'Convert ETH, BTC, or SOL to Rand in under 2 seconds. Direct settlement to internal spending accounts.',
              icon: RefreshCw,
              color: '#39FF14'
            },
            {
              title: 'Bill Automation',
              desc: 'Pay electricity, tuition, and utilities directly from your ZAR bridge wallet without withdrawing to a legacy bank.',
              icon: Zap,
              color: '#FF00E5'
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={item}
              className="group p-10 bg-[#101620]/50 border border-white/5 rounded-[40px] hover:border-white/10 transition-all relative overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity" 
                style={{ backgroundColor: feature.color }}
              />
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <feature.icon size={28} style={{ color: feature.color }} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Security Section (#security) */}
      <section id="security" className="py-32 px-6 bg-[#0D121F]/50 backdrop-blur-sm border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-[10px] font-mono font-bold uppercase tracking-[0.4em]">
              <Lock size={12} /> Military Grade Security
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Vault-Grade <br /><span className="text-[#00F0FF]">MPC Infrastructure.</span></h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              We never store your full private keys. By utilizing Multi-Party Computation (MPC), we split authorization across three geographically distinct nodes to ensure your assets remain untouchable.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('security')}
                className="px-6 py-3 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                Deep Dive <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#00F0FF]/10 blur-[100px] rounded-full" />
            <div className="relative bg-[#101620] border border-white/10 rounded-[48px] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} className="text-[#00F0FF]" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">Vault Status</p>
                    <p className="text-white font-bold">100% SECURE</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-mono font-bold">STABLE</div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#39FF14]" 
                  />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                  <span>MPC Fragmentation Complete</span>
                  <span>85% Nodes Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protocol / About Section (#about) */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-[10px] font-mono text-[#FF00E5] uppercase tracking-[0.4em] font-bold">The Protocol</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">A Bridge Built for <br /> <span className="text-[#FF00E5]">Sovereign Wealth.</span></h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Legally compliant and technically superior, Current Protocol automates the conversion and credit-assignment of crypto assets to South African bank accounts.
            </p>
            <button 
              onClick={() => onNavigate('protocol')}
              className="flex items-center gap-2 text-[#FF00E5] font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all"
            >
              Examine the architecture <ArrowRight size={14} />
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { 
                step: '01', 
                title: 'MPC Generation', 
                desc: 'Every account is assigned a unique Multi-Party Computation wallet fragment.',
                color: '#00F0FF' 
              },
              { 
                step: '02', 
                title: 'Instant Validation', 
                desc: 'Current nodes verify incoming on-chain transactions across BTC, ETH, and SOL in real-time.',
                color: '#39FF14' 
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.04] transition-all"
              >
                <div className="text-3xl font-mono font-bold" style={{ color: step.color }}>{step.step}</div>
                <h4 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#101620] to-[#0A0E17] border border-white/10 rounded-[60px] p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#00F0FF]/5 blur-[100px] opacity-30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Establish your identity.</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Current is restricted to verified individuals and businesses. No dummy accounts, no anonymous transfers. Only pure financial utility.
            </p>
            <button 
              onClick={onEnter}
              className="px-12 py-6 bg-white text-[#0A0E17] font-bold text-xl rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-3 mx-auto shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Enter Terminal <LayoutDashboard size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Custom Styles for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
