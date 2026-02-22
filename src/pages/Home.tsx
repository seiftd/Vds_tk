import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader2, Sparkles } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import Layout from '../components/Layout';
import { motion } from 'motion/react';

export default function Home() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-widest mb-2 text-glow">
            MY STORIES
          </h1>
          <p className="text-neon-cyan/60 font-mono tracking-widest uppercase text-sm">
            Manage your viral series and track performance
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            to="/create" 
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-deep-indigo text-white font-display font-bold tracking-wider uppercase overflow-hidden rounded-xl border border-neon-purple/50 transition-all hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <PlusCircle className="w-5 h-5 text-neon-cyan group-hover:text-white transition-colors" />
            <span className="relative z-10">New Story Series</span>
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-neon-purple/30 border-t-neon-cyan rounded-full animate-spin" />
            <div className="absolute inset-0 border-4 border-transparent border-b-neon-purple rounded-full animate-spin-reverse opacity-50" />
          </div>
          <p className="text-neon-cyan/50 font-mono text-xs animate-pulse">LOADING DATA STREAM...</p>
        </div>
      ) : stories.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-panel border-dashed border-white/10"
        >
          <div className="w-20 h-20 bg-deep-indigo rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(138,43,226,0.2)]">
            <Sparkles className="w-10 h-10 text-neon-purple" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">No Stories Found</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-8 font-body">
            The database is empty. Initialize your first viral series generation sequence.
          </p>
          <Link 
            to="/create" 
            className="text-neon-cyan hover:text-white font-display font-bold tracking-widest uppercase border-b border-neon-cyan/30 hover:border-neon-cyan transition-all pb-1"
          >
            Initialize Sequence &rarr;
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: any, index: number) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StoryCard story={story} />
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
