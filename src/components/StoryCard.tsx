import { Link } from 'react-router-dom';
import { Calendar, Clock, PlayCircle, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Story {
  id: number;
  title: string;
  genre: string;
  tone: string;
  episode_count: number;
  created_at: string;
  summary: string;
}

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link 
      to={`/story/${story.id}`}
      className="group relative block bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950/90 z-10" />
      
      {/* Placeholder Image - In a real app, this would be the generated thumbnail */}
      <div className="h-48 w-full bg-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
        <img 
            src={`https://picsum.photos/seed/${story.id}/800/600`} 
            alt={story.title}
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 p-5 -mt-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
            {story.genre}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800/50 text-zinc-400 border border-white/5 backdrop-blur-md">
            {story.tone}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {story.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
          {story.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{story.episode_count} Eps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDistanceToNow(new Date(story.created_at))} ago</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High Viral Potential</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
