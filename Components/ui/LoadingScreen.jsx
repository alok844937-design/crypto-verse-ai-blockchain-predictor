import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    const glitchInterval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 100);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Glitch effect overlay */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Logo */}
      <motion.div
        animate={{
          textShadow: showGlitch 
            ? ['0 0 20px #00f5ff', '2px 2px 20px #ff00aa', '-2px -2px 20px #00f5ff']
            : '0 0 20px #00f5ff'
        }}
        className="relative mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          CryptoVerse
        </h1>
        <span className="absolute -top-2 -right-4 text-xs font-bold text-cyan-400 border border-cyan-400 px-2 py-0.5 rounded">
          AI
        </span>
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
          style={{
            boxShadow: '0 0 20px rgba(0,245,255,0.5)'
          }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-cyan-400/80 text-sm font-mono"
      >
        {progress < 30 && 'Initializing neural networks...'}
        {progress >= 30 && progress < 60 && 'Loading market data...'}
        {progress >= 60 && progress < 90 && 'Connecting to blockchain...'}
        {progress >= 90 && 'Launching CryptoVerse...'}
      </motion.p>

      {/* Percentage */}
      <p className="text-white/50 text-xs font-mono mt-2">
        {Math.min(Math.round(progress), 100)}%
      </p>
    </motion.div>
  );
}