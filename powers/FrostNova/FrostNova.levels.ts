
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Frost Nova",
  type: WeaponType.FROST_NOVA,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 15, cooldown: 5000, range: 150, description: "Freezes enemies." },
    2: { damage: 22, cooldown: 4800, range: 180, description: "Larger area." },
    3: { damage: 30, cooldown: 4600, range: 220, areaScale: 1.2, description: "Stuns enemies briefly." },
    4: { damage: 45, cooldown: 4400, range: 260, areaScale: 1.4, description: "Flash Freeze: Shatter combo enabled." },
    5: { damage: 70, cooldown: 4000, range: 320, areaScale: 1.6, description: "Blizzard: Massive explosion." }
  }
};
