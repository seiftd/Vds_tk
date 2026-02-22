import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Settings, 
  Film, 
  Menu, 
  X, 
  Clapperboard, 
  Zap,
  BarChart3,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Create Story', href: '/create', icon: PlusCircle },
    { name: 'Production', href: '/production', icon: Clapperboard },
    { name: 'Distribution', href: '/distribution', icon: Share2 },
    { name: 'Scheduler', href: '/scheduler', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Optimization', href: '/optimization', icon: Sparkles },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-midnight-blue text-white font-body selection:bg-neon-cyan/30 selection:text-neon-cyan">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-midnight-blue/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-neon-cyan" />
          <span className="font-display font-bold text-lg tracking-widest text-glow">MYTHORIA</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-neon-cyan">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-midnight-blue/60 border-r border-white/5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-10 h-10 rounded-xl bg-deep-indigo flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(138,43,226,0.3)] relative z-10">
              <Film className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="relative z-10">
              <h1 className="font-display font-bold text-lg tracking-widest text-white text-glow">MYTHORIA</h1>
              <p className="text-[10px] text-neon-purple uppercase tracking-widest font-bold">AI Studio</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative group block"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-transparent border-l-2 border-neon-cyan rounded-r-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive ? "text-neon-cyan" : "text-zinc-400 group-hover:text-white group-hover:bg-white/5"
                  )}>
                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-neon-cyan drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]" : "text-zinc-500 group-hover:text-white")} />
                    <span className="font-medium tracking-wide text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-deep-indigo to-midnight-blue border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-neon-purple" />
                <p className="text-xs font-bold text-neon-cyan tracking-widest uppercase">System Online</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-[10px] text-zinc-400 font-mono">v3.0.0-AUTO</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8 relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
