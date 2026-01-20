
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Razor Meadow",
  type: WeaponType.RAZOR_MEADOW,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 15, cooldown: 6000, range: 150, duration: 5000, description: "Grows a patch of razor grass." },
    2: { damage: 22, cooldown: 5500, range: 180, duration: 6000, description: "Larger meadow." },
    3: { damage: 30, cooldown: 5000, range: 200, duration: 7000, description: "Slows enemies by 25%." },
    4: { damage: 45, cooldown: 4500, range: 220, duration: 8000, description: "Grass applies Bleed." },
    5: { damage: 65, cooldown: 4000, range: 240, duration: 9000, description: "Overgrowth: Meadow expands over time." }
  }
};
