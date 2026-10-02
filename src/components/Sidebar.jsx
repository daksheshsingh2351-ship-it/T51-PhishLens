import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, ShieldCheck, Home, Link2, QrCode, History, Lightbulb, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/scan-url', label: 'Scan URL', icon: Link2 },
  { path: '/scan-qr', label: 'Scan QR', icon: QrCode },
  { path: '/history', label: 'History', icon: History },
  { path: '/safety-tips', label: 'Safety Tips', icon: Lightbulb },
  { path: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-transparent border-r border-brand-navy-lighter/30 flex flex-col h-full shrink-0">
      <div className="pt-8 px-6 pb-2 flex items-center gap-3">
        <ShieldCheck className="w-10 h-10 shrink-0 glow-icon" fill="#00e5ff" stroke="#050B14" strokeWidth={1.5} />
        <h1 className="text-[22px] font-extrabold text-white tracking-wide drop-shadow-md whitespace-nowrap">PhishLens</h1>
      </div>
      <div className="px-6 pb-8">
        <div className="text-[9px] text-brand-cyan font-bold tracking-[0.15em] uppercase glow-text whitespace-nowrap">Smart Link & QR Security</div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium tracking-wide',
                isActive
                  ? 'bg-[#0a1526]/90 text-[#00e5ff] border border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:bg-[#112240]/40 hover:text-white border border-transparent'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6 mt-auto">
        <div className="bg-[#112240]/30 rounded-2xl p-4 flex items-center gap-4 border border-[#112240]/50 hover:border-[#00e5ff]/30 transition-colors cursor-default">
          <ShieldCheck className="w-7 h-7 shrink-0 glow-icon" fill="#00e5ff" stroke="#050B14" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-wide">Stay Alert</span>
            <span className="text-slate-400 text-xs">Stay Safe</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
