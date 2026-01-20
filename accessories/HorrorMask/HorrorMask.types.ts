
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.HORROR_MASK,
  name: "Dread Visage",
  stats: {
    description: "Enemies within 200px are slowed by 20%. Kills have 15% chance to Fear nearby enemies.",
    slowAura: 0.20,
    fearChance: 0.15
  }
};
