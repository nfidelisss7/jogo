
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.VOID_AMULET,
  name: "Null Stone",
  stats: {
    description: "Gain +5% Cooldown Reduction for every 10 enemies nearby (Max 30%).",
    cooldownReduction: 0 // Dynamic
  }
};
