
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Tv, ShoppingBag, Landmark, Search, ChevronRight, Loader2, CheckCircle2, 
  Download, Printer, Share2, Send, User, Building2, CreditCard, Star, Trash2, 
  Plus, ArrowRight, Calendar, Repeat, Clock, AlertCircle, X, Check, Filter,
  ChevronDown
} from 'lucide-react';
import { BILLERS, BANKS, ASSET_BALANCES } from '../constants';
import { Biller, Transaction, Bank, SavedPayee, RecurringPayment, PaymentCategory, TransferType, Frequency, AssetBalance } from '../types';

interface PaymentsViewProps {
  onPayment: (tx: Transaction) => void;
  initialSavedPayees: SavedPayee[];
  onUpdatePayees: (payees: SavedPayee[]) => void;
  initialRecurring: RecurringPayment[];
  onUpdateRecurring: (recurring: RecurringPayment[]) => void;
  balances?: AssetBalance[]; // Added balances for validation
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ 
  onPayment, 
  initialSavedPayees, 
  onUpdatePayees, 
  initialRecurring, 
  onUpdateRecurring,
  balances = ASSET_BALANCES
}) => {
  const [category, setCategory] = useState<PaymentCategory>('bills');
  const [transferType, setTransferType] = useState<TransferType | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankMenu, setShowBankMenu] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [savePayee, setSavePayee] = useState(false);
  const [payeeLabel, setPayeeLabel] = useState('');
  
  // Bill Filtering States
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [billCategoryFilter, setBillCategoryFilter] = useState<string | null>(null);
  const categoriesList = ['Utilities', 'Media', 'Retail', 'Education'];

  // Recurring States
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const [step, setStep] = useState<'browse' | 'pay' | 'confirm'>('browse');
  const [lastTxId, setLastTxId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const [isManaging, setIsManaging] = useState(false);

  const zarBalance = balances.find(b => b.symbol === 'ZAR')?.balance || 0;
  const isInsufficient = parseFloat(amount) > zarBalance;

  // Filtered Billers Logic
  const filteredBillers = useMemo(() => {
    return BILLERS.filter(biller => {
      const matchesSearch = biller.name.toLowerCase().includes(billSearchTerm.toLowerCase()) || 
                            biller.category.toLowerCase().includes(billSearchTerm.toLowerCase());
      const matchesCategory = billCategoryFilter ? biller.category === billCategoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [billSearchTerm, billCategoryFilter]);

  const handlePay = () => {
    if (isInsufficient || !amount || parseFloat(amount) <= 0) return;
    setIsPaying(true);

    const txId = (transferType ? (transferType === 'internal' ? 'INT-' : 'EXT-') : 'BILL-') + Math.random().toString(16).substr(2, 8).toUpperCase();
    
    setTimeout(() => {
      setLastTxId(txId);
      
      let currentPayeeId = '';
      if (savePayee) {
        currentPayeeId = Math.random().toString(36).substr(2, 9);
        const newPayee: SavedPayee = {
          id: currentPayeeId,
          label: payeeLabel || recipientName || selectedBiller?.name || 'Saved Payee',
          accountNumber,
          type: category,
          transferType: transferType || undefined,
          billerId: selectedBiller?.id,
          bankId: selectedBank?.id,
          recipientName: recipientName
        };
        onUpdatePayees([newPayee, ...initialSavedPayees]);
      }

      if (isRecurring) {
        const newRecurring: RecurringPayment = {
          id: 'REC-' + Math.random().toString(36).substr(2, 5),
          label: payeeLabel || recipientName || selectedBiller?.name || 'Scheduled Payment',
          amount: parseFloat(amount),
          frequency,
          startDate,
          endDate: endDate || undefined,
          nextDate: startDate,
          payeeId: currentPayeeId || undefined,
          billerId: selectedBiller?.id,
          type: category
        };
        onUpdateRecurring([newRecurring, ...initialRecurring]);
      }

      const type: Transaction['type'] = transferType 
        ? (transferType === 'internal' ? 'Internal Transfer' : 'External Transfer')
        : 'Bill Payment';

      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        asset: 'ZAR',
        type,
        amountZar: parseFloat(amount),
        status: 'Settled',
        timestamp: new Date().toLocaleString(),
        txHash: txId,
        merchant: selectedBiller?.name || recipientName || (transferType === 'internal' ? 'Peer Transfer' : 'Bank Deposit'),
        recipientAccount: accountNumber,
        recipientBank: selectedBank?.name
      };
      onPayment(newTx);
      setStep('confirm');
      setIsPaying(false);
    }, 2000);
  };

  const handleSelectSaved = (payee: SavedPayee) => {
    setCategory(payee.type);
    setTransferType(payee.transferType || null);
    setAccountNumber(payee.accountNumber);
    setRecipientName(payee.recipientName || '');
    
    if (payee.billerId) {
      const biller = BILLERS.find(b => b.id === payee.billerId);
      if (biller) setSelectedBiller(biller);
    }
    
    if (payee.bankId) {
      const bank = BANKS.find(b => b.id === payee.bankId);
      if (bank) setSelectedBank(bank);
    }
    
    setStep('pay');
  };

  const deleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onUpdatePayees(initialSavedPayees.filter(p => p.id !== id));
  };

  const cancelRecurring = (id: string) => {
    onUpdateRecurring(initialRecurring.filter(r => r.id !== id));
  };

  const reset = () => {
    setStep('browse');
    setSelectedBiller(null);
    setSelectedBank(null);
    setTransferType(null);
    setAmount('');
    setAccountNumber('');
    setRecipientName('');
    setLastTxId('');
    setSavePayee(false);
    setPayeeLabel('');
    setIsRecurring(false);
    setFrequency('Monthly');
    setEndDate('');
    setBillSearchTerm('');
    setBillCategoryFilter(null);
    setShowBankMenu(false);
    setIsPaying(false);
  };

  if (step === 'confirm') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#101620] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
        >
          <div className="bg-[#39FF14]/10 p-8 text-center border-b border-[#39FF14]/20">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-[#39FF14] text-[#0A0E17] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(57,255,20,0.4)]"
            >
              <CheckCircle2 size={40} />
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Egress Finalized</h3>
            <p className="text-[#39FF14] font-mono text-sm uppercase tracking-widest font-bold">
              Ledger Deduction Verified
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Shard ID</p>
                <p className="font-mono text-white text-sm">{lastTxId}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Ledger State</p>
                <p className="text-[#39FF14] font-bold text-sm">SYNCHRONIZED</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Reference</p>
                <p className="font-mono text-white text-sm">{accountNumber}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Settlement</p>
                <p className="text-[#00F0FF] font-bold text-sm">R {parseFloat(amount).toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button onClick={reset} className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-lg transition-all text-lg">Close Terminal</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">Settlement Terminal</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-mono font-bold border border-[#39FF14]/20 uppercase tracking-widest">MPC Authorized</span>
          </div>
          <p className="text-gray-500 font-medium">Transmit ZAR from your sovereign bridge to external entities.</p>
        </div>

        <div className="flex bg-[#101620] p-1.5 rounded-2xl border border-white/5 w-fit">
          <button 
            onClick={() => { setCategory('bills'); reset(); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${category === 'bills' ? 'bg-[#00F0FF] text-[#0A0E17] shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Zap size={16} /> Bill Settlement
          </button>
          <button 
            onClick={() => { setCategory('send'); reset(); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${category === 'send' ? 'bg-[#00F0FF] text-[#0A0E17] shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Send size={16} /> Peer Egress
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'browse' ? (
          <motion.div key="browse-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
            {initialSavedPayees.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2 font-bold">
                    <Star size={14} className="text-[#00F0FF]" /> VERIFIED RECIPIENTS
                  </h3>
                  <button onClick={() => setIsManaging(!isManaging)} className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider hover:underline">{isManaging ? 'DONE' : 'MANAGE'}</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {initialSavedPayees.map((payee) => (
                    <motion.button key={payee.id} whileHover={{ y: -4 }} onClick={() => !isManaging && handleSelectSaved(payee)} className="flex-shrink-0 w-32 group relative">
                      <div className={`w-20 h-20 mx-auto bg-[#101620] border border-white/5 rounded-2xl flex items-center justify-center text-2xl transition-all ${isManaging ? 'opacity-50' : 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'}`}>
                        {payee.type === 'bills' ? (BILLERS.find(b => b.id === payee.billerId)?.icon || '💸') : (payee.transferType === 'internal' ? <User className="text-[#39FF14]" /> : <Building2 className="text-blue-400" />)}
                      </div>
                      <p className="text-[11px] mt-2 font-bold text-center truncate px-2">{payee.label}</p>
                      {isManaging && (
                        <button onClick={(e) => deleteSaved(e, payee.id)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-[#0A0E17]">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {category === 'send' && !transferType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => { setTransferType('internal'); setStep('pay'); }} className="p-8 bg-[#101620]/50 border border-white/5 rounded-3xl hover:border-[#39FF14]/30 transition-all group text-left space-y-4">
                  <div className="w-14 h-14 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center text-[#39FF14] group-hover:scale-110 transition-transform"><User size={28} /></div>
                  <div><h3 className="text-xl font-bold">Internal Peer</h3><p className="text-sm text-gray-500">Zero-fee settlement to any verified Current identity.</p></div>
                </button>
                <button onClick={() => { setTransferType('external'); setStep('pay'); }} className="p-8 bg-[#101620]/50 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group text-left space-y-4">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
                  <div><h3 className="text-xl font-bold">Bank Rails</h3><p className="text-sm text-gray-500">Fast EFT settlement to external South African bank accounts.</p></div>
                </button>
              </div>
            ) : category === 'bills' ? (
              <div className="space-y-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" placeholder="Identify biller..." value={billSearchTerm} onChange={(e) => setBillSearchTerm(e.target.value)} className="w-full bg-[#101620] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-white focus:outline-none focus:border-[#00F0FF]/30" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBillers.map((biller) => (
                    <button key={biller.id} onClick={() => { setSelectedBiller(biller); setStep('pay'); }} className="flex items-center justify-between p-5 bg-[#101620]/50 border border-white/5 rounded-2xl hover:border-[#00F0FF]/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl border border-white/10">{biller.icon}</div>
                        <div className="text-left"><h4 className="font-bold text-white group-hover:text-[#00F0FF]">{biller.name}</h4><span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{biller.category}</span></div>
                      </div>
                      <ChevronRight size={20} className="text-gray-600 group-hover:text-[#00F0FF]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key="pay-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-[#101620]/50 border border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
            <button onClick={reset} className="text-xs text-gray-500 hover:text-white mb-6">← BACK</button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10">{selectedBiller?.icon || (transferType === 'internal' ? <User size={28} className="text-[#39FF14]" /> : <Building2 size={28} className="text-blue-400" />)}</div>
              <div><h3 className="text-xl font-bold text-white">{selectedBiller?.name || (transferType === 'internal' ? 'Internal Peer' : (selectedBank?.name || 'Bank Deposit'))}</h3><span className="text-xs text-gray-500 font-mono uppercase tracking-widest">{selectedBiller?.category || 'EFT SETTLEMENT'}</span></div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-widest">Available Ledger</span>
                    <span className={`text-[10px] font-mono font-bold ${isInsufficient ? 'text-red-400' : 'text-[#39FF14]'}`}>R {zarBalance.toLocaleString()}</span>
                 </div>
              </div>

              {transferType === 'external' && (
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 font-bold">Target Institution</label>
                  <button onClick={() => setShowBankMenu(!showBankMenu)} className="w-full flex items-center justify-between bg-[#0A0E17] border border-white/10 rounded-xl px-4 py-4 text-sm text-gray-300 font-medium">
                    <div className="flex items-center gap-2">{selectedBank ? (<><div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: selectedBank.color }}>{selectedBank.logo}</div>{selectedBank.name}</>) : "Select Bank"}</div>
                    <ChevronDown size={16} />
                  </button>
                  <AnimatePresence>{showBankMenu && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute w-full mt-2 bg-[#101620] border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden">{BANKS.map(bank => (<button key={bank.id} onClick={() => { setSelectedBank(bank); setShowBankMenu(false); }} className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: bank.color }}>{bank.logo}</div>{bank.name}</button>))}</motion.div>)}</AnimatePresence>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 font-bold">Account Reference</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-4 py-4 font-mono text-white focus:outline-none focus:border-[#00F0FF]/50" placeholder="Reference ID" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 font-bold">Settlement Amount (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">R</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full bg-[#0A0E17] border ${isInsufficient ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-10 pr-4 py-4 font-mono text-2xl font-bold text-white focus:outline-none focus:border-[#00F0FF]/40`} placeholder="0.00" />
                </div>
                {isInsufficient && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 mt-1 ml-1"><AlertCircle size={10} /> Insufficient Balance for Egress</motion.p>
                )}
              </div>
              
              <button 
                onClick={handlePay} disabled={isPaying || !amount || parseFloat(amount) <= 0 || isInsufficient}
                className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-lg disabled:opacity-50 transition-all text-lg flex items-center justify-center gap-2"
              >
                {isPaying ? <><Loader2 className="animate-spin" size={20} /> Transmitting Shards...</> : 'Confirm Settlement'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsView;
