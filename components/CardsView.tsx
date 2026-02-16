
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Eye, EyeOff, Lock, Unlock, Zap, Plus, Smartphone, Globe, Landmark, AlertTriangle, Settings2 } from 'lucide-react';
import { VIRTUAL_CARDS } from '../constants';

const CardsView: React.FC = () => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cards, setCards] = useState(VIRTUAL_CARDS.map(c => ({
    ...c,
    limit: 10000,
    spent: Math.floor(Math.random() * 8000)
  })));

  const activeCard = cards[activeCardIndex];

  const toggleFreeze = () => {
    setCards(prev => prev.map((c, i) => 
      i === activeCardIndex 
        ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' }
        : c
    ));
  };

  const adjustLimit = (amount: number) => {
    setCards(prev => prev.map((c, i) => 
      i === activeCardIndex 
        ? { ...c, limit: Math.max(c.spent, c.limit + amount) }
        : c
    ));
  };

  const spentPercentage = (activeCard.spent / activeCard.limit) * 100;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight">Current Cards</h2>
          <p className="text-gray-500">Instant issuance virtual cards for global spending.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#00F0FF] text-[#0A0E17] rounded-2xl text-sm font-bold hover:bg-[#00D0EE] transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Plus size={18} /> New Virtual Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Card Display */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-8 overflow-x-auto pb-8 snap-x no-scrollbar">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: activeCardIndex === index ? 1 : 0.95,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => setActiveCardIndex(index)}
                className={`snap-center flex-shrink-0 w-[400px] h-[250px] rounded-[32px] p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group border-2 transition-all ${
                  activeCardIndex === index ? 'border-[#00F0FF]/50 ring-4 ring-[#00F0FF]/10' : 'border-transparent'
                } ${
                  card.color === 'cyan' ? 'bg-gradient-to-br from-[#00F0FF] to-blue-700' :
                  card.color === 'green' ? 'bg-gradient-to-br from-[#39FF14] to-emerald-800' :
                  'bg-gradient-to-br from-[#1A1F26] to-[#0A0E17]'
                }`}
              >
                {/* Frozen Overlay */}
                <AnimatePresence>
                  {card.status === 'Frozen' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-[#0A0E17]/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2"
                    >
                      <Lock size={48} className="text-white drop-shadow-lg" />
                      <span className="text-white font-bold tracking-widest text-sm uppercase">Card Frozen</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Visual Glass Accents */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col justify-between h-full w-full relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                         <Zap size={24} className={card.color === 'midnight' ? 'text-[#00F0FF]' : 'text-white'} />
                      </div>
                      <span className="font-bold tracking-tighter text-2xl text-white">CURRENT</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest leading-none mb-1">{card.type}</span>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">PLATINUM ACCESS</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-4 text-3xl font-mono font-bold tracking-widest items-center text-white drop-shadow-lg">
                      {showSensitive ? '4421 8842 9012' : '•••• •••• ••••'} 
                      <span className="text-2xl">{card.last4}</span>
                    </div>
                    <div className="flex gap-8 text-[11px] font-mono uppercase opacity-70 tracking-widest text-white">
                      <div>EXP: {card.expiry}</div>
                      <div>CVV: {showSensitive ? '221' : '•••'}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Spending Power</span>
                      <span className="text-2xl font-bold font-mono text-white">R {(card.limit - card.spent).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className={`flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10`}>
                        <div className={`w-2 h-2 rounded-full ${card.status === 'Active' ? 'bg-[#39FF14]' : 'bg-red-500'} shadow-[0_0_8px_currentColor]`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{card.status}</span>
                      </div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-8 object-contain opacity-80" alt="Mastercard" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button 
              onClick={() => setShowSensitive(!showSensitive)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#00F0FF] transition-colors bg-white/5 px-6 py-3 rounded-2xl border border-white/5"
            >
              {showSensitive ? <EyeOff size={18} /> : <Eye size={18} />}
              {showSensitive ? 'Hide Details' : 'View Card Details'}
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <button 
              onClick={toggleFreeze}
              className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl border transition-all ${
                activeCard.status === 'Active' 
                  ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/20'
              }`}
            >
              {activeCard.status === 'Active' ? <Lock size={18} /> : <Unlock size={18} />}
              {activeCard.status === 'Active' ? 'Freeze Card' : 'Unfreeze Card'}
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
              <Settings2 size={18} /> PIN Settings
            </button>
          </div>
        </div>

        {/* Right: Security & Limits */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#101620]/50 border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F0FF] to-transparent" />
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#39FF14]" />
              Card Security
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Online Spending', active: true, icon: Globe },
                { label: 'ATM Access', active: false, icon: Landmark },
                { label: 'Tap & Pay', active: true, icon: Smartphone },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between p-4 bg-[#0A0E17]/50 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <setting.icon size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-300">{setting.label}</span>
                  </div>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all relative ${setting.active ? 'bg-[#39FF14]' : 'bg-gray-700'}`}
                  >
                    <motion.div 
                      animate={{ x: setting.active ? 24 : 0 }}
                      className={`w-4 h-4 bg-white rounded-full shadow-lg`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex justify-between items-end">
                 <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Monthly Spending Limit</p>
                    <p className="text-xl font-bold font-mono text-white">R {activeCard.spent.toLocaleString()} <span className="text-gray-500 text-sm">/ R {activeCard.limit.toLocaleString()}</span></p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => adjustLimit(-1000)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => adjustLimit(1000)}
                      className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] hover:bg-[#00F0FF]/20"
                    >
                      +
                    </button>
                 </div>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, spentPercentage)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${spentPercentage > 90 ? 'from-red-500 to-orange-500' : 'from-[#00F0FF] to-[#39FF14]'} shadow-[0_0_15px_rgba(0,240,255,0.4)]`} 
                />
              </div>
              {spentPercentage > 90 && (
                <p className="text-[10px] text-orange-400 flex items-center gap-1 font-bold uppercase tracking-widest">
                  <AlertTriangle size={12} /> Near Spending Limit
                </p>
              )}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl space-y-3">
             <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Globe size={16} /> Global Acceptance
             </div>
             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Your Current Mastercard is active for international use. No foreign exchange markups applied to ZAR-based transactions.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsView;
