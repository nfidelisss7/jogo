
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Horror Wave",
  type: WeaponType.HORROR_WAVE,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 30, cooldown: 10000, range: 200, description: "Shockwave." },
    2: { damage: 50, cooldown: 9000, range: 250, description: "Larger." },
    3: { damage: 80, cooldown: 8000, range: 300, description: "Pushes back." },
    4: { damage: 120, cooldown: 7000, range: 350, description: "Two waves." },
    5: { damage: 200, cooldown: 6000, range: 450, description: "Screen clear." }
  }
};
