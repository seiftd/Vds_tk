import { getDb } from "../db";
import crypto from "crypto";

export class ContinuityGuardian {
  private db = getDb();

  async checkContinuity(storyId: string, episodeId: string, newContent: any) {
    // Logic to check for continuity errors
    // 1. Check character consistency
    // 2. Check timeline conflicts
    // 3. Check rule violations
    
    // Mock check
    const issues = [];
    if (newContent.characters && newContent.characters.length > 0) {
      // Check if characters exist in memory
      const memory = this.db.prepare("SELECT characters FROM story_memory WHERE story_id = ?").get(storyId) as any;
      const existingCharacters = JSON.parse(memory.characters);
      
      for (const char of newContent.characters) {
        const exists = existingCharacters.find((c: any) => c.name === char.name);
        if (!exists) {
          issues.push(`New character introduced without setup: ${char.name}`);
        }
      }
    }

    if (issues.length > 0) {
      this.logIssue(storyId, episodeId, issues.join(", "));
      return { valid: false, issues };
    }

    return { valid: true };
  }

  logIssue(storyId: string, episodeId: string, issues: string) {
    this.db.prepare("INSERT INTO continuity_checks (id, story_id, episode_id, issues_found, resolution_action) VALUES (?, ?, ?, ?, ?)").run(
      crypto.randomUUID(),
      storyId,
      episodeId,
      issues,
      "Flagged for review"
    );
  }
}
