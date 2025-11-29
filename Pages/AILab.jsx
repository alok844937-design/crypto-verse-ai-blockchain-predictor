import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Search,
  BarChart3,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';
import PriceChart from '@/components/crypto/PriceChart';
import SentimentBadge from '@/components/crypto/SentimentBadge';
import AIChatbot, { ChatbotToggle } from '@/components/ai/AIChatbot';

export default function AILab() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [showChatbot, setShowChatbot] = useState(false);

  const coinOptions = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' }
  ];

  // Fetch AI prediction
  const { data: prediction, isLoading: isLoadingPrediction, refetch } = useQuery({
    queryKey: ['aiPrediction', selectedCoin],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze ${selectedCoin} cryptocurrency and provide a 7-day price prediction. Include:
1. Current market sentiment (bullish/bearish/neutral)
2. Confidence score (0-100)
3. 7-day price prediction with daily values
4. Key factors affecting the prediction
5. Risk level (low/medium/high)
6. Trading recommendation

Return JSON:
{
  "coin": "${selectedCoin}",
  "current_price": 67500,
  "sentiment": "bullish",
  "confidence": 72,
  "risk_level": "medium",
  "prediction": {
    "7_day_target": 71000,
    "percent_change": 5.2,
    "daily_prices": [67500, 67800, 68200, 69000, 69500, 70200, 71000]
  },
  "factors": [
    "Strong institutional buying",
    "Positive regulatory news",
    "Technical breakout pattern"
  ],
  "risks": [
    "Market volatility",
    "Regulatory uncertainty"
  ],
  "recommendation": "Consider accumulating on dips with proper risk management",
  "support_levels": [65000, 63000],
  "resistance_levels": [70000, 73000]
}
Use realistic current market data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            coin: { type: "string" },
            current_price: { type: "number" },
            sentiment: { type: "string" },
            confidence: { type: "number" },
            risk_level: { type: "string" },
            prediction: { type: "object" },
            factors: { type: "array", items: { type: "string" } },
            risks: { type: "array", items: { type: "string" } },
            recommendation: { type: "string" },
            support_levels: { type: "array", items: { type: "number" } },
            resistance_levels: { type: "array", items: { type: "number" } }
          }
        }
      });
      return response;
    },
    staleTime: 120000
  });

  // Fetch market overview
  const { data: marketOverview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['marketOverview'],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide a comprehensive crypto market overview with AI analysis. Include:
1. Overall market sentiment
2. Fear & Greed index (0-100)
3. Top trending narratives
4. Sector performance
5. Key events to watch

Return JSON:
{
  "overall_sentiment": "bullish",
  "fear_greed_index": 65,
  "fear_greed_label": "Greed",
  "trending_narratives": [
    {"name": "AI Tokens", "trend": "up", "change": 15},
    {"name": "Layer 2", "trend": "up", "change": 8},
    {"name": "DeFi", "trend": "neutral", "change": 2},
    {"name": "Meme Coins", "trend": "down", "change": -5}
  ],
  "sector_performance": [
    {"sector": "Smart Contract Platforms", "change": 5.2},
    {"sector": "DeFi", "change": 3.1},
    {"sector": "Gaming", "change": -1.2}
  ],
  "key_events": [
    "Fed meeting next week",
    "Major protocol upgrade",
    "ETF decision pending"
  ],
  "market_summary": "The crypto market shows signs of strength..."
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            overall_sentiment: { type: "string" },
            fear_greed_index: { type: "number" },
            fear_greed_label: { type: "string" },
            trending_narratives: { type: "array" },
            sector_performance: { type: "array" },
            key_events: { type: "array", items: { type: "string" } },
            market_summary: { type: "string" }
          }
        }
      });
      return response;
    },
    staleTime: 300000
  });

  const predictionChartData = prediction?.prediction?.daily_prices?.map((price, i) => ({
    time: `Day ${i + 1}`,
    price
  })) || [];

  const getFearGreedColor = (value) => {
    if (value <= 25) return 'text-red-500';
    if (value <= 45) return 'text-orange-500';
    if (value <= 55) return 'text-yellow-500';
    if (value <= 75) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'text-emerald-400 bg-emerald-500/20';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
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
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <NeonText color="purple">AI Investment Lab</NeonText>
              </h1>
            </div>
            <p className="text-white/50">Advanced AI-powered market analysis and predictions</p>
          </div>
          
          <GlowButton 
            variant="secondary" 
            icon={Sparkles}
            onClick={() => setShowChatbot(true)}
          >
            Ask AI Assistant
          </GlowButton>
        </motion.div>

        {/* Market Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {isLoadingOverview ? (
            Array(4).fill(0).map((_, i) => (
              <GlassCard key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                <div className="h-8 bg-white/10 rounded w-16" />
              </GlassCard>
            ))
          ) : (
            <>
              <GlassCard className="p-6" glow="cyan">
                <p className="text-white/50 text-sm mb-2">Market Sentiment</p>
                <SentimentBadge sentiment={marketOverview?.overall_sentiment || 'neutral'} size="lg" />
              </GlassCard>

              <GlassCard className="p-6" glow="purple">
                <p className="text-white/50 text-sm mb-2">Fear & Greed Index</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${getFearGreedColor(marketOverview?.fear_greed_index || 50)}`}>
                    {marketOverview?.fear_greed_index || 50}
                  </span>
                  <span className="text-white/50">{marketOverview?.fear_greed_label}</span>
                </div>
              </GlassCard>

              <GlassCard className="p-6 md:col-span-2">
                <p className="text-white/50 text-sm mb-3">Trending Narratives</p>
                <div className="flex flex-wrap gap-2">
                  {marketOverview?.trending_narratives?.map((narrative, i) => (
                    <span 
                      key={i}
                      className={`px-3 py-1 rounded-full text-sm ${
                        narrative.trend === 'up' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : narrative.trend === 'down'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {narrative.name} {narrative.change > 0 ? '+' : ''}{narrative.change}%
                    </span>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Price Prediction */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6" glow="purple">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  7-Day Price Prediction
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {coinOptions.map(coin => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </option>
                    ))}
                  </select>
                  <GlowButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoadingPrediction}
                  >
                    {isLoadingPrediction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
                  </GlowButton>
                </div>
              </div>

              {isLoadingPrediction ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/50">AI is analyzing market data...</p>
                  </div>
                </div>
              ) : prediction ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-white/50 text-xs mb-1">Current Price</p>
                      <p className="text-xl font-bold text-white">
                        ${prediction.current_price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-white/50 text-xs mb-1">7-Day Target</p>
                      <p className="text-xl font-bold text-cyan-400">
                        ${prediction.prediction?.['7_day_target']?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-white/50 text-xs mb-1">Expected Change</p>
                      <p className={`text-xl font-bold ${prediction.prediction?.percent_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {prediction.prediction?.percent_change >= 0 ? '+' : ''}{prediction.prediction?.percent_change}%
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-white/50 text-xs mb-1">Confidence</p>
                      <p className="text-xl font-bold text-purple-400">{prediction.confidence}%</p>
                    </div>
                  </div>

                  <PriceChart 
                    data={predictionChartData}
                    color={prediction.prediction?.percent_change >= 0 ? '#00ff88' : '#ff3366'}
                    height={300}
                  />

                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/90 font-medium mb-1">AI Recommendation</p>
                        <p className="text-white/70 text-sm">{prediction.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </GlassCard>

            {/* Key Events */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Key Events to Watch
              </h3>
              <div className="space-y-3">
                {marketOverview?.key_events?.map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <p className="text-white/80">{event}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
