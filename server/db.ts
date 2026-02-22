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

  // Settings Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      script_key TEXT,
      image_key TEXT,
      video_key TEXT,
      tts_key TEXT,
      music_key TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS telegram_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      bot_token TEXT,
      admin_id TEXT,
      is_enabled BOOLEAN DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      language TEXT DEFAULT 'English',
      theme TEXT DEFAULT 'dark',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS video_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      resolution TEXT DEFAULT '1080x1920',
      fps INTEGER DEFAULT 30,
      auto_subtitles BOOLEAN DEFAULT 1,
      auto_music BOOLEAN DEFAULT 1,
      cinematic_filter BOOLEAN DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Production Session & Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS production_sessions (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      status TEXT DEFAULT 'pending',
      progress INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bot_logs (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      from_bot TEXT,
      to_bot TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES production_sessions(id) ON DELETE CASCADE
    )
  `);

  // Memory Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS story_memory (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      plot TEXT,
      characters TEXT,
      timeline TEXT,
      world_rules TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS episode_memory (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      episode_number INTEGER,
      summary TEXT,
      key_events TEXT,
      cliffhanger TEXT,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bot_memory (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      bot_name TEXT,
      state TEXT,
      last_action TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  // Version Control
  db.exec(`
    CREATE TABLE IF NOT EXISTS story_versions (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      snapshot TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS episode_versions (
      id TEXT PRIMARY KEY,
      episode_id INTEGER,
      snapshot TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
    )
  `);

  // Continuity Guardian Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS continuity_checks (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      episode_id INTEGER,
      issues_found TEXT,
      resolution_action TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  // Scheduled Posts
  db.exec(`
    CREATE TABLE IF NOT EXISTS scheduled_posts (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      episode_id INTEGER,
      platform TEXT,
      scheduled_at DATETIME,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  // Video Analytics
  db.exec(`
    CREATE TABLE IF NOT EXISTS video_analytics (
      id TEXT PRIMARY KEY,
      story_id INTEGER,
      platform TEXT,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      retention_score REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  // Initialize default rows if they don't exist
  db.prepare("INSERT OR IGNORE INTO api_keys (id) VALUES (1)").run();
  db.prepare("INSERT OR IGNORE INTO telegram_settings (id) VALUES (1)").run();
  db.prepare("INSERT OR IGNORE INTO user_preferences (id) VALUES (1)").run();
  db.prepare("INSERT OR IGNORE INTO video_settings (id) VALUES (1)").run();
}

export function getDb() {
  if (!db) {
    initDb();
  }
  return db;
}
