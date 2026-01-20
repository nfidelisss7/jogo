
import { Entity } from '../../types';
import { SpatialHash } from '../../SpatialHash';
import { Perception } from './Perception';
import { AIStrategy } from './AIStrategy';
import { AIFactory } from '../AIFactory';

export class AIBrain {
  private entity: Entity;
  private strategy: AIStrategy;
  private thinkTimer: number = 0;
  private readonly thinkInterval: number; // Throttling logic
  private neighborsBuffer: Entity[] = [];

  constructor(entity: Entity, profileName?: string) {
    this.entity = entity;
    // Map Archetype to Strategy via Factory
    if (entity.archetype) {
        this.strategy = AIFactory.getStrategy(entity.archetype);
    } else {
        // Fallback for minions or unknown
        this.strategy = AIFactory.getStrategy('BASIC_CHASER' as any); 
    }
    
    // Randomize update phase to prevent CPU spikes
    this.thinkInterval = 30 + Math.random() * 30; // ~20-30 updates/sec equivalent
    this.thinkTimer = Math.random() * this.thinkInterval;
  }

  update(delta: number, player: Entity, spatialHash: SpatialHash) {
    this.thinkTimer -= delta;

    // AI LOGIC UPDATE (Throttled)
    if (this.thinkTimer <= 0) {
      this.thinkTimer = this.thinkInterval;

      // 1. Perception
      // Query neighbors for steering/avoidance
      // Optimization: Only fetch if the strategy likely needs it (most do for separation)
      this.neighborsBuffer = Perception.getNearbyEntities(this.entity, spatialHash, 100, 'enemy');

      // 2. Strategy Execution
      this.strategy.update(this.entity, player, {
          delta: this.thinkInterval, // Pass the interval as delta for stable integration in logic
          time: Date.now(),
          spatialHash: spatialHash,
          nearbyEnemies: this.neighborsBuffer
      });
    }

    // PHYSICS UPDATE (Every Frame)
    // The Strategy sets 'entity.velocity'. We apply it here or in GameEngine.
    // In GameEngine.ts, we currently do: entity.x += entity.velocity.x * delta;
    // So we don't need to apply position here, just ensure velocity is set.
  }
}
