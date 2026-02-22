import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, PlayCircle, TrendingUp, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';

interface Story {
  id: number;
  title: string;
  genre: string;
  tone: string;
  episode_count: number;
  created_at: string;
  summary: string;
}

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <Link 
      to={`/story/${story.id}`}
      className="group relative block glass-panel overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(138,43,226,0.2)]"
    >
      {/* Neon Border Effect */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-neon-cyan/50 transition-colors duration-500 z-20" />
      
      {/* Image Container */}
      <div className="h-56 w-full bg-deep-indigo relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-neon-purple/20 mix-blend-overlay z-10 group-hover:bg-neon-cyan/20 transition-colors duration-500" />
        
        <motion.img 
            src={`https://picsum.photos/seed/${story.id}/800/600`} 
            alt={story.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
        />
        
        {/* Floating Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-neon-cyan/30 flex items-center gap-2">
            <Zap className="w-3 h-3 text-neon-cyan animate-pulse" />
            <span className="text-[10px] font-display font-bold text-white tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 p-6 -mt-12">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider bg-neon-purple/20 text-neon-purple border border-neon-purple/30 backdrop-blur-md shadow-[0_0_10px_rgba(138,43,226,0.2)]">
            {story.genre}
          </span>
          <span className="px-3 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider bg-deep-indigo/80 text-zinc-400 border border-white/10 backdrop-blur-md">
            {story.tone}
          </span>
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight group-hover:text-neon-cyan transition-colors text-glow">
          {story.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-body leading-relaxed group-hover:text-zinc-300 transition-colors">
          {story.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group-hover:text-neon-cyan transition-colors">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{story.episode_count} EPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDistanceToNow(new Date(story.created_at))} AGO</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-neon-purple group-hover:text-neon-cyan transition-colors">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wider">VIRAL</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StoryCard;
