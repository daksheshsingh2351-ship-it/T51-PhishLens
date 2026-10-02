import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-brand-navy overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>
      
      {/* Radial lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,_rgba(0,229,255,0.1),_transparent_60%)] pointer-events-none z-0"></div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
