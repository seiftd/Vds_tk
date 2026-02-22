import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Database, 
  History, 
  Cpu, 
  Lock, 
  RefreshCw, 
  Save,
  Play
} from 'lucide-react';
import Layout from '../components/Layout';
import ProductionDashboard from '../components/ProductionDashboard';
import { clsx } from 'clsx';

// Mock Memory Data
interface MemoryState {
  story: {
    plot: {
      core_mystery: string;
      theme: string;
      pacing: string;
    };
    characters: Array<{ name: string; role: string; trait: string }>;
    world_rules: string[];
  };
  episodes: Array<{ ep: number; summary: string; cliffhanger: string }>;
  bots: Record<string, { state: string; last_action: string }>;
}

const MOCK_MEMORY: MemoryState = {
  story: {
    plot: {
      core_mystery: "The disappearance of the 13th floor",
      theme: "Techno-thriller",
      pacing: "Fast"
    },
    characters: [
      { name: "Alex", role: "Protagonist", trait: "Skeptical" },
      { name: "Sarah", role: "Hacker", trait: "Resourceful" }
    ],
    world_rules: [
      "No cell service in the building",
      "Time moves slower on upper floors"
    ]
  },
  episodes: [
    { ep: 1, summary: "Alex enters the building.", cliffhanger: "Elevator stops between floors." },
    { ep: 2, summary: "Sarah finds the blueprint.", cliffhanger: "Blueprint shows 13th floor." }
  ],
  bots: {
    sbaro: { state: "Monitoring", last_action: "Validated Ep 2 script" },
    nassro: { state: "Idle", last_action: "Generated Ep 2 dialogue" },
    mina: { state: "Rendering", last_action: "Generating Ep 2 thumbnails" }
  }
};

export default function ProductionTeam() {
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'story' | 'episodes' | 'bots'>('story');
  const [memory, setMemory] = useState(MOCK_MEMORY);

  // Simulate checking for active sessions
  useEffect(() => {
    // In a real app, fetch from /api/production/active
    // For demo, we start idle
  }, []);

  const startProduction = () => {
    setActiveSession(true);
  };

  const stopProduction = () => {
    setActiveSession(false);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
        
        {/* Left: Production Dashboard (Main Stage) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <ClapperboardIcon className="w-6 h-6 text-indigo-400" />
                Production Team
              </h1>
              <p className="text-zinc-400 text-sm">Live AI Agent Collaboration & Orchestration</p>
            </div>
            
            {!activeSession && (
              <button 
                onClick={startProduction}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Simulation
              </button>
            )}
            
            {activeSession && (
               <button 
                onClick={stopProduction}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition-colors"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Stop Session
              </button>
            )}
          </div>

          <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-2xl p-6 overflow-y-auto relative">
            {activeSession ? (
              <ProductionDashboard isActive={true} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 border border-white/5">
                  <Cpu className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">AI Studio is Idle</h3>
                <p className="text-sm max-w-xs text-center">No active production sessions. Start a new story or resume a previous session.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Memory Control Center */}
        <div className="w-full lg:w-96 flex flex-col bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">Memory Core</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-500 font-mono">ONLINE</span>
            </div>
          </div>

          {/* Memory Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'story', label: 'Global Story', icon: Database },
              { id: 'episodes', label: 'Episodes', icon: History },
              { id: 'bots', label: 'Bot States', icon: Cpu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors border-b-2",
                  activeTab === tab.id 
                    ? "text-white border-indigo-500 bg-white/5" 
                    : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Memory Content */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-300 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'story' && (
                <motion.div 
                  key="story"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-zinc-500 uppercase text-[10px] font-bold">Core Plot</label>
                    <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 text-emerald-300/90">
                      {JSON.stringify(memory.story.plot, null, 2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-500 uppercase text-[10px] font-bold">Characters</label>
                    <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 text-blue-300/90">
                      {JSON.stringify(memory.story.characters, null, 2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-500 uppercase text-[10px] font-bold">World Rules</label>
                    <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 text-amber-300/90">
                      {JSON.stringify(memory.story.world_rules, null, 2)}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'episodes' && (
                <motion.div 
                  key="episodes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {memory.episodes.map((ep, i) => (
                    <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-white/5">
                      <div className="flex justify-between mb-2">
                        <span className="text-indigo-400 font-bold">Ep {ep.ep}</span>
                        <span className="text-zinc-600">Archived</span>
                      </div>
                      <p className="text-zinc-400 mb-2">{ep.summary}</p>
                      <div className="text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 inline-block">
                        Cliffhanger: {ep.cliffhanger}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'bots' && (
                <motion.div 
                  key="bots"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {(Object.entries(memory.bots) as [string, typeof memory.bots[string]][]).map(([bot, data]) => (
                    <div key={bot} className="p-3 bg-zinc-900 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white capitalize mb-1">{bot}_bot</div>
                        <div className="text-zinc-500">{data.last_action}</div>
                      </div>
                      <div className={clsx(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        data.state === 'Idle' ? "bg-zinc-800 text-zinc-500" :
                        data.state === 'Monitoring' ? "bg-indigo-500/20 text-indigo-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      )}>
                        {data.state}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Memory Actions */}
          <div className="p-4 border-t border-white/10 bg-zinc-900/50 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors">
              <RefreshCw className="w-3 h-3" />
              Reset Memory
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors">
              <Save className="w-3 h-3" />
              Save Snapshot
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-950 border border-white/10 text-zinc-500 rounded-lg text-xs font-medium hover:text-white transition-colors">
              <Lock className="w-3 h-3" />
              Lock Story Canon
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ClapperboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.2 6 3 11l-.9-2.4c-.5-1.1.2-2.4 1.3-2.9l13.2-4.8c1.1-.5 2.4.2 2.9 1.3l.7 1.8Z" />
      <path d="m6.2 5.3 3.1 3.9" />
      <path d="m12.4 3.4 3.1 4" />
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  )
}
