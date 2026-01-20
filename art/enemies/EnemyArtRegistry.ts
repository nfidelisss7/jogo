
import { EnemyArchetype, ProceduralArt } from '../../types';
import { BloodHoundArt } from './BloodHoundArt';
import { ShadowWraithArt } from './ShadowWraithArt';
import { VoidImpArt } from './VoidImpArt';
import { CrimsonGhoulArt } from './CrimsonGhoulArt';
import { BatSwarmArt } from './BatSwarmArt';
import { NecroSpiderArt } from './NecroSpiderArt';
import { HorrorStalkerArt } from './HorrorStalkerArt';
import { DemonArt } from './DemonArt';
import { SkeletonArt } from './SkeletonArt';
import { WaterSlimeArt } from './WaterSlimeArt';
import { DesertZombieArt } from './DesertZombieArt';
import { RoboFairyArt } from './RoboFairyArt';
import { ZombieArt } from './ZombieArt';
import { AngelArt } from './AngelArt';
import { KnightArt } from './KnightArt';
import { SantaClausArt } from './SantaClausArt';
import { CowboyArt } from './CowboyArt';
import { SanctifiedHeraldArt } from './SanctifiedHeraldArt';
import { BabyDragonArt } from './BabyDragonArt'; // Import

export const EnemyArtRegistry: Record<EnemyArchetype, ProceduralArt> = {
  [EnemyArchetype.BLOOD_HOUND]: BloodHoundArt,
  [EnemyArchetype.SHADOW_WRAITH]: ShadowWraithArt,
  [EnemyArchetype.VOID_IMP]: VoidImpArt,
  [EnemyArchetype.CRIMSON_GHOUL]: CrimsonGhoulArt,
  [EnemyArchetype.BAT_SWARM]: BatSwarmArt,
  [EnemyArchetype.NECRO_SPIDER]: NecroSpiderArt,
  [EnemyArchetype.HORROR_STALKER]: HorrorStalkerArt,
  [EnemyArchetype.DEMON]: DemonArt,
  [EnemyArchetype.SKELETON]: SkeletonArt,
  [EnemyArchetype.WATER_SLIME]: WaterSlimeArt,
  [EnemyArchetype.DESERT_ZOMBIE]: DesertZombieArt,
  [EnemyArchetype.ROBO_FAIRY]: RoboFairyArt,
  [EnemyArchetype.ZOMBIE]: ZombieArt,
  [EnemyArchetype.ANGEL]: AngelArt,
  [EnemyArchetype.KNIGHT]: KnightArt,
  [EnemyArchetype.SANTA_CLAUS]: SantaClausArt,
  [EnemyArchetype.COWBOY]: CowboyArt,
  [EnemyArchetype.SANCTIFIED_HERALD]: SanctifiedHeraldArt,
  [EnemyArchetype.BABY_DRAGON]: BabyDragonArt // Register
};
