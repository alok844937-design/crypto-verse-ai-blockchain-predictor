import React from 'react';
import { motion } from 'framer-motion';

export default function NeonText({ 
  children, 
  as: Component = 'span',
  color = 'cyan',
  size = 'base',
  animate = true,
  className = ''
}) {
  const colors = {
    cyan: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]',
    purple: 'text-purple-400 drop-shadow-[0_0_10px_rgba(191,0,255,0.8)]',
    pink: 'text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,170,0.8)]',
    green: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]',
    gold: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]',
    white: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
  };

  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl'
  };

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`font-bold ${colors[color]} ${sizes[size]} ${className}`}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <Component className={`font-bold ${colors[color]} ${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
}