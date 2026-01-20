
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.MIRROR_RELIC,
  name: "Echo Shard",
  stats: {
    description: "Every 5 seconds, your attacks gain +2 Projectiles for 2 seconds.",
    amount: 0 // Base 0
  }
};
