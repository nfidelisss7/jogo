
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Night Blade",
  type: WeaponType.NIGHT_BLADE,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 20, cooldown: 100, range: 80, speed: 2, description: "Summons a blade that orbits you." },
    2: { damage: 30, cooldown: 100, range: 90, speed: 2.5, bleed: 5, description: "Blade hits apply Bleed." },
    3: { damage: 45, cooldown: 100, range: 100, speed: 3, projectileCount: 2, description: "Summons a second blade." },
    4: { damage: 65, cooldown: 90, range: 110, speed: 3.5, projectileCount: 3, description: "Momentum: Damage scales with your movement speed." },
    5: { damage: 100, cooldown: 80, range: 130, speed: 5, projectileCount: 5, description: "Death Lotus: 5 Blades spinning at high velocity." }
  }
};
