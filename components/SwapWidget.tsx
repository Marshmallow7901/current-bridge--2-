
import React, { useState, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, ChevronDown, CheckCircle2, Loader2, Info, RefreshCw, Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { AssetType, Bank, Transaction, AssetBalance } from '../types';

interface SwapWidgetProps {
  selectedBank: Bank | null;
  prices: Record<AssetType, number>;
  isLoadingPrices: boolean;
  selectedAsset: AssetType;
  onAssetChange: (asset: AssetType) => void;
  onSuccess?: (tx: Transaction) => void;
  onRefresh?: () => void;
  lastUpdated?: Date;
  assetBalances: AssetBalance[];
  volatility?: number;
}

const SwapWidget: React.FC<SwapWidgetProps> = ({ 
  selectedBank, prices, isLoadingPrices, selectedAsset, 
  onAssetChange, onSuccess, onRefresh, lastUpdated, assetBalances, volatility
}) => {
  const [amount, setAmount] = useState('1.00');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false);
  const controls = useAnimation();

  const handleSwapClick = async () => {
    await controls.start({ rotate: 180, transition: { duration: 0.4 } });
    controls.set({ rotate: 0 });
    if (onRefresh) onRefresh();
  };

  const currentRate = prices[selectedAsset] || 0;
  const zarAmount = parseFloat(amount || '0') * currentRate;
  const currentAssetBalance = assetBalances.find(b => b.symbol === selectedAsset)?.balance || 0;

  const isInsufficient = parseFloat(amount) > currentAssetBalance;

  const displayVolatility = Number.isFinite(volatility) ? Number(volatility).toFixed(2) : '0.00';
  const ciAdvice = useMemo(() => isInsufficient ? "Ci Alert: Insufficient Liquidity" : zarAmount > 50000 ? "Bridge Timing: Optimized" : "Ci Alert: Low Liquidity", [zarAmount, isInsufficient]);

  const handleInitiate = () => {
    if (isInsufficient || parseFloat(amount) <= 0) return;
    setStatus('processing');
    setTimeout(() => {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        asset: selectedAsset,
        type: 'Swap',
        amountCrypto: parseFloat(amount),
        amountZar: zarAmount,
        status: 'Settled',
        timestamp: new Date().toLocaleString(),
        txHash: '0x' + Math.random().toString(16).substr(2, 32)
      };
      if (onSuccess) onSuccess(newTx);
      setStatus('success');
    }, 2000);
  };

  const calculatedZar = zarAmount.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
  const availableAssets: AssetType[] = ['ETH', 'BTC', 'SOL', 'USDC', 'CURR'];

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-[480px] bg-[#101620]/80 backdrop-blur-xl border border-[#39FF14]/30 rounded-[32px] p-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-[#39FF14]/10 rounded-full flex items-center justify-center text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.2)]">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Bridge Settled</h3>
          <p className="text-gray-400 text-sm">Credits synchronized with sovereign ZAR terminal ledger.</p>
        </div>
        <button onClick={() => setStatus('idle')} className="w-full py-4 bg-[#39FF14] text-[#0A0E17] font-bold rounded-2xl shadow-lg">Back to Terminal</button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md bg-[#101620]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">Instant Swap</h3>
          <div className="flex items-center gap-1 text-[10px] text-[#39FF14] font-mono">
             <TrendingUp size={10} /> Volatility: {displayVolatility}%
          </div>
        </div>
        <button onClick={onRefresh} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <RefreshCw size={14} className={isLoadingPrices ? 'animate-spin text-amber-400' : 'text-[#00F0FF]'} />
        </button>
      </div>

      <div className="space-y-2">
        <div className={`bg-[#0A0E17]/50 border ${isInsufficient ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 transition-colors relative`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">From Asset</span>
            <span className={`text-[10px] font-mono font-bold ${isInsufficient ? 'text-red-400' : 'text-gray-500'}`}>Avail: {currentAssetBalance.toLocaleString()} {selectedAsset}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-3xl font-mono font-bold w-full focus:outline-none" placeholder="0.00" />
            <button onClick={() => setIsAssetMenuOpen(!isAssetMenuOpen)} className="flex items-center gap-2 px-3 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-xl text-[#00F0FF] font-bold transition-all">
              {selectedAsset} <ChevronDown size={14} className={isAssetMenuOpen ? 'rotate-180' : ''} />
            </button>
          </div>
          {isInsufficient && (
            <div className="mt-2 flex items-center gap-1.5 text-red-400 text-[9px] font-mono uppercase font-bold">
               <AlertCircle size={10} /> Insufficient Balance
            </div>
          )}
          <AnimatePresence>
            {isAssetMenuOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-4 top-16 w-32 bg-[#101620] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                {availableAssets.map(asset => (
                  <button key={asset} onClick={() => { onAssetChange(asset); setIsAssetMenuOpen(false); }} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl border-b border-white/5 last:border-0">{asset}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <motion.button animate={controls} onClick={handleSwapClick} className="w-10 h-10 bg-[#00F0FF] rounded-full flex items-center justify-center text-[#0A0E17] shadow-lg"><ArrowDownUp size={18} /></motion.button>
        </div>

        <div className="bg-[#0A0E17]/50 border border-white/5 rounded-2xl p-4">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">Estimated ZAR Credit</span>
          <div className="text-3xl font-mono font-bold text-gray-200">{calculatedZar}</div>
        </div>
      </div>

      <div className={`mt-6 p-4 ${isInsufficient ? 'bg-red-500/5 border-red-500/10' : 'bg-[#39FF14]/5 border-[#39FF14]/10'} border rounded-2xl flex items-center justify-between`}>
         <div className="flex items-center gap-2">
            <Sparkles size={14} className={isInsufficient ? 'text-red-400' : 'text-[#39FF14]'} />
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">Ci INSIGHT:</span>
         </div>
         <span className={`text-[10px] font-bold uppercase ${isInsufficient ? 'text-red-400' : 'text-white'}`}>{ciAdvice}</span>
      </div>

      <button 
        onClick={handleInitiate} disabled={status === 'processing' || parseFloat(amount) <= 0 || isInsufficient}
        className="w-full mt-6 py-5 bg-[#00F0FF] text-[#0A0E17] font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'processing' ? <><Loader2 className="animate-spin" size={20} /> Settling Shards...</> : `Initiate Swap`}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em] font-bold">
        <ShieldCheck size={10} /> Institutional MPC Active
      </div>
    </div>
  );
};

export default SwapWidget;
