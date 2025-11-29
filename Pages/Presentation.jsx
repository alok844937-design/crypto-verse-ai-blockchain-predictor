import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Brain,
  TrendingUp,
  Wallet,
  Star,
  Zap,
  Shield,
  Globe,
  Sparkles,
  BarChart3,
  MessageSquare,
  Rocket,
  Users,
  Target,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import NeonText from '@/components/ui/NeonText';
import CryptoGlobe from '@/components/3d/CryptoGlobe';

const slides = [
  {
    id: 'intro',
    type: 'title',
    title: 'CryptoVerse AI',
    subtitle: 'The Future of Crypto Intelligence',
    tagline: 'AI-Powered • Real-Time • Beautiful',
    background: 'gradient'
  },
  {
    id: 'problem',
    type: 'problem',
    title: 'The Problem',
    points: [
      { icon: TrendingUp, text: 'Crypto market is volatile & unpredictable', color: 'red' },
      { icon: BarChart3, text: 'Too much data, not enough insights', color: 'orange' },
      { icon: Users, text: 'Beginners struggle to make informed decisions', color: 'yellow' },
      { icon: Shield, text: 'Scattered tools, no unified platform', color: 'pink' }
    ]
  },
  {
    id: 'solution',
    type: 'solution',
    title: 'Our Solution',
    subtitle: 'CryptoVerse AI - All-in-One Crypto Intelligence Platform',
    features: [
      { icon: Brain, title: 'AI-Powered Analysis', desc: 'LLM-driven market insights & predictions' },
      { icon: TrendingUp, title: 'Real-Time Data', desc: 'Live prices, charts & market stats' },
      { icon: Wallet, title: 'Portfolio Tracking', desc: 'Track investments & P&L analytics' },
      { icon: MessageSquare, title: 'AI Chatbot', desc: 'Ask anything about crypto instantly' }
    ]
  },
  {
    id: 'demo-dashboard',
    type: 'demo',
    title: 'Live Dashboard',
    demoPage: 'Dashboard',
    highlights: ['Real-time prices', 'Top gainers/losers', 'Market overview', 'Watchlist']
  },
  {
    id: 'demo-ai',
    type: 'demo',
    title: 'AI Investment Lab',
    demoPage: 'AILab',
    highlights: ['7-day price predictions', 'Sentiment analysis', 'Risk assessment', 'Market insights']
  },
  {
    id: 'demo-portfolio',
    type: 'demo',
    title: 'Portfolio Tracker',
    demoPage: 'Portfolio',
    highlights: ['P&L tracking', 'Allocation charts', 'Growth analytics', 'AI investment tips']
  },
  {
    id: 'tech',
    type: 'tech',
    title: 'Tech Stack',
    stack: [
      { name: 'React', desc: 'Modern UI Framework', color: 'cyan' },
      { name: 'Base44 AI', desc: 'LLM Integration', color: 'purple' },
      { name: 'TailwindCSS', desc: 'Styling', color: 'pink' },
      { name: 'Framer Motion', desc: 'Animations', color: 'green' },
      { name: 'Recharts', desc: 'Data Visualization', color: 'orange' },
      { name: 'React Query', desc: 'State Management', color: 'blue' }
    ]
  },
  {
    id: 'features',
    type: 'features',
    title: 'Key Features',
    items: [
      { icon: Sparkles, text: '3D Animated Landing Page' },
      { icon: Brain, text: 'AI-Powered Price Predictions' },
      { icon: MessageSquare, text: 'Conversational AI Chatbot' },
      { icon: TrendingUp, text: 'Real-Time Market Data' },
      { icon: Wallet, text: 'Portfolio Management' },
      { icon: Star, text: 'Custom Watchlists' },
      { icon: BarChart3, text: 'Interactive Charts' },
      { icon: Shield, text: 'Sentiment Analysis' }
    ]
  },
  {
    id: 'future',
    type: 'roadmap',
    title: 'Future Roadmap',
    phases: [
      { phase: 'Q1', items: ['Mobile App', 'Price Alerts'] },
      { phase: 'Q2', items: ['Social Trading', 'NFT Tracking'] },
      { phase: 'Q3', items: ['DeFi Integration', 'Wallet Connect'] },
      { phase: 'Q4', items: ['Advanced ML Models', 'API Access'] }
    ]
  },
  {
    id: 'end',
    type: 'end',
    title: 'Thank You!',
    subtitle: 'CryptoVerse AI',
    cta: 'Experience the Future of Crypto Intelligence'
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setCurrentSlide(prev => Math.max(prev - 1, 0));
      if (e.key === ' ') setIsAutoPlay(prev => !prev);
      if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[200px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide Counter */}
      <div className="fixed top-6 left-6 z-50">
        <span className="text-white/50 text-sm font-mono">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-2 rounded-lg transition-colors ${isAutoPlay ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/50 hover:text-white'}`}
        >
          {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="p-2 bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
 