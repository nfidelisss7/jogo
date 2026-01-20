
import { EnemyArchetype } from '../../types';
import { InfestationConfig } from './InfestationConfig';
import { InfestationState } from './InfestationState';

export class InfestationSystem {
  private state: InfestationState;
  private onAlert: (message: string | null) => void;

  constructor(onAlert: (message: string | null) => void) {
    this.onAlert = onAlert;
    this.state = {
      isActive: false,
      cycleTimer: 0,
      durationTimer: 0,
      currentArchetype: null,
      spawnAccumulator: 0
    };
  }

  public update(delta: number, currentGlobalSpawnInterval: number): EnemyArchetype | null {
    // 1. Handle Active Infestation
    if (this.state.isActive) {
      this.state.durationTimer -= delta;

      if (this.state.durationTimer <= 0) {
        this.endInfestation();
        return null;
      }

      // Calculate Horde Spawn Logic
      // We want to spawn the specific archetype at a rate relative to the game's current difficulty
      const hordeInterval = currentGlobalSpawnInterval * InfestationConfig.SPAWN_RATE_MULTIPLIER;
      
      this.state.spawnAccumulator += delta;
      
      if (this.state.spawnAccumulator >= hordeInterval) {
        this.state.spawnAccumulator -= hordeInterval;
        return this.state.currentArchetype; // Signal GameEngine to spawn this specific enemy
      }
    } 
    
    // 2. Handle Cycle Timer (Waiting for next horde)
    else {
      this.state.cycleTimer += delta;
      if (this.state.cycleTimer >= InfestationConfig.INTERVAL) {
        this.startInfestation();
      }
    }

    return null;
  }

  private startInfestation() {
    // Pick random enemy
    const pool = InfestationConfig.VALID_ARCHETYPES;
    const archetype = pool[Math.floor(Math.random() * pool.length)];
    
    this.state.isActive = true;
    this.state.currentArchetype = archetype;
    this.state.durationTimer = InfestationConfig.DURATION;
    this.state.cycleTimer = 0;
    this.state.spawnAccumulator = 0;

    // Trigger UI Warning
    const name = archetype.replace(/_/g, ' ');
    this.onAlert(`INFESTATION WARNING: ${name} SWARM APPROACHING!`);
  }

  private endInfestation() {
    this.state.isActive = false;
    this.state.currentArchetype = null;
    
    // Clear UI Warning
    this.onAlert(null); // Or send a "CLEARED" message if preferred
  }

  public reset() {
    this.state = {
      isActive: false,
      cycleTimer: 0,
      durationTimer: 0,
      currentArchetype: null,
      spawnAccumulator: 0
    };
    this.onAlert(null);
  }
}
