import { Express, Request, Response } from "express";
import { getDb } from "./db";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization to ensure env vars are loaded
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Valid API Key not found. Please configure GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export function registerRoutes(app: Express) {
  
  // Get all stories
  app.get("/api/stories", (req, res) => {
    const db = getDb();
    const stories = db.prepare("SELECT * FROM stories ORDER BY created_at DESC").all();
    res.json(stories);
  });

  // Get single story with episodes
  app.get("/api/stories/:id", (req, res) => {
    const db = getDb();
    const story = db.prepare("SELECT * FROM stories WHERE id = ?").get(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    
    const episodes = db.prepare("SELECT * FROM episodes WHERE story_id = ? ORDER BY episode_number ASC").all(req.params.id);
    res.json({ ...story, episodes });
  });

  // Get single episode with scenes
  app.get("/api/episodes/:id", (req, res) => {
    const db = getDb();
    const episode = db.prepare("SELECT * FROM episodes WHERE id = ?").get(req.params.id);
    if (!episode) return res.status(404).json({ error: "Episode not found" });

    const scenes = db.prepare("SELECT * FROM scenes WHERE episode_id = ? ORDER BY scene_number ASC").all(req.params.id);
    res.json({ ...episode, scenes });
  });

  // Create Story (AI Generation)
  app.post("/api/stories/generate", async (req: Request, res: Response) => {
    try {
      const { genre, tone, language, audience, episodeCount } = req.body;
      const db = getDb();

      const prompt = `
        Act as a world-class viral content strategist and screenwriter for Netflix and TikTok.
        Generate a complete multi-episode storyline for a short-form video series (Reels/TikTok).
        
        Genre: ${genre}
        Tone: ${tone}
        Target Language: ${language}
        Target Audience: ${audience}
        Episode Count: ${episodeCount}

        Requirements:
        - Each episode must be structured for exactly 2 minutes.
        - High viral potential.
        - Strong cliffhangers.
        - Cohesive story arc.
        - Mystery layers and plot twists.
        
        For the thumbnail:
        - Create a dramatic, clickable visual prompt.
        - Suggest a short, punchy text overlay (max 5 words) that creates curiosity.
      `;

      const response = await getAI().models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    episodes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                episode_number: { type: Type.INTEGER },
                                title: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                hook: { type: Type.STRING },
                                cliffhanger: { type: Type.STRING },
                                viral_score: { type: Type.INTEGER },
                                seo_description: { type: Type.STRING },
                                hashtags: { type: Type.STRING },
                                thumbnail_prompt: { type: Type.STRING },
                                thumbnail_text_overlay: { type: Type.STRING },
                                caption_short: { type: Type.STRING },
                                caption_long: { type: Type.STRING },
                                cta_script: { type: Type.STRING }
                            },
                            required: ["episode_number", "title", "summary"]
                        }
                    }
                },
                required: ["title", "summary", "episodes"]
            }
        }
      });

      let text = response.text();
      // Clean markdown code blocks if present
      text = text.replace(/```json\n?|```/g, "").trim();
      
      let generatedStory;
      try {
        generatedStory = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Invalid JSON response from AI: " + text.substring(0, 100));
      }

      // 2. Save to DB
      const insertStory = db.prepare(`
        INSERT INTO stories (title, genre, tone, language, audience, episode_count, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const storyResult = insertStory.run(
        generatedStory.title,
        genre,
        tone,
        language,
        audience,
        episodeCount,
        generatedStory.summary
      );
      
      const storyId = storyResult.lastInsertRowid;

      const insertEpisode = db.prepare(`
        INSERT INTO episodes (story_id, episode_number, title, summary, hook, cliffhanger, viral_score, seo_description, hashtags, thumbnail_prompt, thumbnail_text_overlay, caption_short, caption_long, cta_script)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const ep of generatedStory.episodes) {
        insertEpisode.run(
          storyId,
          ep.episode_number,
          ep.title,
          ep.summary,
          ep.hook || "",
          ep.cliffhanger || "",
          ep.viral_score || 0,
          ep.seo_description || "",
          ep.hashtags || "",
          ep.thumbnail_prompt || "",
          ep.thumbnail_text_overlay || "",
          ep.caption_short || "",
          ep.caption_long || "",
          ep.cta_script || ""
        );
      }

      res.json({ id: storyId, ...generatedStory });

    } catch (error: any) {
      console.error("Story generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate story" });
    }
  });

  // Generate Scenes for an Episode
  app.post("/api/episodes/:id/generate-scenes", async (req: Request, res: Response) => {
    try {
        const episodeId = req.params.id;
        const db = getDb();
        
        // Get episode and story context
        const episode = db.prepare("SELECT * FROM episodes WHERE id = ?").get(episodeId);
        if (!episode) return res.status(404).json({ error: "Episode not found" });
        
        const story = db.prepare("SELECT * FROM stories WHERE id = ?").get(episode.story_id);

        const prompt = `
            Generate a detailed scene breakdown for Episode ${episode.episode_number}: "${episode.title}" of the story "${story.title}".
            
            Story Context: ${story.summary}
            Episode Summary: ${episode.summary}
            Genre: ${story.genre}
            Tone: ${story.tone}

            Requirements:
            - 6-10 scenes total.
            - Total duration exactly 120 seconds.
            - Vertical 9:16 cinematic visuals.
            - Viral retention hooks.
            - Netflix documentary style + TikTok pacing.
        `;

        const response = await getAI().models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    scene_number: { type: Type.INTEGER },
                                    title: { type: Type.STRING },
                                    duration: { type: Type.INTEGER },
                                    visual_prompt: { type: Type.STRING },
                                    camera_movement: { type: Type.STRING },
                                    lighting: { type: Type.STRING },
                                    sound_design: { type: Type.STRING },
                                    voiceover_script: { type: Type.STRING },
                                    captions: { type: Type.STRING },
                                    hook_text: { type: Type.STRING }
                                },
                                required: ["scene_number", "title", "duration", "visual_prompt", "camera_movement", "lighting", "sound_design", "voiceover_script", "captions", "hook_text"]
                            }
                        }
                    },
                    required: ["scenes"]
                }
            }
        });

        let text = response.text();
        // Clean markdown code blocks if present
        text = text.replace(/```json\n?|```/g, "").trim();

        let generatedScenes;
        try {
            generatedScenes = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            throw new Error("Invalid JSON response from AI");
        }

        // Save scenes
        const insertScene = db.prepare(`
            INSERT INTO scenes (episode_id, scene_number, title, duration, visual_prompt, camera_movement, lighting, sound_design, voiceover_script, captions, hook_text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Clear existing scenes for this episode first (re-generation)
        db.prepare("DELETE FROM scenes WHERE episode_id = ?").run(episodeId);

        for (const scene of generatedScenes.scenes) {
            insertScene.run(
                episodeId,
                scene.scene_number,
                scene.title,
                scene.duration,
                scene.visual_prompt,
                scene.camera_movement,
                scene.lighting,
                scene.sound_design,
                scene.voiceover_script,
                scene.captions,
                scene.hook_text
            );
        }

        res.json(generatedScenes);

    } catch (error) {
        console.error("Scene generation error:", error);
        res.status(500).json({ error: "Failed to generate scenes" });
    }
  });
}
