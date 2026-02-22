import { Queue, Worker, QueueEvents } from "bullmq";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const USE_REDIS = process.env.USE_REDIS === "true";

// Mock Redis if not available
let redis: any;

if (USE_REDIS) {
  try {
    redis = new Redis(REDIS_URL, { 
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("Redis connection failed, falling back to in-memory queue");
          redis = null;
          return null;
        }
        return Math.min(times * 50, 2000);
      }
    });
    
    redis.on('error', (err: any) => {
      console.warn("Redis error:", err.message);
    });
  } catch (e) {
    console.warn("Redis initialization failed, using in-memory queue simulation");
    redis = null;
  }
} else {
  console.log("Using in-memory queue simulation (USE_REDIS not set)");
}

export class JobQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(name: string, processor: (job: any) => Promise<any>) {
    if (redis) {
      this.queue = new Queue(name, { connection: redis });
      this.worker = new Worker(name, processor, { connection: redis });
    } else {
      // In-memory fallback
      this.queue = {
        add: async (jobName: string, data: any) => {
          console.log(`[In-Memory Queue] Adding job ${jobName} to ${name}`);
          // Simulate async processing
          setTimeout(async () => {
            try {
              console.log(`[In-Memory Worker] Processing job ${jobName} in ${name}`);
              await processor({ data });
              console.log(`[In-Memory Worker] Completed job ${jobName} in ${name}`);
            } catch (error) {
              console.error(`[In-Memory Worker] Failed job ${jobName} in ${name}:`, error);
            }
          }, 100);
          return { id: Math.random().toString(36), name: jobName, data };
        }
      } as any;
      
      this.worker = {
        on: (event: string, callback: any) => {
          // Mock event listener
        }
      } as any;
    }
  }

  async add(name: string, data: any) {
    return this.queue.add(name, data);
  }
}
