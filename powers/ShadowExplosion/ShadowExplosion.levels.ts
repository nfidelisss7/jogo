
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Shadow Explosion",
  type: WeaponType.SHADOW_EXPLOSION,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 33, cooldown: 7000, range: 250, description: "Explodes." },
    2: { damage: 50, cooldown: 6500, range: 280, description: "Larger." },
    3: { damage: 66, cooldown: 6000, range: 300, description: "Stuns." },
    4: { damage: 88, cooldown: 5500, range: 320, description: "Faster." },
    5: { damage: 132, cooldown: 4000, range: 350, description: "Chain explosions." }
  }
};
