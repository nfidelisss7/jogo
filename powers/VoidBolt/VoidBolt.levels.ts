
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Void Bolt",
  type: WeaponType.MISSILE,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 25, cooldown: 900, range: 450, speed: 7, description: "Bolt." },
    2: { damage: 35, cooldown: 800, range: 500, speed: 8, description: "Faster." },
    3: { damage: 45, cooldown: 700, range: 550, speed: 9, projectileCount: 2, description: "2 bolts." },
    4: { damage: 60, cooldown: 600, range: 600, speed: 10, projectileCount: 2, pierce: 1, description: "Pierces." },
    5: { damage: 80, cooldown: 400, range: 650, speed: 12, projectileCount: 3, pierce: 2, description: "Machine gun." }
  }
};
