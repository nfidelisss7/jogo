
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Splinter Shot",
  type: WeaponType.SPLINTER_SHOT,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 40, cooldown: 1500, range: 500, speed: 8, projectileCount: 1, description: "Splits into 3 shards on impact." },
    2: { damage: 55, cooldown: 1400, range: 550, speed: 9, projectileCount: 1, description: "Splits into 4 shards." },
    3: { damage: 70, cooldown: 1300, range: 600, speed: 10, projectileCount: 1, description: "5 Shards, higher damage." },
    4: { damage: 90, cooldown: 1200, range: 650, speed: 12, projectileCount: 1, description: "6 Shards, faster main shot." },
    5: { damage: 130, cooldown: 1000, range: 700, speed: 14, projectileCount: 1, description: "Shrapnel Cone: 8 Prismatic shards." }
  }
};
