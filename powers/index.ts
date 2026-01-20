
import { WeaponType, PowerModule } from '../types';

// Registry
export const PowerRegistry: Record<WeaponType, PowerModule> = {} as any;

// Helper to register modules
const register = (mod: any) => {
  if (mod.default) {
      PowerRegistry[mod.default.definition.type] = mod.default;
  } else {
      PowerRegistry[mod.definition.type] = mod;
  }
};

// Legacy Imports (Keep valid ones)
import * as SoulSingularity from './SoulSingularity/index';
import * as BloodSpear from './BloodSpear/index';
import * as AbyssalChain from './AbyssalChain/index';
import * as DarkBolt from './DarkBolt/index';
import * as EldritchSwarm from './EldritchSwarm/index';
import * as HorrorWave from './HorrorWave/index';
import * as SpectralCurse from './SpectralCurse/index';
import * as VampiricAura from './VampiricAura/index';
import * as AbyssPull from './AbyssPull/index';

// REWORKED POWERS (Import from folders explicitly)
import * as VoidBolt from './VoidBolt/index';
import * as BloodWhip from './BloodWhip/index';
import * as NightBlade from './NightBlade/index';
import * as BloodOrb from './BloodOrb/index';
import * as GrimoireFury from './GrimoireFury/index';

// New Powers
import * as ShadowExplosion from './ShadowExplosion/index';
import * as UmbraFamiliar from './UmbraFamiliar/index';
import * as RazorMeadow from './RazorMeadow/index';
import * as PapyrusLash from './PapyrusLash/index';
import * as PetalVortex from './PetalVortex/index';
import * as InkrootBind from './InkrootBind/index';

// Requested Powers
import * as ThunderOrb from './ThunderOrb/index';
import * as FrostNova from './FrostNova/index';
import * as SplinterShot from './SplinterShot/index';

// 📌 3 NEW POWERS
import * as ChronokineticField from './ChronokineticField/index';
import * as AbyssalBotany from './AbyssalBotany/index';
import * as AetherGolem from './AetherGolem/index';

// Registration
register(VoidBolt);
register(SoulSingularity);
register(BloodSpear);
register(AbyssalChain);
register(BloodWhip);
register(DarkBolt);
register(EldritchSwarm);
register(HorrorWave);
register(NightBlade);
register(SpectralCurse);
register(VampiricAura);
register(BloodOrb);
register(AbyssPull);

register(ShadowExplosion);
register(UmbraFamiliar);
register(RazorMeadow);
register(GrimoireFury);
register(PapyrusLash);
register(PetalVortex);
register(InkrootBind);

register(ThunderOrb);
register(FrostNova);
register(SplinterShot);

// 📌 REGISTER NEW POWERS
register(ChronokineticField);
register(AbyssalBotany);
register(AetherGolem);
