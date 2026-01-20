
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Aether Golem",
  type: WeaponType.AETHER_GOLEM,
  targeting: TargetingMode.FRONTAL,
  levels: {
    1: { damage: 25, cooldown: 1500, range: 100, speed: 0.16, description: "Summons a Golem that blocks projectiles and fires stun rocks." },
    2: { damage: 35, cooldown: 1400, range: 100, speed: 0.18, description: "Golem moves faster and fires more often." },
    3: { damage: 50, cooldown: 1200, range: 100, speed: 0.20, areaScale: 1.2, description: "Rock burst stuns for longer." },
    4: { damage: 70, cooldown: 1000, range: 100, speed: 0.22, description: "Golem armor reflects contact damage." },
    5: { damage: 100, cooldown: 800, range: 100, speed: 0.25, areaScale: 1.5, description: "Titan Form: Massive size and rapid stun attacks." }
  }
};
