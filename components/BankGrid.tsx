
import React from 'react';
import { motion } from 'framer-motion';
import { Bank } from '../types';
import { BANKS } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface BankGridProps {
  selectedBank: Bank | null;
  onSelectBank: (bank: Bank) => void;
}

const BankGrid: React.FC<BankGridProps> = ({ selectedBank, onSelectBank }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {BANKS.map((bank, index) => (
        <motion.button
          key={bank.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectBank(bank)}
          className={`relative group h-24 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
            selectedBank?.id === bank.id
              ? 'bg-[#00F0FF]/5 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]'
              : 'bg-[#101620] border-white/5 hover:border-white/20'
          }`}
        >
          {selectedBank?.id === bank.id && (
            <div className="absolute top-2 right-2 text-[#00F0FF]">
              <CheckCircle2 size={16} />
            </div>
          )}
          
          <motion.div 
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
            style={{ backgroundColor: bank.color }}
          >
            {bank.logo}
          </motion.div>
          <span className={`text-xs font-medium tracking-tight transition-colors ${
            selectedBank?.id === bank.id ? 'text-[#00F0FF]' : 'text-gray-400 group-hover:text-white'
          }`}>
            {bank.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default BankGrid;
