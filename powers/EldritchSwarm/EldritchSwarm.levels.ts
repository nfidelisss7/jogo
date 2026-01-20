
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Eldritch Swarm",
  type: WeaponType.SHADOW_SWARM,
  targeting: TargetingMode.RANDOM, 
  levels: {
    1: { damage: 8, cooldown: 8000, range: 200, duration: 4000, description: "Swarm of void bats." },
    2: { damage: 12, cooldown: 7500, range: 250, duration: 5000, description: "Larger swarm." },
    3: { damage: 18, cooldown: 7000, range: 300, duration: 6000, projectileCount: 5, description: "More entities." },
    4: { damage: 25, cooldown: 6500, range: 350, duration: 7000, projectileCount: 8, description: "Aggressive." },
    5: { damage: 40, cooldown: 5000, range: 400, duration: 8000, projectileCount: 12, description: "Cloud of death." }
  }
};
