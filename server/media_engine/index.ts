import { productionEngine } from "../production";
import { DistributionEngine } from "./distribution";
import { AnalyticsEngine } from "./analytics";
import { OptimizationEngine } from "./optimization";
import { SceneDirector } from "./scene_director";
import { getDb } from "../db";
import { broadcast } from "../websocket";
import { BotLog } from "../production/types";

export class MediaAutomationEngine {
  private db = getDb();
  private production = productionEngine;
  private distribution = new DistributionEngine();
  private analytics = new AnalyticsEngine();
  private optimization = new OptimizationEngine();
  private sceneDirector = new SceneDirector();

  constructor() {
    // Listen for production completion globally
    this.production.on('completed', this.handleProductionCompleted.bind(this));
  }

  async startFullAutomation(storyId: string) {
    this.log('viral_bot', `Analyzing viral potential for story ${storyId}...`, undefined, 'info');
    
    // 1. Optimize Script
    const script = await this.optimization.analyzeHook("Initial script...");
    this.log('viral_bot', `Script optimized: ${script.suggestion}`, 'nassro_bot', 'success');

    // 2. Production
    await this.production.startProduction(storyId);
  }

  private async handleProductionCompleted({ storyId }: { storyId: string }) {
    this.log('scene_bot', `Production completed. Starting post-production...`, 'sbaro_bot', 'info');

    // 3. Scene Direction (Mock step after production)
    const scene = await this.sceneDirector.directScene("Scene 1", 15);
    this.log('scene_bot', `Scene directed: ${scene.camera}`, 'jrana_bot', 'success');

    // 4. Schedule Distribution
    // Mock: Schedule for 1 hour later
    const scheduled = await this.distribution.schedulePost(parseInt(storyId), 1, "TikTok", new Date(Date.now() + 3600000));
    this.log('distro_bot', `Scheduled post for TikTok at ${new Date(Date.now() + 3600000).toLocaleTimeString()}`, undefined, 'success');

    // 5. Analytics Loop (Mock)
    const trends = await this.analytics.analyzeTrends();
    this.log('analytics_bot', `Viral trends analyzed: ${trends.topGenre}`, 'viral_bot', 'info');
  }

  private log(from: string, message: string, to?: string, type: BotLog['type'] = 'info') {
    const log: BotLog = {
      from,
      to,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    broadcast({ type: 'production:bot_log', log });
  }

  // Expose sub-engines
  get productionEngine() { return this.production; }
  get distributionEngine() { return this.distribution; }
  get analyticsEngine() { return this.analytics; }
  get optimizationEngine() { return this.optimization; }
}

export const mediaEngine = new MediaAutomationEngine();
