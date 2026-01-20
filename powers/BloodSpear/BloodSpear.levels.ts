
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Blood Spear",
  type: WeaponType.CRIMSON_BOLT,
  targeting: TargetingMode.HEALTHIEST,
  levels: {
    1: { damage: 40, cooldown: 3000, range: 600, speed: 10, pierce: 2, description: "Piercing blood projectile." },
    2: { damage: 55, cooldown: 2800, range: 650, speed: 11, pierce: 3, description: "More damage." },
    3: { damage: 70, cooldown: 2600, range: 700, speed: 12, pierce: 4, projectileCount: 1, description: "Leaves trail." },
    4: { damage: 90, cooldown: 2400, range: 750, speed: 14, pierce: 6, projectileCount: 2, description: "2 spears." },
    5: { damage: 150, cooldown: 2000, range: 900, speed: 18, pierce: 99, projectileCount: 3, description: "Massive harpoons." }
  }
};
