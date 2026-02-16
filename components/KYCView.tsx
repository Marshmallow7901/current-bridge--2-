
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Building2, ChevronRight, CheckCircle2, Upload, FileText, Info } from 'lucide-react';
import { User as UserType } from '../types';

interface KYCViewProps {
  user: UserType;
  onComplete: (status: 'verified' | 'business_verified') => void;
}

const KYCView: React.FC<KYCViewProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState<'choose' | 'upload' | 'verifying'>('choose');
  const [tier, setTier] = useState<'individual' | 'business' | null>(null);

  const startVerification = (selectedTier: 'individual' | 'business') => {
    setTier(selectedTier);
    setStep('upload');
  };

  const submitDocuments = () => {
    setStep('verifying');
    setTimeout(() => {
      onComplete(tier === 'individual' ? 'verified' : 'business_verified');
    }, 3000);
  };

  if (step === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-24 h-24 mx-auto">
             <div className="absolute inset-0 border-4 border-[#00F0FF]/20 rounded-full" />
             <div className="absolute inset-0 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="text-[#00F0FF]" size={32} />
             </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Verifying Identity</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Our AI protocols are scanning your documentation. This will take a few seconds.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto pt-40 pb-20 px-6">
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Verification Required</h1>
        <p className="text-gray-500 text-lg">Current follows strict KYC and KYB compliance to protect the ecosystem.</p>
      </div>

      {step === 'choose' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button 
            whileHover={{ y: -8 }}
            onClick={() => startVerification('individual')}
            className="p-10 bg-[#101620]/50 border border-white/5 rounded-[40px] text-left group hover:border-[#00F0FF]/30 transition-all"
          >
            <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <User className="text-[#00F0FF]" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Individual KYC</h3>
            <p className="text-gray-500 mb-8 text-sm">For personal accounts. Requires ID and Proof of Residence.</p>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#00F0FF] uppercase tracking-widest">
              Start Personal <ChevronRight size={14} />
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ y: -8 }}
            onClick={() => startVerification('business')}
            className="p-10 bg-[#101620]/50 border border-white/5 rounded-[40px] text-left group hover:border-[#39FF14]/30 transition-all"
          >
            <div className="w-16 h-16 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Building2 className="text-[#39FF14]" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Business KYB</h3>
            <p className="text-gray-500 mb-8 text-sm">For institutional bridging. Requires CIPC Registration & Tax Docs.</p>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#39FF14] uppercase tracking-widest">
              Start Corporate <ChevronRight size={14} />
            </div>
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#101620]/50 border border-white/5 rounded-[40px] p-12 max-w-2xl mx-auto"
        >
          <button onClick={() => setStep('choose')} className="text-xs text-gray-500 hover:text-white mb-8">← BACK</button>
          
          <h2 className="text-2xl font-bold mb-2">Upload Documentation</h2>
          <p className="text-sm text-gray-500 mb-10">Upload high-resolution scans for instant AI approval.</p>

          <div className="space-y-6">
            <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-[#00F0FF]/50 transition-all cursor-pointer bg-[#0A0E17]/50 flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#00F0FF]/10 transition-colors">
                <Upload size={24} className="text-gray-500 group-hover:text-[#00F0FF]" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Drag files here</p>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">PDF, JPG or PNG (MAX 10MB)</p>
              </div>
            </div>

            <div className="space-y-4">
               {[
                 tier === 'individual' ? 'National ID / Passport' : 'Company Registration Certificate',
                 tier === 'individual' ? 'Proof of Address' : 'Tax Clearance Certificate',
                 tier === 'individual' ? 'Face Scan Verification' : 'Beneficial Ownership Form'
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-500">
                       <FileText size={16} />
                     </div>
                     <span className="text-sm font-medium text-gray-300">{item}</span>
                   </div>
                   <div className="text-[10px] font-mono text-[#39FF14] font-bold">READY</div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3">
              <Info className="text-amber-500 flex-shrink-0" size={18} />
              <p className="text-[11px] text-amber-500/80 leading-relaxed">
                Dummy accounts are strictly prohibited. Attempting to bypass verification with falsified data will result in a permanent system ban.
              </p>
            </div>

            <button 
              onClick={submitDocuments}
              className="w-full py-5 bg-[#00F0FF] text-[#0A0E17] font-bold rounded-2xl shadow-lg mt-4"
            >
              Submit for AI Verification
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default KYCView;
