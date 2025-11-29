import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Share2,
  Brain,
  Newspaper,
  BarChart3,
  Clock,
  Globe,
  Loader2
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';
import PriceChart from '@/components/crypto/PriceChart';
import SentimentBadge from '@/components/crypto/SentimentBadge';
import AIChatbot, { ChatbotToggle } from '@/components/ai/AIChatbot';

export default function CoinDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const coinId = urlParams.get('id') || 'bitcoin';
  
  const [timeframe, setTimeframe] = useState('7d');
  const [showChatbot, setShowChatbot] = useState(false);
  const queryClient = useQueryClient();

  // Fetch coin detail
  const { data: coinData, isLoading } = useQuery({
    queryKey: ['coinDetail', coinId],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get detailed information about ${coinId} cryptocurrency. Return JSON with:
{
  "id": "${coinId}",
  "symbol": "btc",
  "name": "Bitcoin",
  "image": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  "current_price": 67500,
  "market_cap": 1320000000000,
  "market_cap_rank": 1,
  "total_volume": 35000000000,
  "high_24h": 68500,
  "low_24h": 66000,
  "price_change_24h": 1500,
  "price_change_percentage_24h": 2.5,
  "price_change_percentage_7d": 5.2,
  "price_change_percentage_30d": 12.5,
  "circulating_supply": 19500000,
  "total_supply": 21000000,
  "ath": 73000,
  "ath_date": "2024-03-14",
  "description": "Bitcoin is the first decentralized cryptocurrency...",
  "website": "https://bitcoin.org",
  "price_history": [65000, 65500, 66000, 65800, 66500, 67000, 67500, 67200, 67800, 68000, 67500, 67800, 68200, 67500]
}
Use real approximate current data.`,
        add_context_from_internet: true,
        response_json_schema: {
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
            high_24h: { type: "number" },
            low_24h: { type: "number" },
            price_change_24h: { type: "number" },
            price_change_percentage_24h: { type: "number" },
            price_change_percentage_7d: { type: "number" },
            price_change_percentage_30d: { type: "number" },
            circulating_supply: { type: "number" },
            total_supply: { type: "number" },
            ath: { type: "number" },
            ath_date: { type: "string" },
            description: { type: "string" },
            website: { type: "string" },
            price_history: { type: "array", items: { type: "number" } }
          }
        }
      });
      return response;
    },
    staleTime: 30000
  });

  // Fetch AI analysis
  const { data: aiAnalysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ['coinAnalysis', coinId],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze ${coinId} cryptocurrency and provide:
1. Market sentiment (bullish/bearish/neutral)
2. Confidence score (0-100)
3. Key factors affecting price
4. Short summary (2-3 sentences)
5. 3 recent news headlines about this coin

Return JSON:
{
  "sentiment": "bullish",
  "confidence": 72,
  "factors": ["Institutional adoption increasing", "ETF approval", "Halving event"],
  "summary": "Bitcoin shows strong momentum...",
  "news": [
    {"title": "Bitcoin ETFs See Record Inflows", "source": "CoinDesk", "time": "2h ago"},
    {"title": "Institutional Investors Increase BTC Holdings", "source": "Bloomberg", "time": "5h ago"},
    {"title": "Bitcoin Network Activity Hits New High", "source": "CryptoNews", "time": "8h ago"}
  ]
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment: { type: "string" },
            confidence: { type: "number" },
            factors: { type: "array", items: { type: "string" } },
            summary: { type: "string" },
            news: { type: "array", items: { type: "object" } }
          }
        }
      });
      return response;
    },
    staleTime: 60000
  });

  // Watchlist
  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.Watchlist.list()
  });

  const isInWatchlist = watchlist.some(w => w.coin_id === coinId);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWatchlist) {
        const item = watchlist.find(w => w.coin_id === coinId);
        if (item) await base44.entities.Watchlist.delete(item.id);
      } else {
        await base44.entities.Watchlist.create({
          coin_id: coinData.id,
          coin_name: coinData.name,
          coin_symbol: coinData.symbol,
          coin_image: coinData.image
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const formatPrice = (price) => {
    if (!price) return '$0';
    if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatLargeNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const chartData = coinData?.price_history?.map((price, index) => ({
    time: `Day ${index + 1}`,
    price
  })) || [];

  const isPositive = (coinData?.price_change_percentage_24h || 0) >= 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link to={createPageUrl('Dashboard')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : coinData ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={coinData.image} 
                  alt={coinData.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{coinData.name}</h1>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-white/50 text-sm uppercase">
                      {coinData.symbol}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-sm">
                      Rank #{coinData.market_cap_rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(coinData.current_price)}
                    </span>
                    <span className={`flex items-center gap-1 text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {Math.abs(coinData.price_change_percentage_24h || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWatchlistMutation.mutate()}
                  className={`p-3 rounded-xl border ${isInWatchlist ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-white/5 border-white/10'} transition-colors`}
                >
                  {isInWatchlist ? (
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff className="w-6 h-6 text-white/50" />
                  )}
                </motion.button>
                <GlowButton variant="outline" size="sm" icon={Share2}>
                  Share
                </GlowButton>
                {coinData.website && (
                  <a href={coinData.website} target="_blank" rel="noopener noreferrer">
                    <GlowButton variant="primary" size="sm" icon={ExternalLink}>
                      Website
                    </GlowButton>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-6" glow="cyan">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Price Chart</h3>
                    <div className="flex gap-2">
                      {['24h', '7d', '30d', '1y'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            timeframe === tf
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'text-white/50 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PriceChart 
                    data={chartData} 
                    color={isPositive ? '#00ff88' : '#ff3366'}
                    height={350}
                  />
                </GlassCard>

                {/* Market Stats */}
                <GlassCard className="p-6" glow="purple">
                  <h3 className="text-xl font-bold text-white mb-4">Market Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Market Cap', value: formatLargeNumber(coinData.market_cap) },
                      { label: '24h Volume', value: formatLargeNumber(coinData.total_volume) },
                      { label: '24h High', value: formatPrice(coinData.high_24h) },
                      { label: '24h Low', value: formatPrice(coinData.low_24h) },
                      { label: 'Circulating Supply', value: `${(coinData.circulating_supply / 1e6).toFixed(2)}M` },
                      { label: 'Total Supply', value: coinData.total_supply ? `${(coinData.total_supply / 1e6).toFixed(2)}M` : '∞' },
                      { label: 'All-Time High', value: formatPrice(coinData.ath) },
                      { label: '7d Change', value: `${coinData.price_change_percentage_7d >= 0 ? '+' : ''}${coinData.price_change_percentage_7d?.toFixed(2)}%` }
                    ].map((stat, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-xl">
                        <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                        <p className="text-white font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Description */}
                {coinData.description && (
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">About {coinData.name}</h3>
                    <p className="text-white/70 leading-relaxed">{coinData.description}</p>
                  </GlassCard>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* AI Analysis */}
                <GlassCard className="p-6" glow="purple">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">AI Analysis</h3>
                  </div>
                  
                  {isLoadingAnalysis ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <SentimentBadge 
                          sentiment={aiAnalysis.sentiment} 
                          confidence={aiAnalysis.confidence}
                        />
                      </div>
                      
                      <p className="text-white/70 text-sm">{aiAnalysis.summary}</p>
                      
                      <div>
                        <p className="text-white/50 text-xs mb-2">Key Factors</p>
                        <div className="space-y-2">
                          {aiAnalysis.factors?.map((factor, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span className="text-white/80">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </GlassCard>

