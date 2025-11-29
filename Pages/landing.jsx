import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Brain,
  BarChart3,
  Wallet,
  ChevronDown,
  Play,
  Globe,
  Lock,
  Cpu
} 
from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import GlassCard from '@/components/ui/GlassCard';
import NeonText from '@/components/ui/NeonText';
import LoadingScreen from '@/components/ui/LoadingScreen';

const CryptoGlobe = React.lazy(() => import('@/components/3d/CryptoGlobe'));

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze market trends and provide predictive insights.',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live market data, price tracking, and comprehensive portfolio analytics.',
      color: 'cyan'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Smart risk scoring and portfolio recommendations to optimize your investments.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Customizable price alerts and market movement notifications.',
      color: 'gold'
    }
  ];

  const stats = [
    { value: '100+', label: 'Cryptocurrencies' },
    { value: '24/7', label: 'Market Monitoring' },
    { value: '99.9%', label: 'Uptime' },
    { value: 'AI', label: 'Powered Analysis' }
  ];

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/70">AI-Powered Crypto Intelligence</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Navigate the</span>
              <br />
              <NeonText color="cyan" size="6xl" className="md:text-7xl">
                CryptoVerse
              </NeonText>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                with AI
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-xl">
              Harness the power of artificial intelligence to analyze markets, 
              predict trends, and make smarter investment decisions in the world of cryptocurrency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={createPageUrl('Dashboard')}>
                <GlowButton variant="primary" size="lg" icon={ArrowRight}>
                  Launch Dashboard
                </GlowButton>
              </Link>
              <GlowButton variant="outline" size="lg" icon={Play}>
                Watch Demo
              </GlowButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[400px] md:h-[600px] lg:h-[700px]"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
              </div>
            }>
              <CryptoGlobe />
            </Suspense>
            
            {/* Floating cards around globe */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-20 left-0 hidden lg:block"
            >
              <GlassCard className="p-3 flex items-center gap-3">
                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="w-8 h-8" alt="BTC" />
                <div>
                  <p className="text-xs text-white/50">Bitcoin</p>
                  <p className="text-sm font-bold text-emerald-400">+5.2%</p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-40 right-0 hidden lg:block"
            >
              <GlassCard className="p-3 flex items-center gap-3">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-8 h-8" alt="ETH" />
                <div>
                  <p className="text-xs text-white/50">Ethereum</p>
                  <p className="text-sm font-bold text-emerald-400">+3.8%</p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/30" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <NeonText color="white">Powerful Features</NeonText>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Everything you need to navigate the cryptocurrency market with confidence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full" glow={feature.color}>
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                      ${feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : ''}
                      ${feature.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                      ${feature.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      ${feature.color === 'gold' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    `}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/50 text-sm">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">AI Intelligence</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Meet Your</span>
                <br />
                <NeonText color="purple" size="5xl">AI Assistant</NeonText>
              </h2>
              
              <p className="text-white/60 text-lg mb-8">
                Our advanced AI analyzes millions of data points to provide you with 
                actionable insights, market predictions, and personalized recommendations.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Cpu, text: 'Real-time market sentiment analysis' },
                  { icon: BarChart3, text: '7-day price trend predictions' },
                  { icon: Lock, text: 'Portfolio risk assessment' },
                  { icon: Globe, text: 'Global news integration' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white/80">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Link to={createPageUrl('AILab')} className="inline-block mt-8">
                <GlowButton variant="secondary" icon={Sparkles}>
                  Try AI Lab
                </GlowButton>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard className="p-6" glow="purple">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">CryptoVerse AI</h4>
                    <p className="text-xs text-white/50">Analyzing market trends...</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-white/70 mb-2">Market Sentiment</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">Bullish</span>
                      <span className="text-white/50">72% confidence</span>
                    </div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '72%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-white/70 mb-2">7-Day Prediction</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      +8.5% Expected
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-white/70 mb-2">AI Recommendation</p>
                    <p className="text-white/80 text-sm">
                      "Based on current market conditions and historical patterns, 
                      consider diversifying into layer-2 solutions."
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Ready to Enter the</span>
              <br />
              <NeonText color="cyan" size="6xl">CryptoVerse?</NeonText>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of traders using AI-powered insights to make smarter decisions.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <GlowButton variant="primary" size="xl" icon={ArrowRight}>
                Get Started Free
              </GlowButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NeonText color="cyan" size="xl">CryptoVerse</NeonText>
            <span className="text-xs font-bold text-cyan-400 border border-cyan-400 px-2 py-0.5 rounded">AI</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2025 CryptoVerse AI. Built for Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}