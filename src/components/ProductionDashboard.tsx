import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Clapperboard, 
  PenTool, 
  Image as ImageIcon, 
  Music, 
  Film, 
  CheckCircle2, 
  Loader2,
  Terminal,
  Cpu,
  Activity,
  Zap,
  Share2,
  BarChart3,
  Sparkles,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---

type BotStatus = 'idle' | 'thinking' | 'working' | 'completed' | 'waiting';

interface BotAgent {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
  status: BotStatus;
  progress: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  from: string;
  to?: string;
  message: string;
  type: 'info' | 'command' | 'success' | 'error';
}

// --- Constants ---

const INITIAL_BOTS: BotAgent[] = [
  { id: 'sbaro', name: 'sbaro_bot', role: 'Director AI', icon: Clapperboard, color: 'text-neon-purple', status: 'idle', progress: 0 },
  { id: 'nassro', name: 'nassro_bot', role: 'Script Master', icon: PenTool, color: 'text-neon-cyan', status: 'idle', progress: 0 },
  { id: 'mina', name: 'mina_bot', role: 'Visual Artist', icon: ImageIcon, color: 'text-soft-magenta', status: 'idle', progress: 0 },
  { id: 'wawa', name: 'wawa_bot', role: 'Audio Engineer', icon: Music, color: 'text-emerald-400', status: 'idle', progress: 0 },
  { id: 'jrana', name: 'jrana_bot', role: 'Video Editor', icon: Film, color: 'text-amber-400', status: 'idle', progress: 0 },
  { id: 'scene', name: 'scene_bot', role: 'Scene Director', icon: Clapperboard, color: 'text-indigo-400', status: 'idle', progress: 0 },
  { id: 'guard', name: 'guard_bot', role: 'Continuity', icon: ShieldCheck, color: 'text-red-400', status: 'idle', progress: 0 },
  { id: 'viral', name: 'viral_bot', role: 'Viral Optimizer', icon: Sparkles, color: 'text-yellow-400', status: 'idle', progress: 0 },
  { id: 'distro', name: 'distro_bot', role: 'Distribution', icon: Share2, color: 'text-blue-500', status: 'idle', progress: 0 },
  { id: 'analytics', name: 'analytics_bot', role: 'Analytics', icon: BarChart3, color: 'text-green-500', status: 'idle', progress: 0 },
];

// --- Components ---

const BotCard: React.FC<{ bot: BotAgent }> = ({ bot }) => {
  return (
    <motion.div 
      layout
      className={clsx(
        "relative p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden group",
        bot.status === 'working' ? "bg-zinc-900/80 border-neon-cyan/50 shadow-[0_0_30px_-10px_rgba(0,245,255,0.3)]" : "glass-panel"
      )}
    >
      {/* Active Pulse Ring */}
      {bot.status === 'working' && (
        <div className="absolute inset-0 border-2 border-neon-cyan/20 rounded-2xl animate-pulse" />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className={clsx("p-2 rounded-xl bg-zinc-950/50 border border-white/5 shadow-inner", bot.color)}>
          <bot.icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className={clsx(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono",
            bot.status === 'working' ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/20 animate-pulse" : 
            bot.status === 'completed' ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/20" :
            "bg-zinc-800/50 text-zinc-500 border-white/5"
          )}>
            {bot.status}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-white text-sm tracking-wide group-hover:text-glow">{bot.name}</h3>
        <p className="text-xs text-zinc-500 font-mono">{bot.role}</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className={clsx("h-full rounded-full transition-all duration-300 shadow-[0_0_10px_currentColor]", 
            bot.status === 'completed' ? "bg-emerald-500" : "bg-neon-cyan"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${bot.progress}%` }}
        />
      </div>
    </motion.div>
  );
};

const LogTerminal = ({ logs }: { logs: LogEntry[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-64 bg-midnight-blue/90 rounded-2xl border border-neon-cyan/20 p-4 font-mono text-xs overflow-hidden flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 text-neon-cyan/70 mb-3 pb-3 border-b border-neon-cyan/10">
        <Terminal className="w-3 h-3" />
        <span className="uppercase tracking-wider font-bold text-glow">System Log</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <span className="text-zinc-600 flex-shrink-0">[{log.timestamp}]</span>
              <div className="flex-1">
                <span className={clsx(
                  "font-bold mr-2",
                  log.from === 'sbaro_bot' ? "text-neon-purple" :
                  log.from === 'nassro_bot' ? "text-neon-cyan" :
                  log.from === 'mina_bot' ? "text-soft-magenta" :
                  log.from === 'wawa_bot' ? "text-emerald-400" :
                  "text-amber-400"
                )}>
                  {log.from}
                </span>
                {log.to && (
                  <>
                    <span className="text-zinc-500 mx-1">→</span>
                    <span className="text-zinc-300 mr-2">{log.to}</span>
                  </>
                )}
                <span className={clsx(
                  log.type === 'command' ? "text-neon-cyan" :
                  log.type === 'success' ? "text-emerald-300" :
                  "text-zinc-400"
                )}>
                  {log.message}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main Dashboard ---

export default function ProductionDashboard({ 
  isActive, 
  onComplete 
}: { 
  isActive: boolean;
  onComplete?: () => void;
}) {
  const [bots, setBots] = useState<BotAgent[]>(INITIAL_BOTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  // WebSocket Logic
  useEffect(() => {
    if (!isActive) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      console.log('Connected to Production Engine');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'production:state_update') {
          const state = data.state;
          
          // Reset all to idle first
          setBots(prev => prev.map(b => ({ ...b, status: 'idle' })));

          if (state === 'INITIALIZING') {
            setBots(prev => prev.map(b => b.id === 'sbaro' ? { ...b, status: 'working', progress: 20 } : b));
          } else if (state === 'SCRIPT_GENERATING') {
            setBots(prev => prev.map(b => b.id === 'sbaro' ? { ...b, status: 'completed', progress: 100 } : b));
            setBots(prev => prev.map(b => b.id === 'nassro' ? { ...b, status: 'working', progress: 20 } : b));
          } else if (state === 'VISUAL_CREATING') {
            setBots(prev => prev.map(b => ['sbaro', 'nassro'].includes(b.id) ? { ...b, status: 'completed', progress: 100 } : b));
            setBots(prev => prev.map(b => b.id === 'mina' ? { ...b, status: 'working', progress: 20 } : b));
          } else if (state === 'AUDIO_PROCESSING') {
            setBots(prev => prev.map(b => ['sbaro', 'nassro', 'mina'].includes(b.id) ? { ...b, status: 'completed', progress: 100 } : b));
            setBots(prev => prev.map(b => b.id === 'wawa' ? { ...b, status: 'working', progress: 20 } : b));
          } else if (state === 'VIDEO_ASSEMBLING') {
            setBots(prev => prev.map(b => ['sbaro', 'nassro', 'mina', 'wawa'].includes(b.id) ? { ...b, status: 'completed', progress: 100 } : b));
            setBots(prev => prev.map(b => b.id === 'jrana' ? { ...b, status: 'working', progress: 20 } : b));
          } else if (state === 'COMPLETED') {
            setBots(prev => prev.map(b => ({ ...b, status: 'completed', progress: 100 })));
            setOverallProgress(100);
            if (onComplete) onComplete();
          }

        } else if (data.type === 'production:bot_log') {
          setLogs(prev => [...prev, data.log]);
        } else if (data.type === 'production:progress') {
          setOverallProgress(data.progress);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [isActive, onComplete]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase text-glow">Live Production</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neon-cyan/70">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>CPU: 42%</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>MEM: 1.2GB</span>
          </div>
        </div>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {/* Logs & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogTerminal logs={logs} />
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Zap className="w-24 h-24 text-neon-cyan" />
          </div>
          
          <h3 className="text-sm font-display font-bold text-zinc-400 uppercase tracking-wider mb-6 relative z-10">Total Progress</h3>
          
          <div className="relative w-48 h-48 mx-auto mb-6 z-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-zinc-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-neon-cyan transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallProgress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-display font-bold text-white text-glow">{overallProgress}%</span>
              <span className="text-xs text-zinc-500 uppercase font-mono tracking-widest">Completed</span>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>Story Arc</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_currentColor]" />
            </div>
            
            <div className="flex justify-between text-xs text-zinc-500 mt-2 font-mono">
              <span>Scripting</span>
              <span className={overallProgress > 30 ? "text-neon-cyan" : "text-zinc-600"}>{Math.min(100, Math.floor(overallProgress * 1.5))}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan transition-all duration-300 shadow-[0_0_10px_currentColor]" style={{ width: `${Math.min(100, Math.floor(overallProgress * 1.5))}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
