import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Clapperboard, Camera, Mic, Music, Type, Wand2 } from 'lucide-react';
import Layout from '../components/Layout';
import { clsx } from 'clsx';

export default function EpisodeDetail() {
  const { id } = useParams();
  const [episode, setEpisode] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchEpisodeData();
  }, [id]);

  const fetchEpisodeData = () => {
    setLoading(true);
    fetch(`/api/episodes/${id}`)
      .then(res => res.json())
      .then(data => {
        setEpisode(data);
        setScenes(data.scenes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const generateScenes = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/episodes/${id}/generate-scenes`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      setScenes(data.scenes);
    } catch (error) {
      console.error(error);
      alert('Failed to generate scenes');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!episode) return null;

  return (
    <Layout>
      <div className="mb-8">
        <Link 
          to={`/story/${episode.story_id}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Story
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ep {episode.episode_number}: {episode.title}
            </h1>
            <p className="text-zinc-400 max-w-2xl">{episode.summary}</p>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={generateScenes}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {scenes.length > 0 ? 'Regenerate Scenes' : 'Generate Scenes'}
              </button>
          </div>
        </div>
      </div>

      {/* Viral Hooks Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Opening Hook (0-3s)</h3>
          <p className="text-sm text-white font-medium">"{episode.hook}"</p>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cliffhanger (End)</h3>
          <p className="text-sm text-white font-medium">"{episode.cliffhanger}"</p>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Viral Prediction</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${episode.viral_score}%` }} 
              />
            </div>
            <span className="text-sm font-bold text-emerald-500">{episode.viral_score}%</span>
          </div>
        </div>
      </div>

      {/* Scenes List */}
      {scenes.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-2xl border-dashed">
          <Clapperboard className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No scenes generated yet</h3>
          <p className="text-zinc-500 mb-6">Generate the scene breakdown to start production.</p>
          <button 
            onClick={generateScenes}
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            Generate Scene Breakdown
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Scene Breakdown</h2>
          <div className="grid gap-6">
            {scenes.map((scene, index) => (
              <div key={index} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-zinc-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                      {scene.scene_number}
                    </span>
                    <h3 className="font-bold text-white">{scene.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-white/5">
                    {scene.duration}s
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Visuals Column */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                        <Camera className="w-3 h-3" /> Visual Prompt
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                        {scene.visual_prompt}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Camera</div>
                        <p className="text-xs text-zinc-300">{scene.camera_movement}</p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lighting</div>
                        <p className="text-xs text-zinc-300">{scene.lighting}</p>
                      </div>
                    </div>
                  </div>

                  {/* Audio/Text Column */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                        <Mic className="w-3 h-3" /> Voiceover
                      </div>
                      <p className="text-sm text-white font-serif italic leading-relaxed pl-4 border-l-2 border-emerald-500/30">
                        "{scene.voiceover_script}"
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        <Type className="w-3 h-3" /> On-Screen Caption
                      </div>
                      <p className="text-sm text-zinc-300 font-bold bg-zinc-800/50 p-2 rounded-lg inline-block">
                        {scene.captions}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                        <Music className="w-3 h-3" /> Sound Design
                      </div>
                      <p className="text-xs text-zinc-400">
                        {scene.sound_design}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
