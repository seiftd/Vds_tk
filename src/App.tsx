/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import StoryDetail from './pages/StoryDetail';
import EpisodeDetail from './pages/EpisodeDetail';
import Library from './pages/Library';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateStory />} />
      <Route path="/story/:id" element={<StoryDetail />} />
      <Route path="/episode/:id" element={<EpisodeDetail />} />
      <Route path="/library" element={<Library />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
