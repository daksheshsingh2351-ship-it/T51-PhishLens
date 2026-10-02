import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Network, AlertTriangle, ArrowDown } from 'lucide-react';

const mockChain = [
  { url: 'short.link/abc123', type: 'Original (shortened link)', status: 'info' },
  { url: 'redirect.example.com', type: 'Intermediate redirect', status: 'info' },
  { url: 'login-sbi-secure.com', type: 'Suspicious destination', status: 'danger' },
  { url: '192.168.1.5', type: 'Blocked (private IP)', status: 'danger' },
];

export default function RedirectAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Redirect Chain Analysis</h2>
        <p className="text-slate-400">Trace the path a link takes before reaching its final destination.</p>
      </div>

      <div className="glass-panel p-8 max-w-2xl w-full">
        <div className="flex items-center gap-3 p-4 bg-brand-amber/10 border border-brand-amber/30 rounded-xl mb-8">
          <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0" />
          <p className="text-sm text-brand-amber">This is a simulated redirect chain for demonstration purposes. True redirect tracing requires a backend proxy.</p>
        </div>

        <div className="space-y-2 relative">
          {mockChain.map((node, idx) => (
            <div key={idx} className="relative z-10 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className={`p-4 rounded-xl border flex items-center gap-4 ${
                  node.status === 'danger' ? 'bg-brand-red/10 border-brand-red/30 text-brand-red' : 'bg-brand-navy-lighter border-brand-cyan-dim/50 text-brand-cyan'
                }`}
              >
                <Network className="w-5 h-5 opacity-70" />
                <div>
                  <div className={`font-semibold ${node.status === 'danger' ? 'text-brand-red' : 'text-slate-200'}`}>{node.url}</div>
                  <div className={`text-xs ${node.status === 'danger' ? 'text-brand-red/70' : 'text-slate-400'}`}>{node.type}</div>
                </div>
              </motion.div>
              
              {idx < mockChain.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className="w-5 h-5 text-slate-600 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
