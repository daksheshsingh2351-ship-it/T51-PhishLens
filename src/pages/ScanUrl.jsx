import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link2, AlertCircle } from 'lucide-react';

export default function ScanUrl() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL to scan.');
      return;
    }
    try {
      new URL(url); // basic validation
      navigate('/scanning', { state: { target: url, type: 'url' } });
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com).');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Scan URL</h2>
      <p className="text-slate-400 mb-10">Enter a link to check for potential threats, phishing attempts, and suspicious activity.</p>
      
      <div className="glass-panel p-8 max-w-3xl w-full">
        <form onSubmit={handleScan} className="flex flex-col gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              className="block w-full pl-12 pr-32 py-4 bg-brand-navy-lighter/50 border border-brand-cyan-dim rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all"
              placeholder="https://example.com"
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-brand-cyan hover:bg-cyan-400 text-brand-navy font-semibold rounded-lg transition-colors"
            >
              Scan URL
            </button>
          </div>
          {error && <p className="text-brand-red text-sm">{error}</p>}
        </form>

        <div className="mt-8 flex flex-col sm:flex-row gap-8">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-3">Quick examples:</p>
            <div className="flex flex-wrap gap-3">
              {['https://google.com', 'http://bit.ly/abc', 'https://upi-payment.in'].map((example) => (
                <button
                  key={example}
                  onClick={() => setUrl(example)}
                  className="px-4 py-2 rounded-lg bg-brand-navy-lighter hover:bg-brand-navy border border-transparent hover:border-brand-cyan/50 text-sm text-slate-300 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 border-t sm:border-t-0 sm:border-l border-brand-navy-lighter/30 pt-6 sm:pt-0 sm:pl-8">
            <p className="text-sm text-brand-cyan/80 font-medium mb-3">Simulated API Tests:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setUrl('https://safe-test.phishlens.local')}
                className="px-4 py-2 rounded-lg bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-sm text-[#00e5ff] transition-colors"
              >
                Simulated SAFE
              </button>
              <button
                onClick={() => setUrl('https://malicious-test.phishlens.local')}
                className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-sm text-red-400 transition-colors"
              >
                Simulated DANGER
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 p-4 bg-brand-navy-lighter rounded-xl border border-brand-navy flex gap-4">
          <AlertCircle className="w-6 h-6 text-brand-amber shrink-0" />
          <div>
            <h4 className="font-semibold text-brand-amber text-sm mb-1">Important</h4>
            <p className="text-sm text-slate-400">Do not enter your passwords, OTPs, or payment PINs on suspicious websites, even if they look legitimate.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
