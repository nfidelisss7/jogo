
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.ARCANE_LENS,
  name: "Flux Prism",
  stats: {
    description: "+15% Area/Range. Periodically amplifies Area by +100% for 3 seconds.",
    powerRangeMult: 0.15,
    powerSizeMult: 0.15
  }
};
