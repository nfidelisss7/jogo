
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Dark Bolt",
  type: WeaponType.DARK_PROJECTILE,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 30, cooldown: 2000, range: 500, speed: 4, knockback: 10, description: "Heavy dark matter." },
    2: { damage: 45, cooldown: 1900, range: 550, speed: 4, knockback: 15, description: "More knockback." },
    3: { damage: 60, cooldown: 1800, range: 600, speed: 5, areaScale: 1.2, description: "Explodes." },
    4: { damage: 90, cooldown: 1600, range: 650, speed: 5, projectileCount: 2, description: "2 bolts." },
    5: { damage: 150, cooldown: 1400, range: 700, speed: 6, knockback: 30, description: "Cataclysmic." }
  }
};
