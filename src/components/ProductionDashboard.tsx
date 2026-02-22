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
  Activity
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
  { id: 'sbaro', name: 'sbaro_bot', role: 'Director AI', icon: Clapperboard, color: 'text-purple-400', status: 'idle', progress: 0 },
  { id: 'nassro', name: 'nassro_bot', role: 'Script Master', icon: PenTool, color: 'text-blue-400', status: 'idle', progress: 0 },
  { id: 'mina', name: 'mina_bot', role: 'Visual Artist', icon: ImageIcon, color: 'text-pink-400', status: 'idle', progress: 0 },
  { id: 'wawa', name: 'wawa_bot', role: 'Audio Engineer', icon: Music, color: 'text-emerald-400', status: 'idle', progress: 0 },
  { id: 'jrana', name: 'jrana_bot', role: 'Video Editor', icon: Film, color: 'text-amber-400', status: 'idle', progress: 0 },
];

// --- Components ---

const BotCard: React.FC<{ bot: BotAgent }> = ({ bot }) => {
  return (
    <motion.div 
      layout
      className={clsx(
        "relative p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden",
        bot.status === 'working' ? "bg-zinc-900/80 border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" : "bg-zinc-900/40 border-white/5"
      )}
    >
      {/* Active Pulse Ring */}
      {bot.status === 'working' && (
        <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl animate-pulse" />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className={clsx("p-2 rounded-xl bg-zinc-950/50 border border-white/5", bot.color)}>
          <bot.icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className={clsx(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
            bot.status === 'working' ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/20" : 
            bot.status === 'completed' ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/20" :
            "bg-zinc-800/50 text-zinc-500 border-white/5"
          )}>
            {bot.status}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-white text-sm">{bot.name}</h3>
        <p className="text-xs text-zinc-500">{bot.role}</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className={clsx("h-full rounded-full transition-all duration-300", 
            bot.status === 'completed' ? "bg-emerald-500" : "bg-indigo-500"
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
    <div className="h-64 bg-zinc-950 rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 text-zinc-500 mb-3 pb-3 border-b border-white/5">
        <Terminal className="w-3 h-3" />
        <span className="uppercase tracking-wider font-bold">Production Log</span>
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
                  log.from === 'sbaro_bot' ? "text-purple-400" :
                  log.from === 'nassro_bot' ? "text-blue-400" :
                  log.from === 'mina_bot' ? "text-pink-400" :
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
                  log.type === 'command' ? "text-indigo-300" :
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

  // Simulation Logic
  useEffect(() => {
    if (!isActive) return;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const now = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });

      // Helper to add log
      const addLog = (from: string, message: string, to?: string, type: LogEntry['type'] = 'info') => {
        setLogs(prev => [...prev, {
          id: Math.random().toString(36),
          timestamp: now,
          from,
          to,
          message,
          type
        }]);
      };

      // Helper to update bot
      const updateBot = (id: string, updates: Partial<BotAgent>) => {
        setBots(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      };

      // Orchestration Sequence
      if (step === 1) {
        updateBot('sbaro', { status: 'working', progress: 10 });
        addLog('sbaro_bot', 'Initializing production session...', undefined, 'command');
      }
      if (step === 5) {
        updateBot('sbaro', { progress: 40 });
        addLog('sbaro_bot', 'Analyzing genre and audience requirements...');
      }
      if (step === 10) {
        updateBot('sbaro', { status: 'completed', progress: 100 });
        updateBot('nassro', { status: 'working', progress: 5 });
        addLog('sbaro_bot', 'Generate Episode 1 Script', 'nassro_bot', 'command');
      }
      if (step === 15) {
        updateBot('nassro', { progress: 30 });
        addLog('nassro_bot', 'Structuring 3-act narrative...');
      }
      if (step === 25) {
        updateBot('nassro', { progress: 60 });
        addLog('nassro_bot', 'Injecting viral hooks and cliffhangers...');
      }
      if (step === 35) {
        updateBot('nassro', { status: 'completed', progress: 100 });
        updateBot('mina', { status: 'working', progress: 10 });
        updateBot('wawa', { status: 'working', progress: 10 });
        addLog('nassro_bot', 'Script ready. Requesting assets.', 'sbaro_bot', 'success');
        addLog('sbaro_bot', 'Generate Visual Prompts', 'mina_bot', 'command');
        addLog('sbaro_bot', 'Analyze Audio Requirements', 'wawa_bot', 'command');
      }
      if (step === 45) {
        updateBot('mina', { progress: 50 });
        addLog('mina_bot', 'Calculating lighting and camera angles...');
      }
      if (step === 50) {
        updateBot('wawa', { progress: 50 });
        addLog('wawa_bot', 'Selecting background score: "Dark Cinematic"...');
      }
      if (step === 60) {
        updateBot('mina', { status: 'completed', progress: 100 });
        updateBot('wawa', { status: 'completed', progress: 100 });
        updateBot('jrana', { status: 'working', progress: 20 });
        addLog('sbaro_bot', 'All assets ready. Begin assembly.', 'jrana_bot', 'command');
      }
      if (step === 70) {
        updateBot('jrana', { progress: 60 });
        addLog('jrana_bot', 'Sequencing timeline (120s)...');
      }
      if (step === 80) {
        updateBot('jrana', { progress: 90 });
        addLog('jrana_bot', 'Final render pass...');
      }
      if (step === 90) {
        updateBot('jrana', { status: 'completed', progress: 100 });
        addLog('jrana_bot', 'Production complete.', 'sbaro_bot', 'success');
        setOverallProgress(100);
        if (onComplete) onComplete();
        clearInterval(interval);
      }

      // Update overall progress roughly
      if (step < 90) {
        setOverallProgress(Math.min(99, Math.floor((step / 90) * 100)));
      }

    }, 150); // Speed of simulation

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-widest uppercase">Live Production</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
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
        
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Total Progress</h3>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
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
                className="text-indigo-500 transition-all duration-300"
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
              <span className="text-4xl font-bold text-white">{overallProgress}%</span>
              <span className="text-xs text-zinc-500 uppercase">Completed</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Story Arc</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
            
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>Scripting</span>
              <span className={overallProgress > 30 ? "text-emerald-400" : "text-zinc-600"}>{Math.min(100, Math.floor(overallProgress * 1.5))}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.min(100, Math.floor(overallProgress * 1.5))}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
