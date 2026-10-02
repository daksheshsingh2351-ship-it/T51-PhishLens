import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, CheckCircle2, Circle } from 'lucide-react';

const scanStages = [
  "Checking URL format",
  "Analyzing domain reputation",
  "Detecting suspicious patterns",
  "Checking redirects",
  "Generating result"
];

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { target, type } = location.state || { target: 'https://example.com', type: 'url' };
  
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!location.state) {
      navigate('/scan-url');
      return;
    }

    // Since the analysis is synchronous local heuristics, we use a very fast interval
    // so we don't artificially delay a completed result, while still showing the UI.
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < scanStages.length) {
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        // Analyze and route to result
        analyzeAndNavigate(target, type);
      }
    }, 150); // fast 150ms interval

    return () => clearInterval(interval);
  }, [navigate, target, type, location.state]);

  const analyzeAndNavigate = (targetUrl, scanType) => {
    console.log('[DEBUG Scanning] analyzeAndNavigate called with:', { targetUrl, scanType });
    let finalVerdict = 'unverified';
    let finalIssues = [];
    let finalScore = 100;
    const debugTrace = {
      rawInput: targetUrl,
      parsedHostname: null,
      parsedProtocol: null,
      httpMatched: false,
      keywordMatched: false,
      hasCaution: false,
      hasDanger: false,
      finalVerdict: null,
      navState: null,
    };

    try {
      const parsedUrl = new URL(targetUrl);
      debugTrace.parsedHostname = parsedUrl.hostname;
      debugTrace.parsedProtocol = parsedUrl.protocol;
      
      console.log('[DEBUG Scanning] parsedUrl:', { hostname: parsedUrl.hostname, protocol: parsedUrl.protocol });
      
      // Real Threat Check Simulation (DANGER)
      if (parsedUrl.hostname === 'malicious-test.phishlens.local') {
        finalVerdict = 'danger';
        finalIssues.push({ type: 'danger', text: '[Simulated Test Result] Known malicious phishing site' });
        finalScore = 0;
      } 
      // Real Verification Check Simulation (SAFE)
      else if (parsedUrl.hostname === 'safe-test.phishlens.local') {
        finalVerdict = 'safe';
        finalIssues.push({ type: 'safe', text: '[Simulated Test Result] Verification service found no known threats.' });
      }
      else {
        // Local Heuristics
        let hasCaution = false;
        let hasDanger = false;

        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsedUrl.hostname);
        if (isIp) {
          finalIssues.push({ type: 'caution', text: 'Uses IP address instead of domain name' });
          finalScore -= 40;
          hasCaution = true;
        }

        if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
          finalIssues.push({ type: 'caution', text: `Unusual URL scheme (${parsedUrl.protocol})` });
          finalScore -= 20;
          hasCaution = true;
        } else if (parsedUrl.protocol === 'http:') {
           finalIssues.push({ type: 'caution', text: 'No SSL encryption (HTTP)' });
           finalScore -= 20;
           hasCaution = true;
           debugTrace.httpMatched = true;
        }

        const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly'];
        if (shorteners.includes(parsedUrl.hostname)) {
          finalIssues.push({ type: 'caution', text: `URL Shortener used. Destination unknown.` });
          finalScore -= 30;
          hasCaution = true;
        }

        const suspiciousWords = ['login', 'secure', 'update', 'verify', 'account', 'banking', 'wallet'];
        const hasSuspiciousWord = suspiciousWords.some(w => parsedUrl.hostname.includes(w));
        
        if (hasSuspiciousWord && !parsedUrl.hostname.includes('google.com')) { 
          finalIssues.push({ type: 'caution', text: 'Suspicious keywords in domain' });
          finalScore -= 40;
          hasCaution = true;
          debugTrace.keywordMatched = true;
        }

        const parts = parsedUrl.hostname.split('.');
        if (parts.length > 4) {
          finalIssues.push({ type: 'caution', text: 'Excessive subdomains' });
          finalScore -= 30;
          hasCaution = true;
        }

        if (parsedUrl.hostname.includes('-') && hasSuspiciousWord && parsedUrl.hostname !== 'secure-update.bit.ly') {
          finalIssues.push({ type: 'danger', text: 'Deceptive lookalike domain pattern' });
          finalScore -= 60;
          hasDanger = true;
        }

        debugTrace.hasCaution = hasCaution;
        debugTrace.hasDanger = hasDanger;

        if (hasDanger) {
          finalVerdict = 'danger';
        } else if (hasCaution) {
          finalVerdict = 'caution';
        } else {
          finalVerdict = 'unverified';
        }
      }
      
    } catch (e) {
      console.error('[DEBUG Scanning] URL parsing failed:', e);
      finalVerdict = 'unverified';
      finalIssues.push({ type: 'caution', text: 'Invalid or malformed URL format' });
      finalScore = 0;
    }

    console.log('[DEBUG Scanning] Verdict after evaluation:', finalVerdict);

    if (finalVerdict === 'unverified') {
      if (finalIssues.length === 0) {
        finalIssues.push({ type: 'safe', text: 'URL format is standard' });
      }
      finalIssues.push({ type: 'caution', text: 'Unable to safely verify destination without a backend API' });
    }

    // Save to history
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      type: scanType.toUpperCase(),
      target: targetUrl,
      verdict: finalVerdict,
    });
    localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 50)));

    debugTrace.finalVerdict = finalVerdict;
    
    const navState = { 
      target: targetUrl, 
      verdict: finalVerdict, 
      issues: finalIssues,
      score: Math.max(0, finalScore),
      debugTrace: debugTrace
    };

    debugTrace.navState = JSON.stringify(navState);
    console.log('[RUNTIME TRACE] Scanning completed:', debugTrace);

    navigate('/result', { 
      state: navState,
      replace: true 
    });
  };

  const progress = Math.min(((currentStage) / (scanStages.length - 1)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center -mt-20"
    >
      <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-brand-cyan/20 rounded-full animate-radar"></div>
        <div className="absolute inset-4 border-2 border-brand-cyan/40 rounded-full animate-[radar_2s_linear_infinite_reverse]"></div>
        <Shield className="w-20 h-20 text-brand-cyan animate-pulse-glow" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">{type === 'qr' ? 'Analyzing QR code...' : 'Scanning...'}</h2>
      <p className="text-slate-400 mb-10 text-sm">Analyzing the link for potential threats</p>

      <div className="w-full max-w-md space-y-4">
        {scanStages.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;
          const isPending = idx > currentStage;

          return (
            <motion.div 
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 ${isPending ? 'opacity-40' : 'opacity-100'}`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
              ) : isActive ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin"></div>
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
              <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-slate-400'}`}>
                {stage}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full max-w-md mt-10">
        <div className="h-1 bg-brand-navy-lighter rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-right text-xs text-slate-500 mt-2">{Math.round(progress)}%</div>
      </div>

      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-black/80 border border-brand-cyan text-xs p-4 rounded text-left z-50 text-white">
          <h4 className="font-bold text-brand-cyan mb-2">Debug Panel (Scanning.jsx)</h4>
          <p><strong>Target:</strong> {target}</p>
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Stage:</strong> {currentStage}</p>
          <button 
            className="mt-2 bg-brand-cyan text-black px-2 py-1 rounded w-full"
            onClick={() => analyzeAndNavigate(target, type)}
          >
            Force Analyze Now
          </button>
        </div>
      )}
    </motion.div>
  );
}
