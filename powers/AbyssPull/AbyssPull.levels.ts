
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Abyss Pull",
  type: WeaponType.ABYSS_PULL,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 20, cooldown: 6000, range: 300, speed: 5, description: "Fires a gravity well." },
    2: { damage: 30, cooldown: 5500, range: 350, speed: 6, description: "Stronger pull." },
    3: { damage: 45, cooldown: 5000, range: 400, speed: 7, projectileCount: 2, description: "Two wells." },
    4: { damage: 60, cooldown: 4500, range: 450, speed: 8, description: "Implodes for massive damage." },
    5: { damage: 100, cooldown: 3000, range: 500, speed: 10, projectileCount: 3, description: "Reality collapse." }
  }
};
