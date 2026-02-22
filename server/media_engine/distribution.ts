import { getDb } from "../db";
import { v4 as uuidv4 } from "uuid";

export class DistributionEngine {
  private db = getDb();

  async schedulePost(storyId: number, episodeId: number, platform: string, scheduledAt: Date) {
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO scheduled_posts (id, story_id, episode_id, platform, scheduled_at, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(id, storyId, episodeId, platform, scheduledAt.toISOString());
    return id;
  }

  async publishNow(storyId: number, episodeId: number, platform: string) {
    console.log(`[Distribution] Publishing story ${storyId} episode ${episodeId} to ${platform}...`);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[Distribution] Published successfully.`);
    return true;
  }

  async checkScheduledPosts() {
    const now = new Date().toISOString();
    const posts = this.db.prepare(`
      SELECT * FROM scheduled_posts WHERE status = 'pending' AND scheduled_at <= ?
    `).all(now) as any[];

    for (const post of posts) {
      await this.publishNow(post.story_id, post.episode_id, post.platform);
      this.db.prepare("UPDATE scheduled_posts SET status = 'published' WHERE id = ?").run(post.id);
    }
  }
}
