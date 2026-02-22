import { getDb } from "../db";
import { v4 as uuidv4 } from "uuid";

export class AnalyticsEngine {
  private db = getDb();

  async trackPerformance(storyId: number, platform: string, views: number, likes: number, comments: number, retentionScore: number) {
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO video_analytics (id, story_id, platform, views, likes, comments, retention_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, storyId, platform, views, likes, comments, retentionScore);
    return id;
  }

  async getPerformanceReport(storyId: number) {
    return this.db.prepare(`
      SELECT * FROM video_analytics WHERE story_id = ? ORDER BY created_at DESC
    `).all(storyId);
  }

  async analyzeTrends() {
    // Mock analysis
    console.log("[Analytics] Analyzing viral trends...");
    return {
      topGenre: "Sci-Fi",
      bestTime: "18:00",
      retentionSpike: "00:05"
    };
  }
}
