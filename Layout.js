import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  Star, 
  Wallet, 
  Brain,
  Menu,
  X
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Landing', label: 'Home', icon: Home },
    { name: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { name: 'Watchlist', label: 'Watchlist', icon: Star },
    { name: 'Portfolio', label: 'Portfolio', icon: Wallet },
    { name: 'AILab', label: 'AI Lab', icon: Brain },
    { name: 'Presentation', label: 'Pitch', icon: LayoutDashboard }
  ];

  // Don't show nav on landing page
  if (currentPageName === 'Landing') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                CryptoVerse
              </span>
              <span className="text-[10px] font-bold text-cyan-400 border border-cyan-400 px-1.5 py-0.5 rounded">
                AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link key={item.name} to={createPageUrl(item.name)}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 px-4 py-4"
          >
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.name;
              return (
                <Link 
                  key={item.name} 
                  to={createPageUrl(item.name)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </nav>

      {/* Main Content with top padding for nav */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}