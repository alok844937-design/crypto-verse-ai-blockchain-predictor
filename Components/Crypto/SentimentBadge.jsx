import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SentimentBadge({ sentiment, confidence, size = 'md' }) {
  const sentiments = {
    bullish: {
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-600',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
      text: 'Bullish',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    bearish: {
      icon: TrendingDown,
      color: 'from-red-500 to-pink-600',
      glow: 'shadow-[0_0_20px_rgba(255,51,102,0.5)]',
      text: 'Bearish',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    neutral: {
      icon: Minus,
      color: 'from-gray-400 to-gray-500',
      glow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)]',
      text: 'Neutral',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = sentiments[sentiment] || sentiments.neutral;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-2 rounded-full border
        ${config.bgColor} ${config.borderColor} ${config.glow}
        ${sizes[size]}
      `}
    >
      <Icon className={`w-4 h-4 bg-gradient-to-r ${config.color} bg-clip-text`} />
      <span className={`font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
        {config.text}
      </span>
      {confidence && (
        <span className="text-white/50 text-xs">
          {confidence}%
        </span>
      )}
    </motion.div>
  );
}