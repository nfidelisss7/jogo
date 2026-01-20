import { WeaponType, WeaponData, GameState } from './types';

export const INITIAL_REQUIRED_XP = 45;

export const calculateRequiredXp = (level: number): number => {
  return Math.floor(Math.pow(level, 1.3) * 45) + (level * 10);
};

// Helper to create basic stats for legacy definitions
const createStats = (damage: number, cooldown: number, range: number) => ({
  damage, cooldown, range, description: 'Basic Weapon'
});

export const WEAPON_DEFINITIONS: Record<WeaponType, Omit<WeaponData, 'level' | 'lastFired'>> = {
  [WeaponType.MISSILE]: { type: WeaponType.MISSILE, stats: createStats(15, 1200, 400) },
  [WeaponType.AURA]: { type: WeaponType.AURA, stats: createStats(5, 500, 120) },
  [WeaponType.VOID_TETHER]: { type: WeaponType.VOID_TETHER, stats: createStats(10, 8000, 200) },
  [WeaponType.BLOOD_WHIP]: { type: WeaponType.BLOOD_WHIP, stats: createStats(15, 2000, 100) },
  [WeaponType.SHADOW_SWARM]: { type: WeaponType.SHADOW_SWARM, stats: createStats(8, 12000, 150) },
  [WeaponType.CRIMSON_BOLT]: { type: WeaponType.CRIMSON_BOLT, stats: createStats(20, 4000, 600) },
  [WeaponType.NIGHT_BLADE]: { type: WeaponType.NIGHT_BLADE, stats: createStats(12, 1500, 80) },
  [WeaponType.VAMPIRIC_AURA]: { type: WeaponType.VAMPIRIC_AURA, stats: createStats(5, 10000, 150) },
  [WeaponType.DARK_PROJECTILE]: { type: WeaponType.DARK_PROJECTILE, stats: createStats(18, 5000, 500) },
  [WeaponType.BLOOD_ORB]: { type: WeaponType.BLOOD_ORB, stats: createStats(10, 3000, 200) },
  [WeaponType.ABYSS_PULL]: { type: WeaponType.ABYSS_PULL, stats: createStats(15, 7000, 250) },
  [WeaponType.HORROR_WAVE]: { type: WeaponType.HORROR_WAVE, stats: createStats(25, 15000, 300) },
  [WeaponType.SPECTRAL_CURSE]: { type: WeaponType.SPECTRAL_CURSE, stats: createStats(8, 6000, 400) },
  // New Powers Default
  [WeaponType.SHADOW_EXPLOSION]: { type: WeaponType.SHADOW_EXPLOSION, stats: createStats(30, 7000, 250) },
  [WeaponType.UMBRA_FAMILIAR]: { type: WeaponType.UMBRA_FAMILIAR, stats: createStats(15, 12000, 300) },
  [WeaponType.RAZOR_MEADOW]: { type: WeaponType.RAZOR_MEADOW, stats: createStats(12, 9000, 150) },
  [WeaponType.GRIMOIRE_FURY]: { type: WeaponType.GRIMOIRE_FURY, stats: createStats(15, 11000, 200) },
  [WeaponType.PAPYRUS_LASH]: { type: WeaponType.PAPYRUS_LASH, stats: createStats(20, 6000, 120) },
  [WeaponType.PETAL_VORTEX]: { type: WeaponType.PETAL_VORTEX, stats: createStats(18, 8000, 100) },
  [WeaponType.INKROOT_BIND]: { type: WeaponType.INKROOT_BIND, stats: createStats(10, 10000, 200) },
  // Additional Powers
  [WeaponType.THUNDER_ORB]: { type: WeaponType.THUNDER_ORB, stats: createStats(25, 2000, 600) },
  [WeaponType.FROST_NOVA]: { type: WeaponType.FROST_NOVA, stats: createStats(10, 5000, 150) },
  [WeaponType.SPLINTER_SHOT]: { type: WeaponType.SPLINTER_SHOT, stats: createStats(30, 1500, 500) },
  // Special
  [WeaponType.SURVIVOR_BOON]: { type: WeaponType.SURVIVOR_BOON, stats: createStats(0, 0, 0) },
  // 📌 NEW ABILITIES
  [WeaponType.CHRONOKINETIC_FIELD]: { type: WeaponType.CHRONOKINETIC_FIELD, stats: createStats(0, 100, 120) },
  [WeaponType.ABYSSAL_BOTANY]: { type: WeaponType.ABYSSAL_BOTANY, stats: createStats(39, 1500, 300) },
  [WeaponType.AETHER_GOLEM]: { type: WeaponType.AETHER_GOLEM, stats: createStats(10, 999999, 100) },
};

export const getRandomUpgrades = (currentPowers: WeaponData[]): WeaponType[] => {
  const allTypes = Object.values(WeaponType);
  const maxSlots = 6;
  
  let availableTypes: WeaponType[];
  if (currentPowers.length >= maxSlots) {
    availableTypes = currentPowers.map(p => p.type);
  } else {
    // Offer all weapons if starting or slots available
    availableTypes = allTypes;
  }

  const shuffled = [...availableTypes].sort(() => 0.5 - Math.random());
  // Ensure we always return 3 if possible
  return shuffled.slice(0, 3);
};

export const upgradePower = (currentPowers: WeaponData[], type: WeaponType): WeaponData[] => {
  const index = currentPowers.findIndex(p => p.type === type);
  if (index !== -1) {
    const updated = [...currentPowers];
    const prev = updated[index];
    updated[index] = {
      ...prev,
      level: prev.level + 1,
      stats: {
        ...prev.stats,
        damage: prev.stats.damage * 1.25,
        cooldown: prev.stats.cooldown * 0.9,
        range: prev.stats.range * 1.1
      }
    };
    return updated;
  } else {
    return [...currentPowers, { ...WEAPON_DEFINITIONS[type], level: 1, lastFired: 0 }];
  }
};