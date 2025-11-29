import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  glow = 'cyan',
  onClick
}) {
  const glowColors = {
    cyan: 'hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] hover:border-cyan-500/50',
    purple: 'hover:shadow-[0_0_40px_rgba(191,0,255,0.3)] hover:border-purple-500/50',
    pink: 'hover:shadow-[0_0_40px_rgba(255,0,170,0.3)] hover:border-pink-500/50',
    green: 'hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:border-emerald-500/50',
    gold: 'hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:border-yellow-500/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        ${hover ? glowColors[glow] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}