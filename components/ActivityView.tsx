
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, ShoppingBag, Landmark, Zap } from 'lucide-react';
import { Transaction } from '../types';

interface ActivityViewProps {
  transactions: Transaction[];
}

const ActivityView: React.FC<ActivityViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'text-[#39FF14]';
      case 'Processing': return 'text-amber-400';
      default: return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Card Payment': return <ShoppingBag size={20} />;
      case 'Bill Payment': return <Zap size={20} />;
      case 'Bridge Out': return <ArrowUpRight size={20} />;
      default: return <Landmark size={20} />;
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Full History</h2>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00F0FF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#101620] border border-white/10 rounded-xl focus:outline-none focus:border-[#00F0FF]/50 text-sm w-[280px]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-[#101620]/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  tx.type === 'Card Payment' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  tx.type === 'Bill Payment' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  tx.type === 'Bridge Out' ? 'bg-[#00F0FF]/10 border-[#00F0FF]/20 text-[#00F0FF]' :
                  'bg-[#39FF14]/10 border-[#39FF14]/20 text-[#39FF14]'
                }`}>
                  {getTypeIcon(tx.type)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{tx.merchant || tx.type}</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                    <span>{tx.timestamp}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className={`transition-colors duration-500 ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right flex flex-col items-end">
                  <span className={`font-mono font-bold ${tx.type !== 'Bridge In' && tx.type !== 'Swap' ? 'text-white' : 'text-[#39FF14]'}`}>
                    {tx.type !== 'Bridge In' && tx.type !== 'Swap' ? '-' : '+'} R {tx.amountZar.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {tx.amountCrypto ? `${tx.amountCrypto} ${tx.asset}` : 'ZAR Balance'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityView;
