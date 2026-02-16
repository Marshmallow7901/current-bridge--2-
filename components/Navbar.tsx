
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, CreditCard, LogOut, ChevronDown, ShieldCheck, Home, LayoutDashboard, User, Settings, Database, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
  onDisconnect: () => void;
  onToggleLanding: () => void;
  onNavigate: (target: string) => void;
  isLandingMode: boolean;
  dbStatus?: 'connected' | 'syncing' | 'error';
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, setActiveTab, isConnected, onDisconnect, onToggleLanding, 
  onNavigate, isLandingMode, dbStatus = 'connected' 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const tabs = ['Swap', 'Assets', 'Cards', 'Payments', 'Activity', 'Settings'];

  const handleNavClick = (target: string) => {
    if (isLandingMode) {
      const el = document.getElementById(target.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate(target.replace('#', ''));
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto h-16 bg-[#101620]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('Swap'); onNavigate('landing'); }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00F0FF] to-[#39FF14] flex items-center justify-center">
              <div className="w-4 h-4 bg-[#0A0E17] rounded-sm transform rotate-45" />
            </div>
            <span className="font-bold tracking-tighter text-xl text-white">CURRENT</span>
          </div>
          
          {/* DB Status Badge */}
          {!isLandingMode && isConnected && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              {dbStatus === 'syncing' ? (
                <RefreshCw size={10} className="text-amber-400 animate-spin" />
              ) : (
                <Database size={10} className="text-[#39FF14]" />
              )}
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                {dbStatus === 'syncing' ? 'Syncing Ledger' : 'Ledger Connected'}
              </span>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {isLandingMode ? (
            <div className="flex gap-8">
              <button onClick={() => handleNavClick('#features')} className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Features</button>
              <button onClick={() => onNavigate('security')} className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Security</button>
              <button onClick={() => onNavigate('protocol')} className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Protocol</button>
            </div>
          ) : (
            isConnected && tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); onNavigate('dashboard'); }}
                className={`relative text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab ? 'text-[#00F0FF]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleLanding}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {isLandingMode ? <LayoutDashboard size={14} /> : <Home size={14} />}
            {isLandingMode ? 'Dashboard' : 'Terminal Home'}
          </button>

          {isConnected ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="text-xs font-mono text-gray-300">Auth Active</span>
                <ChevronDown size={14} className={`text-gray-500 group-hover:text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-[#101620] border border-white/10 rounded-2xl shadow-2xl p-2 z-[60] backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">Authenticated ID</p>
                      <p className="text-xs font-bold flex items-center gap-2 truncate">
                        <ShieldCheck size={14} className="text-[#39FF14]" /> Multi-Node Verified
                      </p>
                    </div>
                    <button 
                      onClick={() => { setActiveTab('Assets'); onNavigate('dashboard'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <Wallet size={16} /> Ledger Balance
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Settings'); onNavigate('dashboard'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <Settings size={16} /> Terminal Config
                    </button>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <button 
                      onClick={() => { onDisconnect(); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <LogOut size={16} /> De-authorize
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={() => onToggleLanding()}
              className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#0A0E17] text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-105 transition-transform"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
