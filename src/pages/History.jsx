import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setHistory(data);
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your scan history?')) {
      localStorage.setItem('scanHistory', JSON.stringify([]));
      setHistory([]);
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'safe': return <ShieldCheck className="w-4 h-4 text-brand-green" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-brand-amber" />;
      case 'danger': return <ShieldAlert className="w-4 h-4 text-brand-red" />;
      default: return null;
    }
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'safe': return 'text-brand-green bg-brand-green/10 border-brand-green/20';
      case 'caution': return 'text-brand-amber bg-brand-amber/10 border-brand-amber/20';
      case 'danger': return 'text-brand-red bg-brand-red/10 border-brand-red/20';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Scan History</h2>
          <p className="text-slate-400">Your recent scans (stored locally).</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      <div className="glass-panel overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">No scan history available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-navy-lighter/80 border-b border-brand-cyan-dim/30">
                  <th className="p-4 text-sm font-semibold text-slate-300">Date & Time</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Type</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Target</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-800 hover:bg-brand-navy-lighter/50 transition-colors"
                  >
                    <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={item.target}>
                      {item.target}
                    </td>
                    <td className="p-4">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize", getVerdictStyle(item.verdict))}>
                        {getVerdictIcon(item.verdict)}
                        {item.verdict}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
