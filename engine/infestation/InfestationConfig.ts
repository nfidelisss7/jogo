
import { EnemyArchetype } from '../../types';

export const InfestationConfig = {
  // Timing (in milliseconds)
  INTERVAL: 40_000, // Time between infestation attempts
  DURATION: 20_000, // How long the horde lasts
  
  // Spawning
  SPAWN_RATE_MULTIPLIER: 0.5, // 0.5 means 2x spawn rate (interval * 0.5)
  
  // The Pool: Explicitly excludes Bosses, Kings, and Special Events
  VALID_ARCHETYPES: [
    EnemyArchetype.ZOMBIE,
    EnemyArchetype.SKELETON,
    EnemyArchetype.BAT_SWARM,
    EnemyArchetype.VOID_IMP,
    EnemyArchetype.WATER_SLIME,
    EnemyArchetype.BLOOD_HOUND,
    EnemyArchetype.SHADOW_WRAITH,
    EnemyArchetype.DESERT_ZOMBIE,
    EnemyArchetype.COWBOY,
    EnemyArchetype.NECRO_SPIDER,
    EnemyArchetype.HORROR_STALKER,
    EnemyArchetype.ROBO_FAIRY,
    EnemyArchetype.ANGEL,
    EnemyArchetype.KNIGHT,
    EnemyArchetype.SANTA_CLAUS,
    EnemyArchetype.CRIMSON_GHOUL,
    EnemyArchetype.DEMON,
    EnemyArchetype.SANCTIFIED_HERALD
  ]
};
