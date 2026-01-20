
import { WeaponType, WeaponData } from '../types';
import { PowerRegistry } from '../powers/index';

export const INITIAL_REQUIRED_XP = 45;

export const calculateRequiredXp = (level: number): number => {
  return Math.floor(Math.pow(level, 1.3) * 45) + (level * 10);
};

// Returns random 3 upgrade choices
export const getRandomUpgrades = (currentPowers: WeaponData[]): WeaponType[] => {
  const allTypes = Object.keys(PowerRegistry) as WeaponType[];
  const maxSlots = 6;
  
  let availableTypes: WeaponType[];
  if (currentPowers.length >= maxSlots) {
    // Only upgrades for existing powers
    availableTypes = currentPowers.map(p => p.type);
  } else {
    // Offer all weapons if starting or slots available
    // But don't offer what we already have (unless it's max level? No, upgrade logic handles max level check)
    // Actually getUpgradeChoices in WeaponSystem handles "new" vs "upgrade".
    // This function is likely unused if GameEngine uses WeaponSystem directly.
    availableTypes = allTypes;
  }

  const shuffled = [...availableTypes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Deprecated: Legacy support only. GameEngine should use WeaponSystem.upgrade
export const upgradePower = (currentPowers: WeaponData[], type: WeaponType): WeaponData[] => {
  const index = currentPowers.findIndex(p => p.type === type);
  const mod = PowerRegistry[type];

  if (!mod) {
      console.warn(`Power ${type} not found in registry.`);
      return currentPowers;
  }

  if (index !== -1) {
    const updated = [...currentPowers];
    const prev = updated[index];
    const newLevel = Math.min(prev.level + 1, 5);
    
    updated[index] = {
      ...prev,
      level: newLevel,
      stats: mod.definition.levels[newLevel]
    };
    return updated;
  } else {
    // New Power
    return [...currentPowers, { 
        type: type, 
        level: 1, 
        stats: mod.definition.levels[1],
        lastFired: 0,
        tags: [],
        orbitAngle: 0
    }];
  }
};

// Exports for compatibility if needed
export const WEAPON_DEFINITIONS = {}; 
