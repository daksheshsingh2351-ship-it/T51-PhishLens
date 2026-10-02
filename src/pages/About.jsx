import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <h2 className="text-3xl font-bold text-white mb-6">About PhishLens</h2>
      
      <div className="glass-panel p-8 max-w-4xl prose prose-invert prose-p:text-slate-300 prose-h3:text-white prose-a:text-brand-cyan">
        <h3>What is PhishLens?</h3>
        <p>
          PhishLens is a smart cybersecurity alarm designed to help users identify potentially dangerous URLs and QR codes before they click a suspicious link, share sensitive information, or make a risky payment.
        </p>

        <h3>How it Works (Demo Mode)</h3>
        <p>
          This version of PhishLens is a frontend demonstration. It uses client-side heuristics to detect common patterns found in phishing URLs, such as:
        </p>
        <ul>
          <li>Suspicious keywords (login, update, secure) on non-standard domains.</li>
          <li>Lack of HTTPS (HTTP).</li>
          <li>Known URL shorteners often used to mask malicious links.</li>
          <li>Excessive subdomains used to mimic legitimate sites.</li>
        </ul>

        <h3>Privacy & Limitations</h3>
        <p>
          <strong>No Real-time Threat Intelligence:</strong> Because this is a frontend-only application, it cannot query live threat intelligence databases (like Google Safe Browsing or VirusTotal) without exposing API keys.
        </p>
        <p>
          <strong>No Actual Link Following:</strong> It does not actually follow redirect chains or fetch the content of the target URL to analyze its HTML, as this would require a backend proxy to avoid CORS and security issues.
        </p>
        <p>
          <strong>Privacy:</strong> All analysis happens in your browser. No URLs or uploaded QR images are sent to any external server.
        </p>
      </div>
    </motion.div>
  );
}
