export enum ProductionState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  SCRIPT_GENERATING = 'SCRIPT_GENERATING',
  VISUAL_CREATING = 'VISUAL_CREATING',
  AUDIO_PROCESSING = 'AUDIO_PROCESSING',
  VIDEO_ASSEMBLING = 'VIDEO_ASSEMBLING',
  VALIDATING = 'VALIDATING',
  OPTIMIZING = 'OPTIMIZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ProductionJob {
  id: string;
  storyId: string;
  episodeId?: string;
  type: 'story-init' | 'script' | 'visual' | 'audio' | 'video' | 'validation';
  payload: any;
}

export interface BotLog {
  from: string;
  to?: string;
  message: string;
  type: 'info' | 'command' | 'success' | 'error';
  timestamp: string;
}
