
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, MoreHorizontal, ArrowUpRight, Plus, X, Copy, Check, QrCode, 
  Landmark, Loader2, ShieldCheck, Lock, AlertTriangle, Building, Send, Clock, RefreshCw, 
  CheckCircle2, ChevronDown, ArrowRight, Wallet, Info, AlertCircle
} from 'lucide-react';
import { AssetType, AssetBalance, User, Transaction } from '../types';

interface AssetsViewProps {
  prices: Record<AssetType, number>;
  balances: AssetBalance[];
  user: User | null;
  onTransaction: (tx: Transaction) => void;
}

const AssetsView: React.FC<AssetsViewProps> = ({ prices, balances, user, onTransaction }) => {
  const [modal, setModal] = useState<'none' | 'receive' | 'withdraw'>('none');
  const [depositStep, setDepositStep] = useState<'form' | 'confirm' | 'address'>('form');
  const [copied, setCopied] = useState(false);
  
  // Deposit States
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAsset, setDepositAsset] = useState<AssetType>('ETH');
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false);
  const [isSimulatingArrival, setIsSimulatingArrival] = useState(false);

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'signing' | 'deducting' | 'settled'>('idle');

  const assetsWithValues = balances.map(asset => ({
    ...asset,
    valueZar: asset.balance * (prices[asset.symbol] || asset.valueZar / (asset.balance || 1))
  }));

  const totalBalanceZar = assetsWithValues.reduce((sum, asset) => sum + asset.valueZar, 0);
  const zarAsset = assetsWithValues.find(a => a.symbol === 'ZAR');
  const currentZarBalance = zarAsset?.balance || 0;

  const isInsufficientZar = parseFloat(withdrawAmount) > currentZarBalance;

  const handleCopy = () => {
    if (user?.internalWallet) {
      navigator.clipboard.writeText(user.internalWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmDepositIntent = () => {
    setDepositStep('address');
  };

  const simulateDepositArrival = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;

    setIsSimulatingArrival(true);
    setTimeout(() => {
      onTransaction({
        id: Math.random().toString(36).substr(2, 9),
        asset: depositAsset,
        type: 'Deposit',
        amountCrypto: amt,
        amountZar: amt * (prices[depositAsset] || 0),
        status: 'Settled',
        timestamp: new Date().toLocaleString(),
        txHash: '0x' + Math.random().toString(16).substr(2, 32),
        merchant: 'External Wallet Ingress'
      });
      setIsSimulatingArrival(false);
      setModal('none');
      setDepositStep('form');
      setDepositAmount('');
    }, 2000);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || user?.kycStatus !== 'verified' || isInsufficientZar) return;
    
    setWithdrawStatus('signing');
    
    setTimeout(() => {
      setWithdrawStatus('deducting');
      setTimeout(() => {
        onTransaction({
          id: Math.random().toString(36).substr(2, 9),
          asset: 'ZAR', type: 'External Transfer',
          amountZar: amt, status: 'Settled',
          timestamp: new Date().toLocaleString(), txHash: '0x' + Math.random().toString(16).substr(2, 32),
          merchant: 'Bank Settlement Egress', recipientAccount: 'ZA***8842'
        });
        setWithdrawStatus('settled');
        setTimeout(() => {
          setModal('none');
          setWithdrawStatus('idle');
          setWithdrawAmount('');
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const availableAssets: AssetType[] = ['ETH', 'BTC', 'SOL', 'USDC'];

  return (
    <div className="space-y-8">
      {/* Balance Summary Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#101620] to-[#0A0E17] border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#39FF14]/5 blur-[100px]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
               <ShieldCheck size={14} className="text-[#39FF14]" />
               <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Verified Sovereign Identity</span>
            </div>
            <div className="flex items-baseline gap-3 relative">
              <h1 className="text-5xl font-bold font-mono tracking-tighter">R {totalBalanceZar.toLocaleString()}</h1>
              <span className="text-[#39FF14] bg-[#39FF14]/10 px-2 py-0.5 rounded text-sm font-mono">+2.4%</span>
              {(withdrawStatus === 'deducting' || isSimulatingArrival) && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute -bottom-8 left-0 text-[10px] text-amber-400 font-mono font-bold uppercase flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={12} /> Syncing Sovereign Ledger...
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setModal('receive'); setDepositStep('form'); }} className="px-6 py-3 bg-[#00F0FF] text-[#0A0E17] rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">Deposit</button>
            <button onClick={() => setModal('withdraw')} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">Withdraw</button>
          </div>
        </div>
      </motion.div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assetsWithValues.map((asset, index) => (
          <motion.div key={asset.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="bg-[#101620]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group relative">
            {(withdrawStatus === 'deducting' || (isSimulatingArrival && depositAsset === asset.symbol)) && (
              <div className="absolute inset-0 z-20 bg-[#0A0E17]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                 <Loader2 className="animate-spin text-amber-400" size={24} />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border border-white/10" style={{ backgroundColor: `${asset.color}20`, color: asset.color }}>{asset.symbol[0]}</div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                <Lock size={10} className="text-gray-500" />
                <span className="text-[8px] font-mono text-gray-500 uppercase font-bold tracking-widest">MPC Isolated</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg">{asset.name}</h3>
            <p className="text-xs text-gray-500 font-mono mb-6">{asset.balance.toLocaleString()} {asset.symbol}</p>
            <div className="flex items-end justify-between font-mono">
              <span className="text-xl font-bold">R {asset.valueZar.toLocaleString()}</span>
              <span className={`text-xs ${asset.change24h >= 0 ? 'text-[#39FF14]' : 'text-red-400'}`}>{asset.change24h}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal !== 'none' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal('none')} className="absolute inset-0 bg-[#0A0E17]/90 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-md bg-[#101620] border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setModal('none')} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
              
              {modal === 'receive' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Bridge Ingress</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Asset Deposit Simulation</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {depositStep === 'form' ? (
                      <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                         <div className="space-y-4">
                            <div className="space-y-2 relative">
                               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 font-bold">Select Ingress Asset</label>
                               <button 
                                 onClick={() => setIsAssetMenuOpen(!isAssetMenuOpen)}
                                 className="w-full flex items-center justify-between bg-[#0A0E17] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white"
                               >
                                 <div className="flex items-center gap-3">
                                   <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px]">{depositAsset[0]}</div>
                                   {depositAsset}
                                 </div>
                                 <ChevronDown size={16} className={`transition-transform ${isAssetMenuOpen ? 'rotate-180' : ''}`} />
                               </button>
                               {isAssetMenuOpen && (
                                 <div className="absolute top-full left-0 right-0 mt-2 bg-[#101620] border border-white/10 rounded-2xl shadow-2xl z-50">
                                   {availableAssets.map(asset => (
                                     <button 
                                       key={asset} 
                                       onClick={() => { setDepositAsset(asset); setIsAssetMenuOpen(false); }}
                                       className="w-full px-5 py-4 text-left text-sm font-bold hover:bg-white/5 border-b border-white/5 last:border-0"
                                     >
                                       {asset}
                                     </button>
                                   ))}
                                 </div>
                               )}
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 font-bold">Bridging Amount</label>
                               <div className="relative">
                                  <input 
                                    type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)}
                                    className="w-full bg-[#0A0E17] border border-white/10 rounded-2xl py-5 px-6 font-mono text-3xl font-bold focus:outline-none focus:border-[#00F0FF]/40 text-white" 
                                    placeholder="0.00" 
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold text-lg">{depositAsset}</span>
                               </div>
                            </div>
                         </div>
                         <button 
                           onClick={() => setDepositStep('confirm')}
                           disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                           className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                         >
                           Verify Deposit Amount <ArrowRight size={18} />
                         </button>
                      </motion.div>
                    ) : depositStep === 'confirm' ? (
                      <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                         <div className="bg-[#0A0E17] border border-white/10 rounded-3xl p-8 space-y-6">
                            <div className="text-center space-y-1">
                               <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Protocol Statement</p>
                               <p className="text-gray-400 text-sm">You are bridging into the sovereign ledger:</p>
                               <p className="text-4xl font-bold text-white font-mono mt-4">{depositAmount} {depositAsset}</p>
                               <p className="text-xs text-[#39FF14] font-mono tracking-widest uppercase">≈ R {(parseFloat(depositAmount) * (prices[depositAsset] || 0)).toLocaleString()}</p>
                            </div>
                            <div className="h-[1px] bg-white/5" />
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-left">
                              <Info className="text-blue-400 flex-shrink-0" size={16} />
                              <p className="text-[10px] text-blue-400/80 leading-relaxed font-bold">
                                Only send {depositAsset} to the generated address. Misdirected assets are unrecoverable.
                              </p>
                           </div>
                         </div>
                         <div className="space-y-4">
                            <button 
                              onClick={handleConfirmDepositIntent}
                              className="w-full py-5 bg-[#39FF14] text-[#0A0E17] font-bold rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.2)] flex items-center justify-center gap-2"
                            >
                              Generate Ingress Address <Check size={20} />
                            </button>
                            <button 
                              onClick={() => setDepositStep('form')}
                              className="w-full py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                              Cancel & Modify
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="address" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center">
                        <div className="bg-white p-6 rounded-[32px] w-48 h-48 mx-auto flex items-center justify-center">
                          <QrCode size={140} className="text-[#0A0E17]" />
                        </div>
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Your {depositAsset} Bridge Address</label>
                          <div className="flex items-center gap-2 bg-[#0A0E17] border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-gray-300">
                            <span className="truncate flex-1">{user?.internalWallet}</span>
                            <button onClick={handleCopy} className="text-[#00F0FF] p-2 hover:bg-white/5 rounded-lg transition-colors">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
                          </div>
                        </div>
                        <button 
                           onClick={simulateDepositArrival}
                           disabled={isSimulatingArrival}
                           className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                           {isSimulatingArrival ? <><Loader2 className="animate-spin" size={12} /> Detecting Confirmations...</> : 'Simulate On-Chain Arrival'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Bridge Egress (ZAR)</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Settlement to Bank</p>
                  </div>
                  {user?.kycStatus !== 'verified' ? (
                    <div className="p-10 bg-amber-400/5 border border-amber-400/20 rounded-[40px] text-center space-y-6">
                       <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto">
                          <AlertTriangle className="text-amber-400" size={32} />
                       </div>
                       <div className="space-y-2">
                         <p className="text-sm text-amber-400 font-bold uppercase tracking-widest">Identity Not Verified</p>
                         <p className="text-xs text-gray-500 leading-relaxed">External ZAR settlement is restricted to verified identities. Complete verification in Settings.</p>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {withdrawStatus === 'idle' ? (
                        <div className="space-y-6">
                           <div className="p-5 bg-white/5 border border-white/5 rounded-[28px] space-y-4">
                              <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                                 <span>Source Asset</span>
                                 <span className={isInsufficientZar ? 'text-red-400' : ''}>Balance: R {currentZarBalance.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] font-bold border border-[#00F0FF]/20">R</div>
                                 <div className="flex flex-col">
                                   <span className="font-bold text-sm">SA Rand Terminal</span>
                                   <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Bridge Balance</span>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Egress Amount (ZAR)</label>
                             <div className="relative">
                               <input 
                                 type="number" value={withdrawAmount} 
                                 onChange={(e) => setWithdrawAmount(e.target.value)} 
                                 className={`w-full bg-[#0A0E17] border ${isInsufficientZar ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-6 px-6 font-mono text-4xl font-bold focus:outline-none focus:border-[#00F0FF]/40 text-white`} 
                                 placeholder="0.00" 
                               />
                               <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold text-xl">ZAR</span>
                             </div>
                             {isInsufficientZar && (
                               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-2 mt-2 ml-1">
                                 <AlertCircle size={12} /> Insufficient Ledger Credits
                               </motion.p>
                             )}
                           </div>
                           <button 
                             onClick={handleWithdraw} 
                             disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isInsufficientZar}
                             className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95 disabled:opacity-50"
                           >
                             Initiate EFT Settlement <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </button>
                        </div>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
                           <div className="relative">
                              <div className="w-32 h-32 border-4 border-[#00F0FF]/10 rounded-full" />
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-[#00F0FF] border-t-transparent rounded-full" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 {withdrawStatus === 'signing' && <ShieldCheck className="text-[#00F0FF]" size={40} />}
                                 {withdrawStatus === 'deducting' && <Landmark className="text-amber-400" size={40} />}
                                 {withdrawStatus === 'settled' && <CheckCircle2 className="text-[#39FF14]" size={40} />}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <h4 className="text-2xl font-bold">
                                 {withdrawStatus === 'signing' && 'Authenticating Egress'}
                                 {withdrawStatus === 'deducting' && 'Updating Ledger'}
                                 {withdrawStatus === 'settled' && 'Settlement Confirmed'}
                              </h4>
                              <p className="text-sm text-gray-500 font-mono uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                                 {withdrawStatus === 'signing' && 'Requesting Node Signature...'}
                                 {withdrawStatus === 'deducting' && 'Deducting Sovereign Credits...'}
                                 {withdrawStatus === 'settled' && 'EFT Transmitted to Reserve Bank Rails'}
                              </p>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetsView;
