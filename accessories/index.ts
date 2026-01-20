
import { AccessoryType, AccessoryModule } from '../types/accessoryTypes';
import * as ResistanceAmulet from './ResistanceAmulet';
import * as SpeedCharm from './SpeedCharm';
import * as VitalityRing from './VitalityRing';
import * as ArcaneLens from './ArcaneLens';
import * as ThornsEmblem from './ThornsEmblem';
// New
import * as MirrorRelic from './MirrorRelic';
import * as VampireFang from './VampireFang';
import * as VoidAmulet from './VoidAmulet';
import * as NecroSkull from './NecroSkull';
import * as HorrorMask from './HorrorMask';

export const AccessoryRegistry: Record<AccessoryType, AccessoryModule> = {
  [AccessoryType.RESISTANCE_AMULET]: ResistanceAmulet,
  [AccessoryType.SPEED_CHARM]: SpeedCharm,
  [AccessoryType.VITALITY_RING]: VitalityRing,
  [AccessoryType.ARCANE_LENS]: ArcaneLens,
  [AccessoryType.THORNS_EMBLEM]: ThornsEmblem,
  [AccessoryType.MIRROR_RELIC]: MirrorRelic,
  [AccessoryType.VAMPIRE_FANG]: VampireFang,
  [AccessoryType.VOID_AMULET]: VoidAmulet,
  [AccessoryType.NECRO_SKULL]: NecroSkull,
  [AccessoryType.HORROR_MASK]: HorrorMask
};
