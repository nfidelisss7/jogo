
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Abyssal Chain",
  type: WeaponType.VOID_TETHER,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 20, cooldown: 1200, range: 350, speed: 18, duration: 500, description: "Tethers an enemy, slowing them significantly." },
    2: { damage: 30, cooldown: 1100, range: 400, speed: 18, duration: 600, description: "Stronger damage and range." },
    3: { damage: 45, cooldown: 1000, range: 450, speed: 20, projectileCount: 3, description: "Tethers 3 enemies at once." },
    4: { damage: 70, cooldown: 800, range: 550, speed: 22, projectileCount: 5, description: "Chains persist longer and hit harder." },
    5: { damage: 120, cooldown: 600, range: 700, speed: 25, projectileCount: 8, description: "Void Web: Chains arc between enemies." }
  }
};
