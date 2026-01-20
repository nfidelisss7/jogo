
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Chronokinetic Field",
  type: WeaponType.CHRONOKINETIC_FIELD,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 2, cooldown: 100, range: 120, haste: 0.10, slow: 0.30, description: "Creates a time-distortion field. Slows enemies 30%." },
    2: { damage: 3, cooldown: 100, range: 140, haste: 0.15, slow: 0.40, description: "Field expands. Enemies stutter back in time." },
    3: { damage: 5, cooldown: 100, range: 160, haste: 0.20, slow: 0.50, description: "Stronger slow (50%)." },
    4: { damage: 8, cooldown: 100, range: 190, haste: 0.25, slow: 0.60, description: "Time Fracture: Enemies in the field take constant tick damage." },
    5: { damage: 15, cooldown: 100, range: 220, haste: 0.35, slow: 0.75, description: "Chronostasis: Enemies are nearly frozen." }
  }
};
