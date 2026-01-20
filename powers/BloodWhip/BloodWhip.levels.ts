
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Blood Whip",
  type: WeaponType.BLOOD_WHIP,
  targeting: TargetingMode.FRONTAL,
  levels: {
    1: { damage: 20, cooldown: 1500, range: 150, description: "Bloody lash." },
    2: { damage: 30, cooldown: 1400, range: 180, description: "Longer reach." },
    3: { damage: 40, cooldown: 1300, range: 200, projectileCount: 2, description: "Double strike." },
    4: { damage: 60, cooldown: 1200, range: 220, description: "Bleeding." },
    5: { damage: 100, cooldown: 1000, range: 250, projectileCount: 4, description: "Whirlwind." }
  }
};
