import React from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, CheckSquare, ShieldQuestion } from 'lucide-react';

const tips = [
  {
    icon: EyeOff,
    title: "Never share your passwords",
    desc: "Legitimate companies will never ask for your password via email, SMS, or phone call."
  },
  {
    icon: Lock,
    title: "Don't enter OTPs or PINs",
    desc: "No trusted website will ask for your OTP or payment PIN just to 'receive' money."
  },
  {
    icon: CheckSquare,
    title: "Check the URL carefully",
    desc: "Look for correct spelling and secure connections (https://). Scammers often use lookalike domains (e.g. paytm-secure.com instead of paytm.com)."
  },
  {
    icon: ShieldQuestion,
    title: "Be cautious with QR codes",
    desc: "Scammers can paste fake QR codes over real ones to steal your payment. Always verify the payee name before sending money."
  }
];

export default function SafetyTips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Stay Safe Online</h2>
      <p className="text-slate-400 mb-10">Follow these simple tips to avoid phishing scams and protect your personal information.</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 hover:border-brand-cyan/50 transition-colors group"
          >
            <div className="flex items-start gap-5">
              <div className="p-3 bg-brand-navy-lighter rounded-xl group-hover:bg-brand-cyan/20 group-hover:text-brand-cyan transition-colors text-slate-400">
                <tip.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-cyan transition-colors">{tip.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
