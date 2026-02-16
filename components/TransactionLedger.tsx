
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../types';
import { 
  ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, 
  ShoppingBag, Zap, Send, User, ChevronDown, Copy, ExternalLink, 
  Hash, Landmark, UserCheck 
} from 'lucide-react';

interface TransactionLedgerProps {
  transactions: Transaction[];
}

const TransactionLedger: React.FC<TransactionLedgerProps> = ({ transactions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Settled': return 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20';
      case 'Processing': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
      case 'Failed': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Settled': return <CheckCircle2 size={12} />;
      case 'Processing': return <Clock size={12} className="animate-spin-slow" />;
      case 'Failed': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Card Payment': return <ShoppingBag size={14} className="text-purple-400" />;
      case 'Bill Payment': return <Zap size={14} className="text-amber-400" />;
      case 'Internal Transfer': return <User size={14} className="text-[#39FF14]" />;
      case 'External Transfer': return <Send size={14} className="text-blue-400" />;
      case 'Bridge Out': return <ArrowUpRight size={14} className="text-[#00F0FF]" />;
      case 'Swap': return <Landmark size={14} className="text-pink-400" />;
      default: return <ArrowDownLeft size={14} />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="overflow-x-auto bg-[#101620]/50 backdrop-blur-xl border border-white/5 rounded-2xl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500 w-10"></th>
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500">Asset</th>
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500">Merchant/Ref</th>
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500">Type</th>
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500">Amount (ZAR)</th>
            <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {transactions.slice(0, 10).map((tx) => (
            <React.Fragment key={tx.id}>
              <motion.tr 
                onClick={() => toggleExpand(tx.id)}
                className={`group cursor-pointer transition-colors ${expandedId === tx.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                <td className="px-6 py-4">
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform duration-300 ${expandedId === tx.id ? 'rotate-180 text-[#00F0FF]' : ''}`} 
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold text-gray-300">
                      {tx.asset === 'BTC' ? '₿' : tx.asset === 'ETH' ? 'Ξ' : tx.asset === 'SOL' ? 'S' : 'R'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">{tx.asset}</span>
                      <span className="text-[10px] text-gray-500 font-mono leading-none">{tx.timestamp.split(' ')[0]}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-300 truncate max-w-[150px] inline-block">
                    {tx.merchant || tx.recipientAccount || 'System Swap'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {getTypeIcon(tx.type)}
                    <span className="whitespace-nowrap">{tx.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-white">R {tx.amountZar.toLocaleString()}</span>
                    {tx.amountCrypto && <span className="text-[10px] text-gray-500 font-mono">{tx.amountCrypto} {tx.asset}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.div 
                    animate={
                      tx.status === 'Processing' 
                        ? { opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] } 
                        : tx.status === 'Failed' 
                        ? { x: [-1, 1, -1, 1, 0] } 
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      tx.status === 'Processing' 
                        ? { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                        : tx.status === 'Failed' 
                        ? { repeat: Infinity, duration: 0.2, repeatDelay: 2 } 
                        : { duration: 0.3 }
                    }
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${getStatusStyle(tx.status)}`}
                  >
                    {getStatusIcon(tx.status)}
                    {tx.status}
                  </motion.div>
                </td>
              </motion.tr>

              <AnimatePresence>
                {expandedId === tx.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden bg-[#0D121F]/80"
                      >
                        <div className="px-16 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Transaction Hash</p>
                              <div className="flex items-center gap-2 group/hash">
                                <Hash size={12} className="text-[#00F0FF]" />
                                <span className="text-xs font-mono text-gray-300 truncate max-w-[200px]">{tx.txHash}</span>
                                <button className="text-gray-600 hover:text-white transition-colors">
                                  <Copy size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Network Context</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <ExternalLink size={12} /> View on Explorer
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Recipient / Source</p>
                              <div className="flex items-center gap-2">
                                <UserCheck size={12} className="text-[#39FF14]" />
                                <span className="text-xs text-gray-300 font-medium">
                                  {tx.recipientAccount || tx.merchant || 'Internal Protocol Wallet'}
                                </span>
                              </div>
                            </div>
                            {tx.recipientBank && (
                              <div className="space-y-1">
                                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Settlement Bank</p>
                                <div className="flex items-center gap-2">
                                  <Landmark size={12} className="text-amber-400" />
                                  <span className="text-xs text-gray-300">{tx.recipientBank}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="bg-[#101620] rounded-xl p-4 border border-white/5 space-y-2">
                              <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest text-center">Security Verification</p>
                              <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                                ))}
                              </div>
                              <p className="text-[10px] text-center text-[#39FF14] font-bold uppercase">MPC Fragment Signed</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TransactionLedger;
