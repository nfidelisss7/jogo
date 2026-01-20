
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Grimoire Fury",
  type: WeaponType.GRIMOIRE_FURY,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 18, cooldown: 1200, range: 400, projectileCount: 2, description: "Summons 2 Grimoires that fire beams." },
    2: { damage: 25, cooldown: 1000, range: 400, projectileCount: 3, description: "3 Grimoires." },
    3: { damage: 35, cooldown: 1000, range: 450, projectileCount: 3, description: "Hits mark enemies." },
    4: { damage: 45, cooldown: 1000, range: 500, projectileCount: 3, pierce: 1, description: "Beams pierce." },
    5: { damage: 65, cooldown: 800, range: 550, projectileCount: 5, description: "Auto-Turret: Books channel continuous beams." }
  }
};
