
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Thunder Orb",
  type: WeaponType.THUNDER_ORB,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 30, cooldown: 2000, range: 600, speed: 9, pierce: 999, description: "A piercing orb of lightning." },
    2: { damage: 45, cooldown: 1800, range: 650, speed: 10, pierce: 999, description: "Faster orb." },
    3: { damage: 60, cooldown: 1600, range: 700, speed: 12, pierce: 999, projectileCount: 1, description: "Tesla Arc: Zaps nearby enemies." },
    4: { damage: 80, cooldown: 1400, range: 750, speed: 14, pierce: 999, projectileCount: 2, description: "Fires 2 orbs." },
    5: { damage: 120, cooldown: 1000, range: 900, speed: 18, pierce: 999, projectileCount: 3, description: "Storm Fury: Rapid fire." }
  }
};
