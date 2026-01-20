
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Spectral Curse",
  type: WeaponType.SPECTRAL_CURSE,
  targeting: TargetingMode.RANDOM,
  levels: {
    1: { damage: 5, cooldown: 4000, range: 400, description: "Curses an enemy." },
    2: { damage: 8, cooldown: 3500, range: 450, description: "More damage." },
    3: { damage: 12, cooldown: 3000, range: 500, projectileCount: 3, description: "Curses 3." },
    4: { damage: 20, cooldown: 2500, range: 550, projectileCount: 5, description: "Spreads." },
    5: { damage: 40, cooldown: 1000, range: 600, projectileCount: 10, description: "Mass hysteria." }
  }
};
