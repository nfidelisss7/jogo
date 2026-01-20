
import { AccessoryInstance, AccessoryType } from './accessoryTypes';
import { AIBrain } from './ai/core/AIBrain';

// ... (Keep existing Enums) ...

export enum WeaponType {
  MISSILE = 'MISSILE',
  AURA = 'AURA',
  VOID_TETHER = 'VOID_TETHER',
  BLOOD_WHIP = 'BLOOD_WHIP',
  SHADOW_SWARM = 'SHADOW_SWARM',
  CRIMSON_BOLT = 'CRIMSON_BOLT',
  NIGHT_BLADE = 'NIGHT_BLADE',
  VAMPIRIC_AURA = 'VAMPIRIC_AURA',
  DARK_PROJECTILE = 'DARK_PROJECTILE',
  BLOOD_ORB = 'BLOOD_ORB',
  ABYSS_PULL = 'ABYSS_PULL',
  HORROR_WAVE = 'HORROR_WAVE',
  SPECTRAL_CURSE = 'SPECTRAL_CURSE',
  SHADOW_EXPLOSION = 'SHADOW_EXPLOSION',
  UMBRA_FAMILIAR = 'UMBRA_FAMILIAR',
  RAZOR_MEADOW = 'RAZOR_MEADOW',
  GRIMOIRE_FURY = 'GRIMOIRE_FURY',
  PAPYRUS_LASH = 'PAPYRUS_LASH',
  PETAL_VORTEX = 'PETAL_VORTEX',
  INKROOT_BIND = 'INKROOT_BIND',
  THUNDER_ORB = 'THUNDER_ORB',
  FROST_NOVA = 'FROST_NOVA',
  SPLINTER_SHOT = 'SPLINTER_SHOT',
  SURVIVOR_BOON = 'SURVIVOR_BOON',
  CHRONOKINETIC_FIELD = 'CHRONOKINETIC_FIELD',
  ABYSSAL_BOTANY = 'ABYSSAL_BOTANY',
  AETHER_GOLEM = 'AETHER_GOLEM'
}

export enum TargetingMode {
  NEAREST = 'NEAREST',
  RANDOM = 'RANDOM',
  HEALTHIEST = 'HEALTHIEST',
  AOE = 'AOE',
  FRONTAL = 'FRONTAL',
  MOUSE = 'MOUSE'
}

export enum MinionType {
  VOID_BLOOM = 'VOID_BLOOM',
  AETHER_GOLEM = 'AETHER_GOLEM',
  UMBRA_CLONE = 'UMBRA_CLONE',
  BAT_FAMILIAR = 'BAT_FAMILIAR',
  GRIMOIRE_BOOK = 'GRIMOIRE_BOOK'
}

export enum EnemyArchetype {
  BLOOD_HOUND = 'BLOOD_HOUND',
  SHADOW_WRAITH = 'SHADOW_WRAITH',
  VOID_IMP = 'VOID_IMP',
  CRIMSON_GHOUL = 'CRIMSON_GHOUL',
  BAT_SWARM = 'BAT_SWARM',
  NECRO_SPIDER = 'NECRO_SPIDER',
  HORROR_STALKER = 'HORROR_STALKER',
  DEMON = 'DEMON',
  SKELETON = 'SKELETON',
  WATER_SLIME = 'WATER_SLIME',
  DESERT_ZOMBIE = 'DESERT_ZOMBIE',
  ROBO_FAIRY = 'ROBO_FAIRY',
  ZOMBIE = 'ZOMBIE',
  ANGEL = 'ANGEL',
  KNIGHT = 'KNIGHT',
  SANTA_CLAUS = 'SANTA_CLAUS',
  COWBOY = 'COWBOY',
  SANCTIFIED_HERALD = 'SANCTIFIED_HERALD',
  BABY_DRAGON = 'BABY_DRAGON'
}

export enum BossType {
  COUNT_DRACULOR = 'COUNT_DRACULOR',
  ABYSS_SOVEREIGN = 'ABYSS_SOVEREIGN',
  ETERNAL_REVENANT = 'ETERNAL_REVENANT',
  FLESH_HARVESTER = 'FLESH_HARVESTER',
  FALLEN_ANGEL = 'FALLEN_ANGEL',
  PAPAMAMA_DRAGON = 'PAPAMAMA_DRAGON'
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  size: number;
  active: boolean;
  type: 'player' | 'enemy' | 'projectile' | 'gem' | 'boss' | 'chest' | 'accessory_drop' | 'minion';
  artKey?: EnemyArchetype | BossType | MinionType; 
  hp?: number;
  maxHp?: number;
  isKing?: boolean;
  archetype?: EnemyArchetype;
  
  // AI Components
  aiBrain?: AIBrain; // 🧠 The new brain
  
  state?: 'idle' | 'pursue' | 'charge' | 'retreat' | 'invisible' | 'teleport' | 'channeling' | 'immune' | 'stunned' | 'follow' | 'attack' | 'shielding';
  stateTimer?: number;
  velocity?: { x: number, y: number };
  speed?: number;
  curseStacks?: number;
  isStunned?: boolean;
  stunTimer?: number;
  isBleeding?: boolean;
  bleedTimer?: number;
  bleedDamage?: number;
  lastHitTime?: number; 
  invulnTimer?: number; 
  isEnemyProjectile?: boolean; 
  slowTimer?: number;
  killCount?: number;
  
  aiValues?: {
    seed: number;
    chargePrep?: boolean;
    kiteDir?: number;
    attackCooldown?: number;
    targetX?: number; // For AI pathing
    targetY?: number;
    customState?: number; // Added for AI state machines
    timer?: number;       // Added for AI timers
  };

  bossType?: BossType;
  phase?: number; 
  cooldowns?: Record<string, number>;
  targetX?: number; 
  targetY?: number;

  kingTimer?: number;
  shieldHp?: number;
  maxShieldHp?: number;
  reviveChance?: number;
  accessoryType?: AccessoryType;

  minionType?: MinionType;
  ownerId?: string;
  attackCooldown?: number;
  stats?: PowerLevelStats;
  targetOffset?: { x: number, y: number };
  powerLevel?: number;
  history?: {x: number, y: number}[];
  orbitAngle?: number;
  orbitRadius?: number;
  
  acceleration?: number;
  ricochets?: number;
  isMain?: boolean;
  life?: number;
  maxLife?: number;
  vx?: number;
  vy?: number;
  behavior?: (entity: Entity, delta: number, time: number) => void;
  customData?: any; 
  isMinionShot?: boolean;
  isExplosion?: boolean;
  attachToPlayer?: boolean;
  onHit?: (target: Entity, projectile: Entity) => void;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  velocity: { x: number, y: number };
  active: boolean;
}

export interface PowerLevelStats {
  damage: number;
  cooldown: number;
  range: number;
  duration?: number;
  projectileCount?: number;
  pierce?: number;
  speed?: number;
  areaScale?: number;
  knockback?: number;
  description: string;
  dot?: number;
  slow?: number;
  weaken?: number;
  spreadOnDeath?: boolean;
  hysteria?: boolean;
  intimidate?: boolean;
  shield?: number;
  bleed?: number;
  shadowClone?: boolean;
  lifesteal?: number;
  execute?: number;
  bleedAura?: number;
  overHealShield?: boolean;
  haste?: number; 
  magnet?: number; 
  summonChance?: number; 
  maxCount?: number; 
  ricochet?: number;
}

export interface PowerDefinition {
  name: string;
  type: WeaponType;
  targeting: TargetingMode;
  levels: Record<number, PowerLevelStats>;
}

export interface WeaponData {
  type: WeaponType;
  level: number;
  stats: PowerLevelStats;
  lastFired: number;
  tags?: string[];
  projectiles?: any[]; 
  orbitAngle?: number;
}

export interface GameState {
  level: number;
  xp: number;
  requiredXp: number;
  hp: number;
  maxHp: number;
  isPaused: boolean;
  isGameOver: boolean;
  activePowers: WeaponData[];
  killCount: number;
  timer: number;
  isBlinded?: boolean;
  blindnessTimer?: number;
  activeBoss?: BossType; 
  activeBossData?: {
    name: string;
    hp: number;
    maxHp: number;
    type: BossType;
  };
  defeatedBosses: BossType[];
  equippedAccessories: AccessoryInstance[];
  inventory: AccessoryInstance[];
  powerRerolls: number;
  accessoryRerolls: number;
  infestationMessage?: string | null;
}

export interface ProceduralArt {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number, angle?: number, state?: any): void;
}

export interface PowerArt {
  drawProjectile(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    time: number, 
    level: number, 
    angle: number,
    life?: number,
    maxLife?: number,
    entity?: Entity,
    camX?: number,
    camY?: number
  ): void;
  drawIcon?(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}

export type PowerLogicHandler = (
  power: WeaponData, 
  player: Entity, 
  targets: Entity[], 
  time: number, 
  spawnProjectile: (data: any) => void
) => void;

export interface BossLogicHandler {
  update(
    boss: Entity, 
    player: Entity, 
    time: number, 
    delta: number, 
    spawnProjectile: (data: any) => void,
    spawnEnemy: (archetype: EnemyArchetype, x: number, y: number) => void,
    nearbyEnemies: Entity[]
  ): void;
}

export interface BossModule {
  type: BossType;
  art: ProceduralArt;
  logic: BossLogicHandler;
  init: (x: number, y: number) => Entity;
}

export interface PowerModule {
  definition: PowerDefinition;
  logic: PowerLogicHandler;
  art: PowerArt;
}
