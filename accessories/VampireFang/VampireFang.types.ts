
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.VAMPIRE_FANG,
  name: "Crimson Tooth",
  stats: {
    description: "+15% Crit. Crits cause Bleed. Killing bleeding enemies heals 2 HP.",
    critChance: 0.15
  }
};
