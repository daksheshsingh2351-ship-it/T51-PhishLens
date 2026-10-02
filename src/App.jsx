import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanUrl from './pages/ScanUrl';
import ScanQR from './pages/ScanQR';
import Scanning from './pages/Scanning';
import Result from './pages/Result';
import RedirectAnalysis from './pages/RedirectAnalysis';
import History from './pages/History';
import SafetyTips from './pages/SafetyTips';
import About from './pages/About';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('scanHistory')) {
      localStorage.setItem('scanHistory', JSON.stringify([]));
    }
  }, []);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan-url" element={<ScanUrl />} />
          <Route path="/scan-qr" element={<ScanQR />} />
          <Route path="/scanning" element={<Scanning />} />
          <Route path="/result" element={<Result />} />
          <Route path="/redirect-analysis" element={<RedirectAnalysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
