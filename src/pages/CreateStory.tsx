import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from '../components/Layout';
import ProductionDashboard from '../components/ProductionDashboard';

export default function CreateStory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    genre: 'Mystery',
    tone: 'Suspense',
    language: 'English',
    storyLanguage: 'English',
    audience: 'Global',
    episodeCount: 10
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowDashboard(true);

    // Scroll to dashboard
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const res = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }
      
      // Wait a bit for the animation to finish if it hasn't already
      setTimeout(() => {
        navigate(`/story/${data.id}`);
      }, 15000); // Give the user time to enjoy the show (15s)

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setLoading(false);
      setShowDashboard(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Series</h1>
          <p className="text-zinc-400">Configure your viral story engine. The AI will handle the rest.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Genre</label>
              <select 
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={formData.genre}
                onChange={e => setFormData({...formData, genre: e.target.value})}
              >
                <option>Mystery</option>
                <option>Historical</option>
                <option>Fantasy</option>
                <option>Mythology</option>
                <option>Horror</option>
                <option>True Crime</option>
                <option>Sci-Fi</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Tone</label>
              <select 
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={formData.tone}
                onChange={e => setFormData({...formData, tone: e.target.value})}
              >
                <option>Suspense</option>
                <option>Dark</option>
                <option>Epic</option>
                <option>Emotional</option>
                <option>Documentary</option>
                <option>Dramatic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">UI Language</label>
              <select 
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={formData.language}
                onChange={e => setFormData({...formData, language: e.target.value})}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Arabic</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Story Content Language</label>
              <select 
                className="w-full bg-zinc-950 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={formData.storyLanguage}
                onChange={e => setFormData({...formData, storyLanguage: e.target.value})}
              >
                <option>English</option>
                <option>Arabic</option>
                <option>French</option>
                <option>Auto Detect</option>
              </select>
              <p className="text-xs text-zinc-500">Controls script, voiceover, and subtitles language.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Target Audience</label>
              <select 
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                value={formData.audience}
                onChange={e => setFormData({...formData, audience: e.target.value})}
              >
                <option>Global</option>
                <option>Teenagers (Gen Z)</option>
                <option>Adults</option>
                <option>History Buffs</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Episode Count ({formData.episodeCount})</label>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1"
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              value={formData.episodeCount}
              onChange={e => setFormData({...formData, episodeCount: parseInt(e.target.value)})}
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>5 Episodes</span>
              <span>30 Episodes</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-5 h-5" />
              {loading ? 'Production Started...' : 'Generate Full Series'}
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4">
              AI will generate the full arc, characters, and episode breakdowns.
            </p>
          </div>
        </form>

        {/* Production Team Section */}
        <AnimatePresence>
          {showDashboard && (
            <motion.div
              ref={dashboardRef}
              initial={{ opacity: 0, height: 0, y: 50 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-8 border-t border-white/10">
                <ProductionDashboard isActive={showDashboard} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
