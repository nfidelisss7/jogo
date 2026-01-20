
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.VITALITY_RING,
  name: "Sanguine Band",
  stats: {
    description: "+30% Max HP. Excess healing grants a Blood Shield (up to 50% HP).",
    maxHpMult: 0.30,
    shieldCap: 0.50
  }
};
