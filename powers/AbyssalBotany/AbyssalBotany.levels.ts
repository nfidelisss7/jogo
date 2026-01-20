
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Abyssal Botany",
  type: WeaponType.ABYSSAL_BOTANY,
  targeting: TargetingMode.NEAREST, 
  levels: {
    1: { damage: 35, cooldown: 1500, range: 300, summonChance: 0.15, description: "15% chance on kill to spawn a Void Bloom." },
    2: { damage: 45, cooldown: 1300, range: 320, summonChance: 0.20, description: "Higher spawn chance. Blooms fire faster." },
    3: { damage: 55, cooldown: 1100, range: 350, summonChance: 0.25, projectileCount: 1, description: "Blooms shoot piercing spores." },
    4: { damage: 65, cooldown: 1000, range: 380, summonChance: 0.30, pierce: 1, description: "Spore Colonization: Spores infect enemies." },
    5: { damage: 85, cooldown: 800, range: 420, summonChance: 0.40, projectileCount: 1, description: "Overgrowth: Blooms are larger and last longer." }
  }
};
