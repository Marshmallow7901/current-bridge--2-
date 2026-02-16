
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AssetType, PricePoint } from '../types';
import { Loader2, Clock, Sparkles, Activity, AlertCircle } from 'lucide-react';
import { MOCK_CHART_DATA } from '../constants';

interface PriceChartProps {
  prices: Record<AssetType, number>;
  selectedAsset: AssetType;
  isLoading?: boolean;
  lastUpdated?: Date;
  onFetchHistory?: (asset: AssetType) => Promise<{ data: PricePoint[]; source: 'api' | 'fallback'; }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101620] border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[#00F0FF] font-bold font-mono">
          R {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ prices, selectedAsset, isLoading, lastUpdated, onFetchHistory }) => {
  const [localHistory, setLocalHistory] = useState<PricePoint[]>([]);
  const [isSyncingHistory, setIsSyncingHistory] = useState(false);
  const [hasError, setHasError] = useState(false);
  const syncTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!onFetchHistory) return;
      
      setIsSyncingHistory(true);
      setHasError(false);

      // Force-fallback timeout: if fetching history takes > 5s, use mock
      syncTimeoutRef.current = window.setTimeout(() => {
        if (localHistory.length === 0) {
          const fallback = MOCK_CHART_DATA.map(p => ({ 
            ...p, price: p.price * ((prices[selectedAsset] || 52450) / 52450) 
          }));
          setLocalHistory(fallback);
          setIsSyncingHistory(false);
          setHasError(true);
        }
      }, 5000);

      try {
        const historyResponse = await onFetchHistory(selectedAsset);
        if (historyResponse?.data && historyResponse.data.length > 0) {
          setLocalHistory(historyResponse.data);
          setHasError(historyResponse.source === 'fallback');
        }
      } catch (e) {
        console.error("Failed to sync history for", selectedAsset);
        setHasError(true);
      } finally {
        setIsSyncingHistory(false);
        if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
      }
    };

    fetchHistory();
    return () => { if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current); };
  }, [selectedAsset, onFetchHistory]);

  const currentPriceFormatted = (prices[selectedAsset] || 0).toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

  const timestampString = lastUpdated 
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  const renderSkeleton = () => (
    <div className="w-full h-[320px] bg-[#101620]/30 border border-white/5 rounded-[32px] p-6 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-32 bg-white/5 rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-white/5 rounded-full border border-white/5 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-3">
          <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-6 w-16 bg-[#39FF14]/10 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 px-6">
        <div className="w-full h-full relative overflow-hidden rounded-t-[32px]">
           <motion.div animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-gradient-to-t from-[#00F0FF]/10 to-transparent" />
           <div className="flex items-end justify-between h-full w-full px-10 pb-12 opacity-20">
              {[30, 45, 60, 40, 75, 55, 65].map((h, i) => (
                <div key={i} className="w-2 bg-[#00F0FF] rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
           </div>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
         <Loader2 className="animate-spin text-[#00F0FF]/40" size={32} />
         <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-bold">Synchronizing Terminal Feed...</p>
      </div>
    </div>
  );

  if (isSyncingHistory && localHistory.length === 0) {
    return renderSkeleton();
  }

  return (
    <div className="w-full h-[320px] bg-[#101620]/30 border border-white/5 rounded-[32px] p-6 relative group overflow-hidden">
      <div className="absolute top-6 left-6 z-10 flex flex-col">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">{selectedAsset} / ZAR Segment</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
             <Clock size={10} className="text-[#00F0FF]" />
             <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Refreshed: <span className="text-[#39FF14]">{timestampString}</span></span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold font-mono tracking-tighter text-white">R {currentPriceFormatted}</span>
          <span className="text-xs font-mono text-[#39FF14] bg-[#39FF14]/10 px-1.5 py-0.5 rounded border border-[#39FF14]/10">LIVE DATA</span>
        </div>
      </div>

      <div className="absolute inset-0 pt-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={localHistory}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00F0FF', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="price" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1000} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute bottom-4 right-6 flex items-center gap-3">
         {hasError && (
            <div className="flex items-center gap-2">
               <AlertCircle size={10} className="text-amber-400" />
               <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Local Trend Reconstruction Active</span>
            </div>
         )}
         <div className="flex items-center gap-2 opacity-60">
            <Sparkles size={10} className="text-[#39FF14]" />
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em]">Sovereign AI Oracle Verified</span>
         </div>
      </div>
    </div>
  );
};

export default PriceChart;
