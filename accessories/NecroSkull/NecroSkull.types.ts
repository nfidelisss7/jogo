
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.NECRO_SKULL,
  name: "Lich Crown",
  stats: {
    description: "+1 Summon Limit. +25% Minion Dmg. Minions explode for 50 dmg on death/expiry.",
    summonCount: 1,
    summonDmgMult: 0.25
  }
};
