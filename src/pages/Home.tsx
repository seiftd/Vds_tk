import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import Layout from '../components/Layout';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Stories</h1>
          <p className="text-zinc-400">Manage your viral series and track performance.</p>
        </div>
        <Link 
          to="/create" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Story Series</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No stories yet</h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-6">Start generating your first viral series. It only takes a few seconds.</p>
          <Link 
            to="/create" 
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Create your first story &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story: any) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </Layout>
  );
}
