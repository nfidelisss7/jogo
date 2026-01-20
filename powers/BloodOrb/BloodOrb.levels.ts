
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Blood Orb",
  type: WeaponType.BLOOD_ORB,
  targeting: TargetingMode.AOE,
  levels: {
    1: { damage: 20, cooldown: 100, range: 150, knockback: 5, description: "A bloody orb orbits you." },
    2: { damage: 30, cooldown: 100, range: 160, knockback: 8, description: "Hemomancy: Orb size grows with Kills." },
    3: { damage: 45, cooldown: 100, range: 170, projectileCount: 2, description: "Binary Star: 2 Orbs." },
    4: { damage: 60, cooldown: 100, range: 180, lifesteal: 1, description: "Orb damage heals you." },
    5: { damage: 100, cooldown: 90, range: 200, projectileCount: 4, description: "Red Giant: 4 Orbs forming a protective ring." }
  }
};
