import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Filter,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Flame,
  Clock,
  BarChart3,
  Wallet
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';
import CryptoCard from '@/components/crypto/CryptoCard';
import MarketStats from '@/components/crypto/MarketStats';
import AIChatbot, { ChatbotToggle } from '@/components/ai/AIChatbot';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [showChatbot, setShowChatbot] = useState(false);
  const queryClient = useQueryClient();

  // Fetch market data using AI integration
  const { data: marketData, isLoading: isLoadingMarket, refetch: refetchMarket } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current cryptocurrency market data for top 20 coins. Return JSON with this exact structure:
{
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      "current_price": 67500,
      "market_cap": 1320000000000,
      "market_cap_rank": 1,
      "total_volume": 35000000000,
      "price_change_percentage_24h": 2.5,
      "sparkline_in_7d": {"price": [65000, 66000, 65500, 67000, 66500, 67500, 68000]}
    }
  ],
  "global": {
    "total_market_cap": {"usd": 2500000000000},
    "total_volume": {"usd": 100000000000},
    "market_cap_percentage": {"btc": 52.5},
    "active_cryptocurrencies": 10000
  }
}
Include real approximate data for: Bitcoin, Ethereum, Tether, BNB, Solana, XRP, USDC, Cardano, Avalanche, Dogecoin, Polkadot, Chainlink, Polygon, Litecoin, Bitcoin Cash, Uniswap, Stellar, Cosmos, Monero, Ethereum Classic`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            coins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  symbol: { type: "string" },
                  name: { type: "string" },
                  image: { type: "string" },
                  current_price: { type: "number" },
                  market_cap: { type: "number" },
                  market_cap_rank: { type: "number" },
                  total_volume: { type: "number" },
                  price_change_percentage_24h: { type: "number" },
                  sparkline_in_7d: { type: "object" }
                }
              }
            },
            global: { type: "object" }
          }
        }
      });
      return response;
    },
    staleTime: 60000,
    refetchInterval: 120000
  });

  // Fetch watchlist
  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.Watchlist.list()
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: (coin) => base44.entities.Watchlist.create({
      coin_id: coin.id,
      coin_name: coin.name,
      coin_symbol: coin.symbol,
      coin_image: coin.image
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (coinId) => {
      const item = watchlist.find(w => w.coin_id === coinId);
      if (item) await base44.entities.Watchlist.delete(item.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const handleWatchlistToggle = (coin) => {
    const isInWatchlist = watchlist.some(w => w.coin_id === coin.id);
    if (isInWatchlist) {
      removeFromWatchlistMutation.mutate(coin.id);
    } else {
      addToWatchlistMutation.mutate(coin);
    }
  };

  const coins = marketData?.coins || [];
  const globalData = marketData?.global || {};

  const filteredCoins = coins
    .filter(coin => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'market_cap') return b.market_cap - a.market_cap;
      if (sortBy === 'price') return b.current_price - a.current_price;
      if (sortBy === 'change') return b.price_change_percentage_24h - a.price_change_percentage_24h;
      return 0;
    });

  const topGainers = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
  const topLosers = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <NeonText color="cyan">Dashboard</NeonText>
            </h1>
            <p className="text-white/50 mt-1">Real-time cryptocurrency market overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Portfolio')}>
              <GlowButton variant="outline" size="sm" icon={Wallet}>
                Portfolio
              </GlowButton>
            </Link>
            <Link to={createPageUrl('AILab')}>
              <GlowButton variant="secondary" size="sm" icon={Sparkles}>
                AI Lab
              </GlowButton>
            </Link>
          </div>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <MarketStats globalData={globalData} isLoading={isLoadingMarket} />
        </motion.div>

        {/* Quick Stats Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Top Gainers */}
          <GlassCard className="p-4" glow="green">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {topGainers.map(coin => (
                <Link key={coin.id} to={createPageUrl(`CoinDetail?id=${coin.id}`)}>
                  <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} className="w-6 h-6 rounded-full" alt={coin.name} />
                      <span className="text-white/80 text-sm">{coin.symbol.toUpperCase()}</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-bold">
                      +{coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Top Losers */}
          <GlassCard className="p-4" glow="pink">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-white">Top Losers</h3>
            </div>
            <div className="space-y-3">
              {topLosers.map(coin => (
                <Link key={coin.id} to={createPageUrl(`CoinDetail?id=${coin.id}`)}>
                  <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} className="w-6 h-6 rounded-full" alt={coin.name} />
                      <span className="text-white/80 text-sm">{coin.symbol.toUpperCase()}</span>
                    </div>
                    <span className="text-red-400 text-sm font-bold">
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Watchlist Preview */}
          <GlassCard className="p-4" glow="gold">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-white">Watchlist</h3>
              </div>
              <Link to={createPageUrl('Watchlist')} className="text-cyan-400 text-sm flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {watchlist.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">
                  No coins in watchlist yet
                </p>
              ) : (
                watchlist.slice(0, 3).map(item => {
                  const coinData = coins.find(c => c.id === item.coin_id);
                  return (
                    <Link key={item.id} to={createPageUrl(`CoinDetail?id=${item.coin_id}`)}>
                      <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <img src={item.coin_image} className="w-6 h-6 rounded-full" alt={item.coin_name} />
                          <span className="text-white/80 text-sm">{item.coin_symbol.toUpperCase()}</span>
                        </div>
                        {coinData && (
                          <span className={`text-sm font-bold ${coinData.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {coinData.price_change_percentage_24h >= 0 ? '+' : ''}{coinData.price_change_percentage_24h?.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="market_cap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetchMarket()}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-white/50 ${isLoadingMarket ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Coins Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {isLoadingMarket ? (
            Array(9).fill(0).map((_, i) => (
              <GlassCard key={i} className="p-4 h-48 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-16" />
                  </div>
                </div>
                <div className="h-8 bg-white/10 rounded w-32 mb-4" />
                <div className="h-12 bg-white/10 rounded" />
              </GlassCard>
            ))
          ) : (
            filteredCoins.map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`CoinDetail?id=${coin.id}`)}>
                  <CryptoCard
                    coin={coin}
                    rank={coin.market_cap_rank}
                    isInWatchlist={watchlist.some(w => w.coin_id === coin.id)}
                    onWatchlistToggle={handleWatchlistToggle}
                  />
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* AI Chatbot */}
      <AnimatePresence>
        {showChatbot && (
          <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
        )}
      </AnimatePresence>
      {!showChatbot && <ChatbotToggle onClick={() => setShowChatbot(true)} />}
    </div>
  );
}