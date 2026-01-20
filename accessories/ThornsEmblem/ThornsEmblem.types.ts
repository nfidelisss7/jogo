
import { AccessoryType, AccessoryDefinition } from '../../types/accessoryTypes';

export const definition: AccessoryDefinition = {
  id: AccessoryType.THORNS_EMBLEM,
  name: "Reactive Spikes",
  stats: {
    description: "When hit, release a burst of spikes dealing 50 damage. (2s Cooldown).",
    thornsReflect: 0, // Disabled old logic
  }
};
