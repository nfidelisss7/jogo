
import { WeaponType, TargetingMode } from '../../types';

export const definition = {
  name: "Umbra Familiar",
  type: WeaponType.UMBRA_FAMILIAR,
  targeting: TargetingMode.NEAREST,
  levels: {
    1: { damage: 20, cooldown: 500, range: 100, duration: 99999, projectileCount: 1, description: "Summons a Shadow Clone that mimics your movement." },
    2: { damage: 30, cooldown: 500, range: 100, duration: 99999, projectileCount: 1, description: "Shadow Step: Clone leaves damaging trails." },
    3: { damage: 40, cooldown: 500, range: 100, duration: 99999, projectileCount: 2, description: "Summons a second Clone." },
    4: { damage: 55, cooldown: 500, range: 100, duration: 99999, projectileCount: 2, description: "Clones perform Shadow Dash attacks every 3s." },
    5: { damage: 80, cooldown: 500, range: 100, duration: 99999, projectileCount: 3, description: "Trinity: 3 Clones. Enemies killed by clones explode." }
  }
};
