
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Papyrus Lash",
  type: WeaponType.PAPYRUS_LASH,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 20, cooldown: 1500, range: 400, description: "Unfurls a scroll." },
    2: { damage: 30, cooldown: 1400, range: 450, description: "Longer." },
    3: { damage: 45, cooldown: 1300, range: 500, description: "Wider." },
    4: { damage: 65, cooldown: 1200, range: 550, description: "Runes explode." },
    5: { damage: 100, cooldown: 1000, range: 600, description: "Storm of paper." }
  }
};
