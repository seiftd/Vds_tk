import Database from "better-sqlite3";

let db: Database.Database;

export function initDb() {
  db = new Database("mythoria.db");
  db.pragma("journal_mode = WAL");

  // Stories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      tone TEXT NOT NULL,
      language TEXT NOT NULL,
      audience TEXT NOT NULL,
      episode_count INTEGER NOT NULL,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Episodes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS episodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL,
      episode_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      hook TEXT,
      cliffhanger TEXT,
      viral_score INTEGER DEFAULT 0,
      seo_description TEXT,
      hashtags TEXT,
      thumbnail_prompt TEXT,
      thumbnail_text_overlay TEXT,
      caption_short TEXT,
      caption_long TEXT,
      cta_script TEXT,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  // Migrations for existing databases
  try { db.exec("ALTER TABLE episodes ADD COLUMN thumbnail_text_overlay TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE episodes ADD COLUMN caption_short TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE episodes ADD COLUMN caption_long TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE episodes ADD COLUMN cta_script TEXT"); } catch (e) {}

  // Scenes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS scenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      episode_id INTEGER NOT NULL,
      scene_number INTEGER NOT NULL,
      title TEXT,
      duration INTEGER,
      visual_prompt TEXT,
      camera_movement TEXT,
      lighting TEXT,
      sound_design TEXT,
      voiceover_script TEXT,
      captions TEXT,
      hook_text TEXT,
      FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
    )
  `);
}

export function getDb() {
  if (!db) {
    initDb();
  }
  return db;
}
