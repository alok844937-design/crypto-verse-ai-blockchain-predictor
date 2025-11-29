import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  BarChart3,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';
import PriceChart from '@/components/crypto/PriceChart';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const COLORS = ['#00f5ff', '#bf00ff', '#00ff88', '#ff3366', '#ffd700', '#627eea', '#f7931a'];

export default function Portfolio() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolding, setNewHolding] = useState({
    coin_id: 'bitcoin',
    coin_name: 'Bitcoin',
    coin_symbol: 'BTC',
    coin_image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    quantity: '',
    buy_price: ''
  });
  const queryClient = useQueryClient();

  // Fetch portfolio
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.Portfolio.list()
  });

  // Fetch current prices
  const { data: priceData } = useQuery({
    queryKey: ['portfolioPrices'],
    queryFn: async () => {
      const coinIds = [...new Set(portfolio.map(p => p.coin_id))];
      if (coinIds.length === 0) return {};
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current prices for these cryptocurrencies: ${coinIds.join(', ')}. Return JSON object with coin_id as key and current_price as value, like: {"bitcoin": 67500, "ethereum": 3500}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          additionalProperties: { type: "number" }
        }
      });
      return response;
    },
    enabled: portfolio.length > 0,
    staleTime: 60000
  });

  const addHoldingMutation = useMutation({
    mutationFn: (data) => base44.entities.Portfolio.create({
      ...data,
      transaction_type: 'buy',
      buy_date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setShowAddModal(false);
      setNewHolding({
        coin_id: 'bitcoin',
        coin_name: 'Bitcoin',
        coin_symbol: 'BTC',
        coin_image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        quantity: '',
        buy_price: ''
      });
    }
  });

  const deleteHoldingMutation = useMutation({
    mutationFn: (id) => base44.entities.Portfolio.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] })
  });

  const coinOptions = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', image: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png' }
  ];

  // Calculate portfolio stats
  const portfolioStats = portfolio.reduce((acc, holding) => {
    const currentPrice = priceData?.[holding.coin_id] || holding.buy_price;
    const currentValue = holding.quantity * currentPrice;
    const investedValue = holding.quantity * holding.buy_price;
    const profitLoss = currentValue - investedValue;
    
    return {
      totalValue: acc.totalValue + currentValue,
      totalInvested: acc.totalInvested + investedValue,
      totalProfitLoss: acc.totalProfitLoss + profitLoss
    };
  }, { totalValue: 0, totalInvested: 0, totalProfitLoss: 0 });

  const profitLossPercentage = portfolioStats.totalInvested > 0 
    ? ((portfolioStats.totalProfitLoss / portfolioStats.totalInvested) * 100)
    : 0;

  // Prepare pie chart data
  const pieData = portfolio.map((holding, index) => {
    const currentPrice = priceData?.[holding.coin_id] || holding.buy_price;
    const value = holding.quantity * currentPrice;
    return {
      name: holding.coin_symbol.toUpperCase(),
      value,
      color: COLORS[index % COLORS.length]
    };
  });

  // Historical data for chart
  const growthData = Array(14).fill(0).map((_, i) => ({
    time: `Day ${i + 1}`,
    price: portfolioStats.totalInvested * (1 + (Math.random() * 0.2 - 0.05) * (i / 14))
  }));
  growthData[growthData.length - 1].price = portfolioStats.totalValue;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
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
            <h1 className="text-3xl md:text-4xl font-bold">
              <NeonText color="green">My Portfolio</NeonText>
            </h1>
            <p className="text-white/50 mt-1">Track your crypto investments</p>
          </div>
          
          <GlowButton 
            variant="success" 
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Holding
          </GlowButton>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6" glow="cyan">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <span className="text-white/50 text-sm">Total Value</span>
            </div>
            <p className="text-3xl font-bold text-white">
              <AnimatedCounter 
                value={portfolioStats.totalValue} 
                prefix="$" 
                decimals={2}
              />
            </p>
          </GlassCard>

          <GlassCard className="p-6" glow="purple">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-white/50 text-sm">Invested</span>
            </div>
            <p className="text-3xl font-bold text-white">
              <AnimatedCounter 
                value={portfolioStats.totalInvested} 
                prefix="$" 
                decimals={2}
              />
            </p>
          </GlassCard>

          <GlassCard className="p-6" glow={portfolioStats.totalProfitLoss >= 0 ? 'green' : 'pink'}>
            <div className="flex items-center gap-2 mb-2">
              {portfolioStats.totalProfitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white/50 text-sm">Profit/Loss</span>
            </div>
            <p className={`text-3xl font-bold ${portfolioStats.totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolioStats.totalProfitLoss >= 0 ? '+' : ''}
              <AnimatedCounter 
                value={portfolioStats.totalProfitLoss} 
                prefix="$" 
                decimals={2}
              />
            </p>
          </GlassCard>

          <GlassCard className="p-6" glow={profitLossPercentage >= 0 ? 'green' : 'pink'}>
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-yellow-400" />
              <span className="text-white/50 text-sm">Return %</span>
            </div>
            <p className={`text-3xl font-bold ${profitLossPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {profitLossPercentage >= 0 ? '+' : ''}
              <AnimatedCounter 
                value={profitLossPercentage} 
                suffix="%" 
                decimals={2}
              />
            </p>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Holdings List */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Holdings</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 mb-4">No holdings yet</p>
                  <GlowButton 
                    variant="outline" 
                    onClick={() => setShowAddModal(true)}
                    icon={Plus}
                  >
                    Add Your First Holding
                  </GlowButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((holding, index) => {
                    const currentPrice = priceData?.[holding.coin_id] || holding.buy_price;
                    const currentValue = holding.quantity * currentPrice;
                    const investedValue = holding.quantity * holding.buy_price;
                    const profitLoss = currentValue - investedValue;
                    const profitLossPercent = ((profitLoss / investedValue) * 100);
                    const isPositive = profitLoss >= 0;

                    return (
                      <motion.div
                        key={holding.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={holding.coin_image} 
                              alt={holding.coin_name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-bold text-white">{holding.coin_name}</h4>
                              <p className="text-white/50 text-sm">
                                {holding.quantity} {holding.coin_symbol.toUpperCase()} @ ${holding.buy_price}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <p className="font-bold text-white">${currentValue.toFixed(2)}</p>
                              <p className={`text-sm flex items-center gap-1 justify-end ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {isPositive ? '+' : ''}{profitLossPercent.toFixed(2)}%
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteHoldingMutation.mutate(holding.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* Growth Chart */}
            {portfolio.length > 0 && (
              <GlassCard className="p-6" glow="cyan">
                <h3 className="text-xl font-bold text-white mb-4">Portfolio Growth</h3>
                <PriceChart 
                  data={growthData}
                  color={portfolioStats.totalProfitLoss >= 0 ? '#00ff88' : '#ff3366'}
                  height={250}
                />
              </GlassCard>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Allocation Chart */}
            {pieData.length > 0 && (
              <GlassCard className="p-6" glow="purple">
                <h3 className="text-lg font-bold text-white mb-4">Allocation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-2">
                                <p className="text-white font-bold">{data.name}</p>
                                <p className="text-white/70 text-sm">${data.value.toFixed(2)}</p>
                              </div>
                            );
                          }
