import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ShieldAlert, ExternalLink, Info, CheckCircle2, ShieldQuestion } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  
  const { target, verdict, issues, score, debugTrace } = location.state || { 
    target: 'Unknown', 
    verdict: 'safe', 
    issues: [], 
    score: 100,
    debugTrace: null
  };


  if (!location.state) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>No scan result available. <Link to="/scan-url" className="text-brand-cyan">Go scan something.</Link></p>
      </div>
    );
  }

  const verdictConfig = {
    safe: {
      color: 'brand-green',
      bgClass: 'bg-brand-green/10',
      borderClass: 'border-brand-green/30',
      textClass: 'text-brand-green',
      icon: ShieldCheck,
      title: 'SAFE',
      subtitle: 'Verification service found no known threats (Note: safety is never 100% guaranteed)',
    },
    caution: {
      color: 'brand-amber',
      bgClass: 'bg-brand-amber/10',
      borderClass: 'border-brand-amber/30',
      textClass: 'text-brand-amber',
      icon: AlertTriangle,
      title: 'CAUTION',
      subtitle: 'Suspicious heuristics detected. Unconfirmed risk.',
    },
    danger: {
      color: 'brand-red',
      bgClass: 'bg-brand-red/10',
      borderClass: 'border-brand-red/30',
      textClass: 'text-brand-red',
      icon: ShieldAlert,
      title: 'DANGER',
      subtitle: 'Confirmed malicious or extremely high risk',
    },
    unverified: {
      color: 'slate',
      bgClass: 'bg-slate-500/10',
      borderClass: 'border-slate-500/30',
      textClass: 'text-slate-400',
      icon: ShieldQuestion,
      title: 'UNVERIFIED',
      subtitle: 'No known threats, but safety cannot be guaranteed',
    }
  };

  const config = verdictConfig[verdict] || verdictConfig['unverified'];
  const Icon = config.icon;

  console.log('[RUNTIME TRACE] Result.jsx Render:', {
    locationState: location.state,
    extractedVerdict: verdict,
    configChosen: config
  });

  useEffect(() => {
    if (verdict === 'danger' && !isAlertDismissed) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
        console.warn('Audio context not allowed or supported');
      }
    }
  }, [verdict, isAlertDismissed]);

  return (
    <>
      <AnimatePresence>
        {verdict === 'danger' && !isAlertDismissed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-brand-navy border border-brand-red rounded-2xl max-w-lg w-full p-8 shadow-[0_0_50px_rgba(255,51,102,0.3)] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-brand-red animate-pulse"></div>
              
              <div className="p-4 bg-brand-red/10 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-brand-red/20 rounded-full animate-ping"></div>
                <ShieldAlert className="w-16 h-16 text-brand-red relative z-10" />
              </div>
              
              <h2 className="text-3xl font-black text-brand-red mb-2 uppercase tracking-widest">Danger Detected</h2>
              <p className="text-slate-300 mb-6">This destination has been flagged as a confirmed threat. Do not proceed.</p>
              
              <div className="w-full bg-black/50 border border-brand-red/30 rounded-lg p-3 mb-6 text-left break-all text-sm text-slate-400">
                <strong className="text-white block mb-1">Destination:</strong>
                {target}
              </div>

              <button 
                onClick={() => setIsAlertDismissed(true)}
                className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors tracking-wide"
              >
                DISMISS ALERT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center pt-8"
      >
      <div className={cn("w-full max-w-2xl rounded-2xl border p-8 shadow-2xl transition-colors duration-500", config.bgClass, config.borderClass)}>
        
        <div className="flex flex-col items-center mb-8">
          <div className={cn("p-4 rounded-full mb-4 bg-brand-navy shadow-lg shadow-black/50 border", config.borderClass)}>
            <Icon className={cn("w-12 h-12", config.textClass)} />
          </div>
          <h2 className={cn("text-3xl font-bold tracking-wider mb-2", config.textClass)}>{config.title}</h2>
          <p className="text-slate-300">{config.subtitle}</p>
        </div>

        <div className="bg-brand-navy/60 border border-brand-navy-lighter rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
          <div className="truncate flex-1 text-slate-200">{target}</div>
          <a href={target} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-brand-navy-lighter rounded-lg text-slate-400 hover:text-white transition-colors" title="Open in new tab">
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Security Check Results</h3>
          <ul className="space-y-3">
            {issues.map((issue, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-3 text-sm"
              >
                {issue.type === 'safe' && <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />}
                {issue.type === 'caution' && <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0" />}
                {issue.type === 'danger' && <AlertTriangle className="w-5 h-5 text-brand-red shrink-0" />}
                <span className="text-slate-300 pt-0.5">{issue.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-3 p-4 bg-brand-navy/50 rounded-xl border border-brand-navy-lighter mb-8">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            API keys and threat-intelligence credentials should be kept on the backend in environment variables. Because this is a frontend-only demo without a backend proxy, local heuristic checks are marked as CAUTION or UNVERIFIED, as we cannot safely verify the destination without executing it. Confirmed malicious threats require an authoritative API check.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/scan-url')}
            className={cn("flex-1 py-3 px-4 rounded-xl font-semibold bg-transparent border hover:bg-brand-navy/50 transition-colors", config.borderClass, config.textClass)}
          >
            Scan Another
          </button>
          <button
            onClick={() => navigate('/history')}
            className={cn("flex-1 py-3 px-4 rounded-xl font-semibold text-brand-navy transition-colors", 
              verdict === 'safe' ? 'bg-brand-green hover:bg-green-400' :
              verdict === 'caution' ? 'bg-brand-amber hover:bg-amber-400' :
              verdict === 'unverified' ? 'bg-slate-400 hover:bg-slate-300' : 'bg-brand-red hover:bg-red-400'
            )}
          >
            View History
          </button>
        </div>

      </div>
    </motion.div>

    {import.meta.env.DEV && (
      <div className="fixed bottom-4 right-4 max-w-sm w-full bg-black/90 border border-brand-cyan text-xs p-4 rounded text-left z-50 text-white shadow-2xl overflow-y-auto max-h-96">
        <h4 className="font-bold text-brand-cyan mb-2 border-b border-brand-cyan/30 pb-2">Debug Trace (Result.jsx)</h4>
        <div className="space-y-1 mb-2">
          <p><span className="text-slate-400">Target:</span> {target}</p>
          <p><span className="text-slate-400">Raw location.state.verdict:</span> {location.state?.verdict || 'none'}</p>
          <p><span className="text-slate-400">Extracted verdict:</span> {verdict}</p>
          <p><span className="text-slate-400">Config Matched:</span> {config?.title || 'None'}</p>
        </div>
        {debugTrace && (
          <div className="mt-2 pt-2 border-t border-brand-cyan/30">
            <h5 className="font-bold text-brand-amber mb-1">Scanning.jsx Trace</h5>
            <pre className="text-[10px] bg-black p-2 rounded text-green-400 whitespace-pre-wrap break-words">
              {JSON.stringify(debugTrace, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )}

    </>
  );
}
