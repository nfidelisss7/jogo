
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Inkroot Bind",
  type: WeaponType.INKROOT_BIND,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 12, cooldown: 10000, range: 200, duration: 2000, description: "Roots 1 enemy in ink." },
    2: { damage: 18, cooldown: 9500, range: 220, duration: 2500, description: "More damage tick." },
    3: { damage: 25, cooldown: 9000, range: 240, duration: 3000, projectileCount: 3, description: "Binds 3 enemies." },
    4: { damage: 35, cooldown: 8500, range: 260, duration: 3500, projectileCount: 5, description: "Strangulation: Damage increases over time." },
    5: { damage: 60, cooldown: 8000, range: 300, duration: 4000, projectileCount: 7, description: "Ink Explosion on expire." }
  }
};
