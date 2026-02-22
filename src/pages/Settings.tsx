import React, { useEffect, useState } from 'react';
import { 
  Save, 
  Key, 
  MessageSquare, 
  Globe, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Bot
} from 'lucide-react';
import Layout from '../components/Layout';
import { clsx } from 'clsx';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('keys');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  
  const [settings, setSettings] = useState({
    apiKeys: {
      script_key: '',
      image_key: '',
      video_key: '',
      tts_key: '',
      music_key: ''
    },
    telegram: {
      bot_token: '',
      admin_id: '',
      is_enabled: false
    },
    preferences: {
      language: 'English',
      theme: 'dark'
    },
    video: {
      resolution: '1080x1920',
      fps: 30,
      auto_subtitles: true,
      auto_music: true,
      cinematic_filter: false
    }
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      let endpoint = '';
      let body = {};

      switch (section) {
        case 'keys':
          endpoint = '/api/settings/keys';
          body = settings.apiKeys;
          break;
        case 'telegram':
          endpoint = '/api/settings/telegram';
          body = settings.telegram;
          break;
        case 'preferences':
          endpoint = '/api/settings/preferences';
          body = settings.preferences;
          break;
        case 'video':
          endpoint = '/api/settings/video';
          body = settings.video;
          break;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to save');
      
      // Show success toast (mock)
      alert('Settings saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
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

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <h1 className="text-3xl font-bold text-white mb-6 px-2">Settings</h1>
          
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'telegram', label: 'Telegram Bot', icon: Bot },
            { id: 'preferences', label: 'Language & UI', icon: Globe },
            { id: 'video', label: 'Video Render', icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          
          {/* API Keys Section */}
          {activeTab === 'keys' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">AI API Keys</h2>
                    <p className="text-sm text-zinc-400">Manage your connections to AI services.</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Secure Storage
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { key: 'script_key', label: 'Script Generation (Gemini/OpenAI)', placeholder: 'sk-...' },
                    { key: 'image_key', label: 'Image Generation (Midjourney/DALL-E)', placeholder: 'key-...' },
                    { key: 'video_key', label: 'Video Generation (Runway/Pika)', placeholder: 'key-...' },
                    { key: 'tts_key', label: 'Text-to-Speech (ElevenLabs)', placeholder: 'xi-...' },
                    { key: 'music_key', label: 'Background Music (Suno/Udio)', placeholder: 'key-...' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showKeys[field.key] ? "text" : "password"}
                          value={(settings.apiKeys as any)[field.key] || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            apiKeys: { ...settings.apiKeys, [field.key]: e.target.value }
                          })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-4 pr-24 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                          placeholder={field.placeholder}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={() => toggleShowKey(field.key)}
                            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            {showKeys[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleSave('keys')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save API Keys
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Telegram Section */}
          {activeTab === 'telegram' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Telegram Remote Control</h2>
                    <p className="text-sm text-zinc-400">Control your SaaS directly from Telegram.</p>
                  </div>
                  <Bot className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-white/5">
                    <div>
                      <h3 className="font-medium text-white">Enable Remote Control</h3>
                      <p className="text-xs text-zinc-500">Allow bot to execute commands</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.telegram.is_enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          telegram: { ...settings.telegram, is_enabled: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Bot Token</label>
                    <input
                      type="password"
                      value={settings.telegram.bot_token || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        telegram: { ...settings.telegram, bot_token: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                      placeholder="123456789:ABCdef..."
                    />
                    <p className="text-xs text-zinc-500">From @BotFather</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Admin User ID</label>
                    <input
                      type="text"
                      value={settings.telegram.admin_id || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        telegram: { ...settings.telegram, admin_id: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                      placeholder="12345678"
                    />
                    <p className="text-xs text-zinc-500">Your numeric Telegram ID (use @userinfobot to find it)</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleSave('telegram')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Telegram Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Language & UI</h2>
                    <p className="text-sm text-zinc-400">Customize your dashboard experience.</p>
                  </div>
                  <Globe className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Interface Language</label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option>English</option>
                      <option>Arabic (العربية)</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Theme</label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value="dark">Dark Cinematic</option>
                      <option value="light">Light (Coming Soon)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleSave('preferences')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Settings Section */}
          {activeTab === 'video' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Video Render Settings</h2>
                    <p className="text-sm text-zinc-400">Configure default output settings for your reels.</p>
                  </div>
                  <Video className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Default Resolution</label>
                    <select
                      value={settings.video.resolution}
                      onChange={(e) => setSettings({
                        ...settings,
                        video: { ...settings.video, resolution: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value="1080x1920">1080x1920 (9:16 HD)</option>
                      <option value="720x1280">720x1280 (9:16 SD)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Frame Rate</label>
                    <select
                      value={settings.video.fps}
                      onChange={(e) => setSettings({
                        ...settings,
                        video: { ...settings.video, fps: parseInt(e.target.value) }
                      })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value={30}>30 FPS</option>
                      <option value={60}>60 FPS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'auto_subtitles', label: 'Auto-Generate Subtitles', desc: 'Burn captions into video' },
                    { key: 'auto_music', label: 'Auto-Add Background Music', desc: 'Select mood-based music automatically' },
                    { key: 'cinematic_filter', label: 'Apply Cinematic Filters', desc: 'Color grading and grain effects' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-white/5">
                      <div>
                        <h3 className="font-medium text-white">{item.label}</h3>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={(settings.video as any)[item.key]}
                          onChange={(e) => setSettings({
                            ...settings,
                            video: { ...settings.video, [item.key]: e.target.checked }
                          })}
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleSave('video')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Video Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
