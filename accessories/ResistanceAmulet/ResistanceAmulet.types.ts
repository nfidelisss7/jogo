
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.RESISTANCE_AMULET,
  name: "Ironheart",
  stats: {
    description: "Reactive Armor: Taking damage reduces further damage by 50% for 2s (10s CD). Passive +10% Armor.",
    damageReduction: 0.10
  }
};
