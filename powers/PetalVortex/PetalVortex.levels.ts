
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Petal Vortex",
  type: WeaponType.PETAL_VORTEX,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 20, cooldown: 8000, range: 100, duration: 4000, description: "A swirling vortex of petals." },
    2: { damage: 30, cooldown: 7500, range: 130, duration: 5000, description: "Vortex size increases." },
    3: { damage: 45, cooldown: 7000, range: 160, duration: 6000, description: "Tornado Physics: Pulls enemies in." },
    4: { damage: 60, cooldown: 6500, range: 190, duration: 7000, description: "Thorns added to vortex." },
    5: { damage: 90, cooldown: 6000, range: 220, duration: 8000, description: "Permanent storm." }
  }
};
