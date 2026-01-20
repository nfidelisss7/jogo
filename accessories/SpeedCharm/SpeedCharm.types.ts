
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.SPEED_CHARM,
  name: "Static Anklet",
  stats: {
    description: "Moving builds static charge. At max charge, discharge lightning at nearby enemies.",
    moveSpeedMult: 0.15,
    staticDischargeDamage: 50
  }
};
