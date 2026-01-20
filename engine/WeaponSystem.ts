
import { WeaponType, WeaponData, TargetingMode, Entity } from '../types';
import { PowerRegistry } from '../powers/index';

export const MAX_POWERS = 6;

export interface TargetingStrategy {
  acquire(player: { x: number, y: number }, candidates: Entity[]): Entity[];
}

export const TargetingStrategies: Record<TargetingMode, TargetingStrategy> = {
  [TargetingMode.NEAREST]: {
    acquire: (player, candidates) => {
      // Sort by distance and return sorted list
      return [...candidates].sort((a, b) => {
        const d2a = Math.pow(a.x - player.x, 2) + Math.pow(a.y - player.y, 2);
        const d2b = Math.pow(b.x - player.x, 2) + Math.pow(b.y - player.y, 2);
        return d2a - d2b;
      });
    }
  },
  [TargetingMode.RANDOM]: {
    acquire: (_, candidates) => [...candidates].sort(() => 0.5 - Math.random())
  },
  [TargetingMode.HEALTHIEST]: {
    acquire: (_, candidates) => {
      return [...candidates].sort((a, b) => (b.hp || 0) - (a.hp || 0));
    }
  },
  [TargetingMode.AOE]: {
    acquire: (_, candidates) => candidates
  },
  [TargetingMode.FRONTAL]: {
    acquire: (_, candidates) => candidates // Logic handles direction
  },
  [TargetingMode.MOUSE]: {
    acquire: (_, candidates) => candidates
  }
};

export class WeaponSystem {
  static getUpgradeChoices(currentPowers: WeaponData[]): WeaponType[] {
    const MAX_LEVEL = 5;
    const allTypes = Object.keys(PowerRegistry) as WeaponType[];
    
    // 1. Identify active powers that can be upgraded (Level < 5)
    const existingUpgradable = currentPowers
        .filter(p => p.level < MAX_LEVEL)
        .map(p => p.type);

    // 2. Identify new powers (only if we have space)
    let newCandidates: WeaponType[] = [];
    if (currentPowers.length < MAX_POWERS) {
        const ownedSet = new Set(currentPowers.map(p => p.type));
        newCandidates = allTypes.filter(t => !ownedSet.has(t));
    }

    // 3. Combine pools (Existing Upgradable + New Candidates)
    const pool = [...existingUpgradable, ...newCandidates];

    // 4. Fallback if empty (All slots full and all maxed)
    if (pool.length === 0) {
        return [WeaponType.SURVIVOR_BOON];
    }

    // 5. Shuffle and Pick 3 unique options
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  static upgrade(currentPowers: WeaponData[], type: WeaponType): WeaponData[] {
    // Note: SURVIVOR_BOON is handled in GameEngine, so this function deals with standard weapons.
    const existingIndex = currentPowers.findIndex(p => p.type === type);
    const mod = PowerRegistry[type];
    
    if (!mod) {
        // Safe fail if somehow passed invalid type
        console.error("Unknown power type in upgrade:", type);
        return currentPowers;
    }

    if (existingIndex !== -1) {
        const p = currentPowers[existingIndex];
        const newLevel = Math.min(p.level + 1, 5);
        const newStats = mod.definition.levels[newLevel];
        
        const updatedPowers = [...currentPowers];
        updatedPowers[existingIndex] = {
            ...p,
            level: newLevel,
            stats: newStats
        };
        return updatedPowers;
    } else {
        // New Power
        const stats = mod.definition.levels[1];
        return [...currentPowers, {
            type: mod.definition.type,
            level: 1,
            stats: stats,
            lastFired: 0,
            tags: [],
            orbitAngle: 0
        }];
    }
  }
}
