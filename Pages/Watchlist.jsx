import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  Loader2,
  Eye
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';

export default function Watchlist() {
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.Watchlist.list()
  });

  // Fetch prices for watchlist items
  const { data: priceData } = useQuery({
    queryKey: ['watchlistPrices', watchlist.map(w => w.coin_id).join(',')],
    queryFn: async () => {
      if (watchlist.length === 0) return {};
      const coinIds = watchlist.map(w => w.coin_id).join(', ');
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current price data for: ${coinIds}. Return JSON with coin_id as key:
{
  "bitcoin": {"price": 67500, "change_24h": 2.5, "market_cap": 1320000000000},
  "ethereum": {"price": 3500, "change_24h": -1.2, "market_cap": 420000000000}
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              price: { type: "number" },
              change_24h: { type: "number" },
              market_cap: { type: "number" }
            }
          }
        }
      });
      return response;
    },
    enabled: watchlist.length > 0,
    staleTime: 60000
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: (id) => base44.entities.Watchlist.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const formatPrice = (price) => {
    if (!price) return '$0';
    if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (cap) => {
    if (!cap) return '-';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    return `$${(cap / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <Link to={createPageUrl('Dashboard')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <NeonText color="gold">Watchlist</NeonText>
              </h1>
              <p className="text-white/50">Track your favorite cryptocurrencies</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
            {watchlist.length} coins
          </span>
        </motion.div>

        {/* Watchlist */}
        <GlassCard className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-20 h-20 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No coins in watchlist</h3>
              <p className="text-white/50 mb-6">Start tracking coins by adding them to your watchlist</p>
              <Link to={createPageUrl('Dashboard')}>
                <GlowButton variant="primary" icon={Eye}>
                  Browse Coins
                </GlowButton>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-2 text-white/50 font-medium text-sm">Coin</th>
                    <th className="text-right py-4 px-2 text-white/50 font-medium text-sm">Price</th>
                    <th className="text-right py-4 px-2 text-white/50 font-medium text-sm">24h Change</th>
                    <th className="text-right py-4 px-2 text-white/50 font-medium text-sm">Market Cap</th>
                    <th className="text-right py-4 px-2 text-white/50 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item, index) => {
                    const coinPrice = priceData?.[item.coin_id];
                    const isPositive = (coinPrice?.change_24h || 0) >= 0;
                    
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <Link 
                            to={createPageUrl(`CoinDetail?id=${item.coin_id}`)}
                            className="flex items-center gap-3"
                          >
                            <img 
                              src={item.coin_image} 
                              alt={item.coin_name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-bold text-white">{item.coin_name}</p>
                              <p className="text-white/50 text-sm uppercase">{item.coin_symbol}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="font-bold text-white">
                            {formatPrice(coinPrice?.price)}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className={`flex items-center justify-end gap-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {isPositive ? '+' : ''}{coinPrice?.change_24h?.toFixed(2) || 0}%
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="text-white/70">
                            {formatMarketCap(coinPrice?.market_cap)}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={createPageUrl(`CoinDetail?id=${item.coin_id}`)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4 text-cyan-400" />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromWatchlistMutation.mutate(item.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}