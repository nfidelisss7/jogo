
import { MinionType, ProceduralArt } from '../../types';
import { AetherGolemArt } from './AetherGolemArt';
import { VoidBloomArt } from './VoidBloomArt';
import { UmbraCloneArt } from './UmbraCloneArt';
import { BatFamiliarArt } from './BatFamiliarArt';
import { GrimoireBookArt } from './GrimoireBookArt';

export const MinionArtRegistry: Record<MinionType, ProceduralArt> = {
  [MinionType.AETHER_GOLEM]: AetherGolemArt,
  [MinionType.VOID_BLOOM]: VoidBloomArt,
  [MinionType.UMBRA_CLONE]: UmbraCloneArt,
  [MinionType.BAT_FAMILIAR]: BatFamiliarArt,
  [MinionType.GRIMOIRE_BOOK]: GrimoireBookArt
};
