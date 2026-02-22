import { getDb } from "../db";
import crypto from "crypto";

export class MemoryManager {
  private db = getDb();

  async loadContext(storyId: string, episodeNumber?: number) {
    const storyMemory = this.db.prepare("SELECT * FROM story_memory WHERE story_id = ?").get(storyId) as any;
    
    let episodeMemory = null;
    if (episodeNumber && episodeNumber > 1) {
      // Load previous episode memory
      episodeMemory = this.db.prepare("SELECT * FROM episode_memory WHERE story_id = ? AND episode_number = ?").get(storyId, episodeNumber - 1);
    }

    // Load bot states
    const botMemory = this.db.prepare("SELECT * FROM bot_memory WHERE story_id = ?").all(storyId);

    // Compress context if needed (mock logic)
    const context = {
      story: storyMemory ? {
        plot: JSON.parse(storyMemory.plot),
        characters: JSON.parse(storyMemory.characters),
        timeline: JSON.parse(storyMemory.timeline),
        world_rules: JSON.parse(storyMemory.world_rules)
      } : {},
      previous_episode: episodeMemory ? {
        summary: episodeMemory.summary,
        key_events: JSON.parse(episodeMemory.key_events),
        cliffhanger: episodeMemory.cliffhanger
      } : null,
      bots: botMemory.reduce((acc: any, bot: any) => {
        acc[bot.bot_name] = {
          state: JSON.parse(bot.state),
          last_action: bot.last_action
        };
        return acc;
      }, {})
    };

    return context;
  }

  async saveSnapshot(storyId: string, episodeId?: string) {
    const context = await this.loadContext(storyId);
    
    if (episodeId) {
      this.db.prepare("INSERT INTO episode_versions (id, episode_id, snapshot) VALUES (?, ?, ?)").run(
        crypto.randomUUID(),
        episodeId,
        JSON.stringify(context)
      );
    } else {
      this.db.prepare("INSERT INTO story_versions (id, story_id, snapshot) VALUES (?, ?, ?)").run(
        crypto.randomUUID(),
        storyId,
        JSON.stringify(context)
      );
    }
  }

  async summarize(storyId: string) {
    // Logic to summarize past 3 episodes into story memory
    // This would use LLM to compress the plot
    console.log(`Summarizing memory for story ${storyId}...`);
  }
}
