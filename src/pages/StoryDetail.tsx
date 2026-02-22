import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, PlayCircle, Clock, Share2, Download, ChevronRight, Film } from 'lucide-react';
import Layout from '../components/Layout';

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stories/${id}`)
      .then(res => res.json())
      .then(data => {
        setStory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white">Story not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-20 p-8 md:p-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
              {story.genre}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/5 backdrop-blur-md">
              {story.tone}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {story.title}
          </h1>
          
          <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
            {story.summary}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors">
              <PlayCircle className="w-5 h-5" />
              Start Production
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
              <Share2 className="w-5 h-5" />
              Share Series
            </button>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Episodes ({story.episodes.length})</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            Export All Scripts
          </button>
        </div>

        <div className="grid gap-4">
          {story.episodes.map((episode: any) => (
            <Link 
              key={episode.id} 
              to={`/episode/${episode.id}`}
              className="group flex items-center gap-6 p-4 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-zinc-900/80 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl font-bold text-zinc-600 group-hover:text-indigo-500 transition-colors">
                {episode.episode_number}
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">
                  {episode.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-1 mb-2">
                  {episode.summary}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2:00
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    Viral Score: {episode.viral_score}/100
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
