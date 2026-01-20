
import { EnemyArchetype } from '../../types';

export interface InfestationState {
  isActive: boolean;
  cycleTimer: number;      // Counts up to INTERVAL
  durationTimer: number;   // Counts down from DURATION when active
  currentArchetype: EnemyArchetype | null;
  spawnAccumulator: number; // For regulating spawn rate
}
