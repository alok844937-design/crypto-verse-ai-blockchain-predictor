import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, StarOff } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function CryptoCard({ 
  coin, 
  onClick, 
  onWatchlistToggle,
  isInWatchlist = false,
  rank,
  showSparkline = true
}) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  
  const formatPrice = (price) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  return (
    <GlassCard 
      hover 
      glow={isPositive ? 'green' : 'pink'}
      onClick={() => onClick?.(coin)}
      className="p-4"
    >
      <div className="flex items-center justify-between">
        {/* Left: Rank, Image, Name */}
        <div className="flex items-center gap-3">
          {rank && (
            <span className="text-xs font-mono text-white/40 w-6">#{rank}</span>
          )}
          <div className="relative">
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-10 h-10 rounded-full"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
          </div>
          <div>
            <h3 className="font-bold text-white">{coin.name}</h3>
            <p className="text-xs text-white/50 uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* Right: Price & Change */}
        <div className="text-right flex items-center gap-4">
          <div>
            <p className="font-bold text-white text-lg">
              {formatPrice(coin.current_price)}
            </p>
            <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%</span>
            </div>
          </div>
          
          {/* Watchlist button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onWatchlistToggle?.(coin);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isInWatchlist ? (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ) : (
              <StarOff className="w-5 h-5 text-white/30 hover:text-yellow-400" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom: Market Cap & Volume */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-white/50">
        <div>
          <span className="text-white/30">Market Cap:</span>{' '}
          <span className="text-white/70">{formatMarketCap(coin.market_cap)}</span>
        </div>
        <div>
          <span className="text-white/30">24h Vol:</span>{' '}
          <span className="text-white/70">{formatMarketCap(coin.total_volume)}</span>
        </div>
      </div>

      {/* Sparkline */}
      {showSparkline && coin.sparkline_in_7d?.price && (
        <div className="mt-3 h-12">
          <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${coin.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? '#00ff88' : '#ff3366'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? '#00ff88' : '#ff3366'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={generateSparklinePath(coin.sparkline_in_7d.price)}
              fill={`url(#gradient-${coin.id})`}
              stroke={isPositive ? '#00ff88' : '#ff3366'}
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}
    </GlassCard>
  );
}

function generateSparklinePath(prices) {
  if (!prices || prices.length === 0) return '';
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * 100;
    const y = 40 - ((price - min) / range) * 35;
    return `${x},${y}`;
  });
  
  return `M${points[0]} L${points.join(' L')} L100,40 L0,40 Z`;
}