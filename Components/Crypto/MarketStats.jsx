import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, Coins, DollarSign } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function MarketStats({ globalData, isLoading }) {
  const stats = [
    {
      label: 'Total Market Cap',
      value: globalData?.total_market_cap?.usd || 0,
      format: 'currency',
      icon: DollarSign,
      color: 'cyan'
    },
    {
      label: '24h Volume',
      value: globalData?.total_volume?.usd || 0,
      format: 'currency',
      icon: Activity,
      color: 'purple'
    },
    {
      label: 'BTC Dominance',
      value: globalData?.market_cap_percentage?.btc || 0,
      format: 'percent',
      icon: Coins,
      color: 'gold'
    },
    {
      label: 'Active Coins',
      value: globalData?.active_cryptocurrencies || 0,
      format: 'number',
      icon: BarChart3,
      color: 'green'
    }
  ];

  const formatValue = (value, format) => {
    if (format === 'currency') {
      if (value >= 1e12) return { num: value / 1e12, suffix: 'T', prefix: '$' };
      if (value >= 1e9) return { num: value / 1e9, suffix: 'B', prefix: '$' };
      return { num: value / 1e6, suffix: 'M', prefix: '$' };
    }
    if (format === 'percent') {
      return { num: value, suffix: '%', prefix: '' };
    }
    return { num: value, suffix: '', prefix: '' };
  };

  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    gold: 'text-yellow-400 bg-yellow-400/10',
    green: 'text-emerald-400 bg-emerald-400/10'
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const formatted = formatValue(stat.value, stat.format);
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4" glow={stat.color}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${iconColors[stat.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/50 text-xs mb-1">{stat.label}</p>
              {isLoading ? (
                <div className="h-8 bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-white">
                  <AnimatedCounter
                    value={formatted.num}
                    prefix={formatted.prefix}
                    suffix={formatted.suffix}
                    decimals={stat.format === 'percent' ? 1 : 2}
                  />
                </p>
              )}
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}