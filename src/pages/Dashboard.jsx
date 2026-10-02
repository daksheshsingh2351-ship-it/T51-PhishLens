import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Link2, QrCode, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col w-full py-10 my-auto"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">
        <motion.div variants={itemVariants} className="flex-1 space-y-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.15] text-white tracking-tight drop-shadow-2xl">
            Think Before You Click.<br/>
            <span className="text-[#00e5ff] glow-text inline-block mt-2">Scan. Detect. Stay Safe.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
            PhishLens helps you identify potentially malicious links and QR codes before you interact with them. Your security is just a scan away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-8">
            <button
              onClick={() => navigate('/scan-url')}
              className="group relative flex flex-col justify-between p-8 glass-panel overflow-hidden flex-1 text-left min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/15 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col gap-6 h-full">
                <div className="bg-[#00e5ff]/20 w-16 h-16 rounded-2xl flex items-center justify-center text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.2)] group-hover:scale-110 group-hover:bg-[#00e5ff] group-hover:text-[#050B14] transition-all duration-300">
                  <Link2 className="w-8 h-8" strokeWidth={2} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-white mb-2 tracking-wide group-hover:text-[#00e5ff] transition-colors">Scan URL</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed pr-8">Instantly analyze any link for phishing threats, deceptive domains, and hidden dangers.</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] group-hover:border-[#00e5ff] group-hover:bg-[#00e5ff]/10 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            <button
              onClick={() => navigate('/scan-qr')}
              className="group relative flex flex-col justify-between p-8 glass-panel overflow-hidden flex-1 text-left min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/15 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col gap-6 h-full">
                <div className="bg-[#00e5ff]/20 w-16 h-16 rounded-2xl flex items-center justify-center text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.2)] group-hover:scale-110 group-hover:bg-[#00e5ff] group-hover:text-[#050B14] transition-all duration-300">
                  <QrCode className="w-8 h-8" strokeWidth={2} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-white mb-2 tracking-wide group-hover:text-[#00e5ff] transition-colors">Scan QR Code</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed pr-8">Extract and verify the contents of QR codes safely before opening them on your device.</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] group-hover:border-[#00e5ff] group-hover:bg-[#00e5ff]/10 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex-1 flex justify-center items-center relative mt-10 lg:mt-0">
          {/* Animated Shield Graphic */}
          <div className="relative w-[450px] h-[450px] flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute inset-0 border border-[#00e5ff]/15 rounded-full"></div>
            <div className="absolute inset-12 border border-[#00e5ff]/25 rounded-full shadow-[0_0_30px_rgba(0,229,255,0.05)]"></div>
            <div className="absolute inset-24 border-[1.5px] border-[#00e5ff]/40 rounded-full shadow-[0_0_50px_rgba(0,229,255,0.15)]"></div>
            
            {/* Glowing Dots on Rings */}
            <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-[#00e5ff] rounded-full shadow-[0_0_10px_#00e5ff] animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[15%] w-2 h-2 bg-[#00e5ff] rounded-full shadow-[0_0_12px_#00e5ff] animate-pulse delay-75"></div>
            <div className="absolute top-[40%] right-[5%] w-1 h-1 bg-[#00e5ff] rounded-full shadow-[0_0_8px_#00e5ff] animate-pulse delay-150"></div>
            <div className="absolute bottom-[10%] left-[30%] w-1.5 h-1.5 bg-[#00e5ff] rounded-full shadow-[0_0_10px_#00e5ff] animate-pulse delay-300"></div>
            
            {/* Core Shield Glow */}
            <div className="absolute w-40 h-40 bg-[#00e5ff] rounded-full blur-[100px] opacity-25 animate-pulse"></div>

            <motion.div 
              animate={{ 
                y: [0, -12, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <ShieldCheck className="w-40 h-40 shrink-0 glow-icon" fill="#00e5ff" stroke="#050B14" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
