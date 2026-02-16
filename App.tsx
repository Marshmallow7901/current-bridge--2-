
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import SwapWidget from './components/SwapWidget';
import BankGrid from './components/BankGrid';
import TransactionLedger from './components/TransactionLedger';
import PriceChart from './components/PriceChart';
import AssetsView from './components/AssetsView';
import CardsView from './components/CardsView';
import ActivityView from './components/ActivityView';
import PaymentsView from './components/PaymentsView';
import LandingPage from './components/LandingPage';
import Whitepaper from './components/Whitepaper';
import AuthView from './components/AuthView';
import SettingsView from './components/SettingsView';
import PrivacyView from './components/PrivacyView';
import SecurityView from './components/SecurityView';
import ProtocolView from './components/ProtocolView';
import AIAdvisor from './components/AIAdvisor';
import { Bank, AssetType, Transaction, SavedPayee, RecurringPayment, Notification, User, AssetBalance, PricePoint } from './types';
import { BANKS, INITIAL_TRANSACTIONS, ASSET_BALANCES, MOCK_CHART_DATA } from './constants';
import { GoogleGenAI } from "@google/genai";
import { Bell, CheckCircle2, AlertCircle, X, Loader2, ShieldCheck, Zap, Sparkles, Activity, Database, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // Navigation & View State
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'dashboard' | 'privacy' | 'security' | 'protocol'>('landing');
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Database / Registry State
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'error'>('connected');
  
  // Auth & User State
  const [user, setUser] = useState<User | null>(() => {
    const activeId = localStorage.getItem('current_active_session');
    if (activeId) {
      const registry = JSON.parse(localStorage.getItem('current_registry') || '{}');
      return registry[activeId]?.profile || null;
    }
    return null;
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Core Data State
  const [selectedBank, setSelectedBank] = useState<Bank | null>(BANKS[1]);
  const [activeTab, setActiveTab] = useState('Swap');
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('ETH');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<AssetBalance[]>(ASSET_BALANCES);
  const [savedPayees, setSavedPayees] = useState<SavedPayee[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [prices, setPrices] = useState<Record<AssetType, number>>({
    ETH: 52450.00, BTC: 1750000.00, SOL: 2850.00, USDC: 18.85, CURR: 24.50, ZAR: 1.00
  });
  const [assetVolatility, setAssetVolatility] = useState<Record<AssetType, number>>({
    BTC: 0,
    ETH: 0,
    SOL: 0,
    USDC: 0,
    CURR: 0,
    ZAR: 0
  });

  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load User Data only on INITIAL load or ID change
  useEffect(() => {
    if (user?.id) {
      const registry = JSON.parse(localStorage.getItem('current_registry') || '{}');
      const userData = registry[user.id] || {};
      
      if (userData.transactions) setTransactions(userData.transactions);
      if (userData.balances) setBalances(userData.balances);
      if (userData.payees) setSavedPayees(userData.payees);
      if (userData.recurring) setRecurringPayments(userData.recurring);
      
      setViewState('dashboard');
    }
  }, [user?.id]);

  // Persistent Registry Sync
  const syncToRegistry = useCallback(() => {
    if (!user?.id) return;
    setDbStatus('syncing');
    const registry = JSON.parse(localStorage.getItem('current_registry') || '{}');
    registry[user.id] = {
      profile: user,
      transactions,
      balances,
      payees: savedPayees,
      recurring: recurringPayments,
      lastSynced: new Date().toISOString()
    };
    localStorage.setItem('current_registry', JSON.stringify(registry));
    setTimeout(() => setDbStatus('connected'), 500);
  }, [user, transactions, balances, savedPayees, recurringPayments]);

  useEffect(() => { 
    const timeout = setTimeout(syncToRegistry, 300);
    return () => clearTimeout(timeout);
  }, [transactions, balances, savedPayees, recurringPayments, user]);

  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const callGeminiWithRetry = async (prompt: string, jsonMode: boolean = false, maxRetries = 2) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) return undefined;
    const ai = new GoogleGenAI({ apiKey });
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        const responsePromise = ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: jsonMode ? { responseMimeType: "application/json" } : undefined
        });
        
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 6000));
        const response: any = await Promise.race([responsePromise, timeoutPromise]);
        
        return response.text;
      } catch (error: any) {
        if (error?.message?.includes('429') || error?.message === 'TIMEOUT') {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
        } else throw error;
      }
    }
    return undefined;
  };

  const handleLogin = (email: string) => {
    setIsAuthenticating(true);
    setDbStatus('syncing');
    
    setTimeout(() => {
      const registry = JSON.parse(localStorage.getItem('current_registry') || '{}');
      let targetUser: User;
      const existingId = Object.keys(registry).find(id => registry[id].profile.email === email);
      
      if (existingId) {
        targetUser = registry[existingId].profile;
      } else {
        const newId = 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        targetUser = {
          id: newId, email, name: email.split('@')[0], kycStatus: 'unverified',
          internalWallet: '0x' + Math.random().toString(16).substr(2, 40)
        };
      }

      localStorage.setItem('current_active_session', targetUser.id);
      setUser(targetUser);
      setIsAuthenticating(false);
      setViewState('dashboard');
      notify(`Identity Verified via MPC Node`, "success");
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_active_session');
    setUser(null);
    setViewState('landing');
    setTransactions([]);
    setBalances(ASSET_BALANCES);
    notify("Session Purged", "info");
  };

  const updateBalance = useCallback((symbol: AssetType, amount: number) => {
    setBalances(prev => prev.map(b => b.symbol === symbol ? { ...b, balance: Math.max(0, b.balance + amount) } : b));
  }, []);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === 'Swap') {
      updateBalance(tx.asset, -(tx.amountCrypto || 0));
      updateBalance('ZAR', tx.amountZar);
    } else if (tx.type === 'Deposit') {
      updateBalance(tx.asset, (tx.amountCrypto || 0));
    } else if (['External Transfer', 'Bill Payment', 'Internal Transfer', 'Card Payment'].includes(tx.type)) {
      updateBalance('ZAR', -tx.amountZar);
    }
    if (tx.type !== 'Deposit') updateBalance('CURR', 0.001);
    notify(`${tx.type} settled on-chain`, "success");
  };

  const fetchPrices = useCallback(async () => {
    if (!user || isLoadingPrices) return;
    setIsLoadingPrices(true);
    try {
      const cgResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=zar');
      if (cgResponse.ok) {
        const data = await cgResponse.json();
        const newPrices = {
          BTC: data.bitcoin.zar, ETH: data.ethereum.zar, SOL: data.solana.zar,
          USDC: data['usd-coin'].zar, CURR: data.ethereum.zar / 2000, ZAR: 1.00
        };
        setPrices(prev => ({ ...prev, ...newPrices }));
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.warn("Pricing oracle fallback triggered...");
    } finally { setIsLoadingPrices(false); }
  }, [user, isLoadingPrices]);

  const fetchHistoricalData = useCallback(async (asset: AssetType): Promise<{ data: PricePoint[]; source: 'api' | 'fallback'; }> => {
    const currentPrice = prices[asset] || 0;
    const assetIds: Record<AssetType, string | null> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      USDC: 'usd-coin',
      CURR: null,
      ZAR: null
    };

    const updateVolatility = (history: PricePoint[]) => {
      const values = history.map(point => point.price).filter(value => Number.isFinite(value));
      if (values.length === 0) return;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const last = values[values.length - 1] || 1;
      const range = last ? ((max - min) / last) * 100 : 0;
      setAssetVolatility(prev => ({ ...prev, [asset]: Number(range.toFixed(2)) }));
    };

    const buildSyntheticHistory = () => {
      const scaled = MOCK_CHART_DATA.map(p => ({
        ...p, price: p.price * (currentPrice / (MOCK_CHART_DATA[MOCK_CHART_DATA.length - 1].price || 1))
      }));
      updateVolatility(scaled);
      return scaled;
    };

    const assetId = assetIds[asset];
    if (!assetId) {
      return { data: buildSyntheticHistory(), source: 'fallback' };
    }

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${assetId}/market_chart?vs_currency=zar&days=1&interval=hourly`);
      if (!response.ok) throw new Error('COINGECKO_HISTORY_FAILED');
      const data = await response.json();
      const rawPoints: [number, number][] = data?.prices || [];
      if (rawPoints.length === 0) throw new Error('COINGECKO_HISTORY_EMPTY');

      const desiredPoints = 7;
      const step = Math.max(1, Math.floor(rawPoints.length / desiredPoints));
      const sampled: [number, number][] = [];
      for (let i = 0; i < rawPoints.length; i += step) {
        sampled.push(rawPoints[i]);
      }
      const lastPoint = rawPoints[rawPoints.length - 1];
      if (sampled[sampled.length - 1] !== lastPoint) {
        sampled.push(lastPoint);
      }
      const sliced = sampled.slice(0, desiredPoints);
      const history = sliced.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price
      }));

      updateVolatility(history);
      return { data: history, source: 'api' };
    } catch (e) {
      console.warn("History fetch failed, falling back to synthetic data.");
      return { data: buildSyntheticHistory(), source: 'fallback' };
    }
  }, [prices]);

  useEffect(() => {
    if (user && viewState === 'dashboard') {
      fetchPrices();
      const interval = setInterval(fetchPrices, 120000);
      return () => clearInterval(interval);
    }
  }, [fetchPrices, user, viewState]);

  const renderContent = () => {
    if (viewState === 'landing') return <LandingPage onEnter={() => setViewState(user ? 'dashboard' : 'auth')} onShowWhitepaper={() => setShowWhitepaper(true)} onNavigate={(t) => setViewState(t as any)} />;
    if (viewState === 'auth') return <AuthView onLogin={handleLogin} onBack={() => setViewState('landing')} isLoading={isAuthenticating} />;
    if (viewState === 'privacy') return <PrivacyView onBack={() => setViewState(user ? 'dashboard' : 'landing')} />;
    if (viewState === 'security') return <SecurityView onBack={() => setViewState(user ? 'dashboard' : 'landing')} />;
    if (viewState === 'protocol') return <ProtocolView onBack={() => setViewState(user ? 'dashboard' : 'landing')} />;

    switch (activeTab) {
      case 'Swap': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#101620]/40 p-4 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <Activity size={18} className="text-[#39FF14]" />
                   <div className="absolute inset-0 bg-[#39FF14]/20 blur-md rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">MPC Node Pulse</p>
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    {dbStatus === 'connected' ? 'Active Shards: 1,024/1,024' : 'Syncing Shards...'} 
                    <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-[#39FF14]' : 'bg-amber-400 animate-pulse'}`} />
                  </p>
                </div>
             </div>
             <button 
                onClick={() => setIsAiOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-xl text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all group"
             >
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Consult Ci Terminal</span>
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                   Sovereign <span className="text-[#00F0FF]">Settlement.</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl">
                  Non-custodial bridging for high-net-worth users. Verified at {lastUpdated.toLocaleTimeString()}.
                </p>
              </div>
              <PriceChart 
                prices={prices} selectedAsset={selectedAsset} isLoading={isLoadingPrices} 
                lastUpdated={lastUpdated} onFetchHistory={fetchHistoricalData}
              />
              <TransactionLedger transactions={transactions} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 w-full space-y-8">
              <SwapWidget 
                selectedBank={selectedBank} prices={prices} isLoadingPrices={isLoadingPrices} 
                selectedAsset={selectedAsset} onAssetChange={setSelectedAsset}
                onSuccess={addTransaction} onRefresh={fetchPrices} lastUpdated={lastUpdated} assetBalances={balances}
                volatility={assetVolatility[selectedAsset]}
              />
              <div className="bg-[#101620]/50 border border-white/5 rounded-3xl p-6">
                 <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest text-gray-500">Fast Settlement Banks</h3>
                 <BankGrid selectedBank={selectedBank} onSelectBank={setSelectedBank} />
              </div>
            </motion.div>
          </div>
        </div>
      );
      case 'Assets': return <AssetsView prices={prices} balances={balances} user={user} onTransaction={addTransaction} />;
      case 'Cards': return <CardsView />;
      case 'Payments': return <PaymentsView onPayment={addTransaction} initialSavedPayees={savedPayees} onUpdatePayees={setSavedPayees} initialRecurring={recurringPayments} onUpdateRecurring={setRecurringPayments} balances={balances} />;
      case 'Activity': return <ActivityView transactions={transactions} />;
      case 'Settings': return <SettingsView user={user} onUserUpdate={setUser} onResetData={() => { setTransactions([]); notify("Ledger Purged", "info"); }} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white selection:bg-[#00F0FF]/30">
      <Navbar 
        activeTab={activeTab} setActiveTab={setActiveTab} isConnected={!!user} onDisconnect={handleLogout}
        onToggleLanding={() => setViewState(viewState === 'dashboard' ? 'landing' : (user ? 'dashboard' : 'auth'))}
        onNavigate={(t) => setViewState(t as any)} isLandingMode={viewState === 'landing'}
        dbStatus={dbStatus}
      />
      
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, x: 20 }} className="pointer-events-auto bg-[#101620]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-3">
              <div className={`mt-0.5 ${n.type === 'success' ? 'text-[#39FF14]' : n.type === 'error' ? 'text-red-400' : 'text-[#00F0FF]'}`}>
                {n.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <p className="text-sm font-medium flex-1">{n.message}</p>
              <button onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <main className={`${viewState === 'dashboard' || activeTab !== '' ? 'max-w-7xl mx-auto px-4 pt-28 pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div key={viewState + activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AIAdvisor isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} user={user} balances={balances} prices={prices} onRetryHelper={callGeminiWithRetry} />
      {showWhitepaper && <Whitepaper onClose={() => setShowWhitepaper(false)} />}

      <footer className="border-t border-white/5 bg-[#0D121F]/50 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewState('landing')}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#39FF14]" />
            <span className="font-bold tracking-tighter text-xl uppercase">CURRENT</span>
          </div>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] text-center">Protocol V3.0 • Sovereign Vault • {dbStatus.toUpperCase()}</p>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            <button onClick={() => setViewState('privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => setViewState('security')} className="hover:text-white">Security</button>
            <button onClick={() => setShowWhitepaper(true)} className="hover:text-white">Whitepaper</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
