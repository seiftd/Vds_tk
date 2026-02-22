import { JobQueue } from "./queue";
import { MemoryManager } from "./memory";
import { ContinuityGuardian } from "./guardian";
import { RenderEngine } from "./renderer";
import { ProductionState, ProductionJob, BotLog } from "./types";
import { getDb } from "../db";
import { broadcast } from "../websocket";
import crypto from "crypto";

export class ProductionEngine {
  private db = getDb();
  private memory = new MemoryManager();
  private guardian = new ContinuityGuardian();
  private renderer = new RenderEngine("/tmp");
  private queues: Record<string, JobQueue> = {};

  constructor() {
    this.queues.init = new JobQueue("story-init", this.processInit.bind(this));
    this.queues.script = new JobQueue("script-generation", this.processScript.bind(this));
    this.queues.visual = new JobQueue("visual-generation", this.processVisual.bind(this));
    this.queues.audio = new JobQueue("audio-processing", this.processAudio.bind(this));
    this.queues.video = new JobQueue("video-assembly", this.processVideo.bind(this));
  }

  async startProduction(storyId: string) {
    this.updateState(storyId, ProductionState.INITIALIZING);
    await this.queues.init.add("init", { storyId });
  }

  private async processInit(job: any) {
    const { storyId } = job.data;
    this.log('sbaro_bot', `Initializing story ${storyId}...`, undefined, 'command');
    
    // Load memory
    const context = await this.memory.loadContext(storyId);
    
    // Update state
    this.updateState(storyId, ProductionState.SCRIPT_GENERATING);
    
    // Trigger script generation
    await this.queues.script.add("script", { storyId, context });
  }

  private async processScript(job: any) {
    const { storyId, context } = job.data;
    this.log('nassro_bot', `Generating script for story ${storyId}...`, 'sbaro_bot', 'info');
    
    // Generate script using AI (mock)
    // ...
    
    // Check continuity
    const continuity = await this.guardian.checkContinuity(storyId, "ep1", { characters: [] });
    if (!continuity.valid) {
      this.log('continuity_guard_bot', `Continuity issues found: ${continuity.issues.join(", ")}`, 'nassro_bot', 'error');
      // Handle correction
    } else {
      this.log('continuity_guard_bot', 'Continuity check passed.', 'nassro_bot', 'success');
    }

    // Update state
    this.updateState(storyId, ProductionState.VISUAL_CREATING);
    
    // Trigger visual generation
    await this.queues.visual.add("visual", { storyId });
  }

  private async processVisual(job: any) {
    const { storyId } = job.data;
    this.log('mina_bot', `Creating visuals for story ${storyId}...`, 'sbaro_bot', 'info');
    
    // Generate visuals (mock)
    
    // Update state
    this.updateState(storyId, ProductionState.AUDIO_PROCESSING);
    
    // Trigger audio
    await this.queues.audio.add("audio", { storyId });
  }

  private async processAudio(job: any) {
    const { storyId } = job.data;
    this.log('wawa_bot', `Processing audio for story ${storyId}...`, 'sbaro_bot', 'info');
    
    // Generate audio (mock)
    
    // Update state
    this.updateState(storyId, ProductionState.VIDEO_ASSEMBLING);
    
    // Trigger video assembly
    await this.queues.video.add("video", { storyId });
  }

  private async processVideo(job: any) {
    const { storyId } = job.data;
    this.log('jrana_bot', `Assembling video for story ${storyId}...`, 'sbaro_bot', 'info');
    
    // Render video
    await this.renderer.renderEpisode("ep1", []);
    
    // Update state
    this.updateState(storyId, ProductionState.COMPLETED);
    this.log('jrana_bot', 'Production complete.', 'sbaro_bot', 'success');
  }

  private updateState(storyId: string, state: ProductionState) {
    // Update session state in DB
    this.db.prepare("UPDATE production_sessions SET status = ? WHERE story_id = ?").run(state, storyId);
    
    // Broadcast via WebSocket
    broadcast({ type: 'production:state_update', storyId, state });
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
}
