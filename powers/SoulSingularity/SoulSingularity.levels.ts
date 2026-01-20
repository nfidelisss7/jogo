
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Soul Singularity",
  type: WeaponType.AURA,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 4, cooldown: 500, range: 80, description: "Aura." },
    2: { damage: 6, cooldown: 450, range: 100, description: "Bigger." },
    3: { damage: 9, cooldown: 400, range: 120, description: "Slows." },
    4: { damage: 14, cooldown: 350, range: 150, description: "Bigger." },
    5: { damage: 25, cooldown: 200, range: 200, description: "Massive." }
  }
};
