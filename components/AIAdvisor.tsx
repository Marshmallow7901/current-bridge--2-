
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Loader2, BrainCircuit, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { User, AssetBalance, AssetType } from '../types';

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  balances: AssetBalance[];
  prices: Record<AssetType, number>;
  onRetryHelper?: (prompt: string, jsonMode?: boolean) => Promise<string | undefined>;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ isOpen, onClose, user, balances, prices, onRetryHelper }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `Identity confirmed. Greetings, ${user?.name || 'User'}. I am Ci. I've scanned the ZAR bridge and your local wallet fragments. How shall we optimize your liquidity today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const prompt = `You are Ci (Current Intelligence), a high-end AI financial assistant for a crypto-to-fiat bridge.
      Context: 
      - User: ${user?.name}
      - Balances: ${balances.map(b => `${b.balance} ${b.symbol}`).join(', ')}
      - Current Prices (ZAR): ${Object.entries(prices).map(([s, p]) => `${s}: ${p}`).join(', ')}
      User asked: "${userMsg}"
      Keep your answer sophisticated, technical, yet helpful. Use 'JetBrains Mono' styling (implicitly via text). Mention fund safety and MPC node status if relevant. Max 3 sentences.`;

      let responseText: string | undefined;
      
      if (onRetryHelper) {
        responseText = await onRetryHelper(prompt);
      } else {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) throw new Error('MISSING_GEMINI_KEY');
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt
        });
        responseText = response.text;
      }

      setMessages(prev => [...prev, { role: 'ai', text: responseText || "I apologize, my node connection flickered. Please repeat your query." }]);
    } catch (error: any) {
      const errorMsg = error?.message?.includes('429') 
        ? "My processing units are currently over-leveraged by high network traffic. Please wait a moment while I sync with a quieter node."
        : error?.message?.includes('MISSING_GEMINI_KEY')
          ? "Ci is offline. Please configure your Gemini API key to enable advisor responses."
          : "Error syncing with sovereign nodes. Please check your terminal connection.";
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-end p-4 md:p-8 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A0E17]/40 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div 
            initial={{ x: 100, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.95 }}
            className="w-full max-w-md h-[80vh] bg-[#101620]/95 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F0FF] via-[#39FF14] to-[#00F0FF]" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#39FF14] flex items-center justify-center text-[#0A0E17]">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-widest uppercase">Ci Terminal</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Encrypted Session</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === 'ai' 
                      ? 'bg-white/5 border border-white/5 text-gray-300' 
                      : 'bg-[#00F0FF] text-[#0A0E17] font-bold shadow-[0_4px_15px_rgba(0,240,255,0.2)]'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                    <Loader2 size={16} className="animate-spin text-[#00F0FF]" />
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights Bar */}
            <div className="px-6 py-2 flex gap-2">
               <div className="flex-1 p-2 bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-xl flex items-center gap-2">
                  <Zap size={10} className="text-[#39FF14]" />
                  <span className="text-[8px] font-mono text-gray-500 uppercase font-bold">ETH Volatility: Low</span>
               </div>
               <div className="flex-1 p-2 bg-[#00F0FF]/5 border border-[#00F0FF]/10 rounded-xl flex items-center gap-2">
                  <ShieldCheck size={10} className="text-[#00F0FF]" />
                  <span className="text-[8px] font-mono text-gray-500 uppercase font-bold">Nodes Synced</span>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Ci about your bridge strategy..."
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm focus:outline-none focus:border-[#00F0FF]/50 transition-all font-mono"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#00F0FF] text-[#0A0E17] rounded-xl hover:scale-105 transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIAdvisor;
