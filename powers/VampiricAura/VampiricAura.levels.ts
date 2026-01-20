
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Vampiric Aura",
  type: WeaponType.VAMPIRIC_AURA,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 2, cooldown: 1000, range: 120, description: "Drains life." },
    2: { damage: 3, cooldown: 900, range: 140, description: "Faster drain." },
    3: { damage: 5, cooldown: 800, range: 160, description: "Heals player." },
    4: { damage: 8, cooldown: 700, range: 180, description: "Wider area." },
    5: { damage: 15, cooldown: 500, range: 220, description: "Blood storm." }
  }
};
