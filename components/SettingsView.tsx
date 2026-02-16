
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, Shield, Bell, Key, Smartphone, 
  ChevronRight, CheckCircle2, AlertTriangle, Fingerprint, Eye, EyeOff, ShieldCheck, Landmark, Database, Download, Trash2, RefreshCw, Loader2
} from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User | null;
  onUserUpdate: (user: User) => void;
  onResetData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUserUpdate, onResetData }) => {
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (user) onUserUpdate({ ...user, kycStatus: 'verified' });
      setIsVerifying(false);
    }, 2500);
  };

  const handleResync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const exportData = () => {
    const registry = JSON.parse(localStorage.getItem('current_registry') || '{}');
    const userData = registry[user?.id || ''] || {};
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `current_ledger_${user?.id}.json`;
    a.click();
  };

  const sections = [
    {
      title: 'Profile Context',
      icon: UserIcon,
      items: [
        { label: 'Display Identity', value: user?.name, type: 'text' },
        { label: 'Authorized Email', value: user?.email, type: 'text' },
        { label: 'Verification Tier', value: user?.kycStatus === 'verified' ? 'Tier 1: Sovereign' : 'Tier 0: Restricted', type: 'status' },
      ]
    },
    {
      title: 'Terminal Security',
      icon: Shield,
      items: [
        { label: 'Biometric Unlock', active: true, type: 'toggle' },
        { label: 'Two-Factor Authentication', active: true, type: 'toggle' },
        { label: 'MPC Vault Protection', active: true, type: 'toggle' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">Terminal Config</h2>
        <p className="text-gray-500 font-medium">Manage your sovereign identity and ledger parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Data Sovereign Controls */}
          <div className="bg-[#101620]/80 border border-white/10 rounded-[40px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ledger Management</h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Local Database Ingress</p>
                </div>
              </div>
              <button 
                onClick={handleResync}
                className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin text-amber-500' : 'text-gray-400'} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={exportData}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00F0FF]/30 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-[#00F0FF]" />
                  <span className="text-xs font-bold">Backup Ledger</span>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </button>
              <button 
                onClick={onResetData}
                className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-2xl hover:border-red-500/30 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400">Purge Cache</span>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </button>
            </div>
          </div>

          {sections.map((section, idx) => (
            <motion.div 
              key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="bg-[#101620]/50 border border-white/5 rounded-[32px] overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <section.icon size={20} className="text-[#00F0FF]" />
                <h3 className="font-bold text-lg uppercase tracking-wider text-sm">{section.title}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {section.items.map((item, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <div className="flex items-center gap-3">
                      {item.type === 'text' && <span className="text-sm font-bold text-white">{item.value}</span>}
                      {item.type === 'status' && (
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${user?.kycStatus === 'verified' ? 'bg-[#39FF14]/10 border-[#39FF14]/20 text-[#39FF14]' : 'bg-amber-400/10 border-amber-400/20 text-amber-400'} text-[10px] font-mono font-bold uppercase tracking-widest`}>
                            {user?.kycStatus === 'verified' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />} {item.value}
                          </div>
                          {user?.kycStatus !== 'verified' && (
                            <button 
                              onClick={handleVerify}
                              disabled={isVerifying}
                              className="px-4 py-1.5 bg-[#00F0FF] text-[#0A0E17] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                            >
                              {isVerifying ? <Loader2 size={12} className="animate-spin" /> : 'Verify Now'}
                            </button>
                          )}
                        </div>
                      )}
                      {item.type === 'toggle' && (
                        <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-all ${item.active ? 'bg-[#39FF14]' : 'bg-gray-700'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#101620] to-[#0A0E17] border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden">
            <h3 className="font-bold flex items-center gap-2">
              <Fingerprint size={18} className="text-[#39FF14]" /> Discovery Key
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Your recovery fragment is used to assemble your MPC signature.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-[#0A0E17] border border-white/5 rounded-2xl font-mono text-[10px] text-gray-500 break-all relative">
                {showKey ? user?.internalWallet : '•••• •••• •••• •••• •••• ••••'}
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00F0FF]"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                Export Encrypted Vault
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#101620] border border-white/5 rounded-3xl space-y-3">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <Landmark size={16} className="text-blue-400" /> Linked Nodes
            </h3>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
               <span className="text-xs font-medium">Standard Bank SA</span>
               <span className="text-[9px] font-mono text-gray-500">ZA***8842</span>
            </div>
            <button className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#00F0FF] hover:underline">
               Add Settlement Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
