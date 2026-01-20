
import { Entity } from '../types';

export enum AccessoryType {
  RESISTANCE_AMULET = 'RESISTANCE_AMULET',
  SPEED_CHARM = 'SPEED_CHARM',
  VITALITY_RING = 'VITALITY_RING',
  ARCANE_LENS = 'ARCANE_LENS',
  THORNS_EMBLEM = 'THORNS_EMBLEM',
  // New Accessories
  MIRROR_RELIC = 'MIRROR_RELIC',
  VAMPIRE_FANG = 'VAMPIRE_FANG',
  VOID_AMULET = 'VOID_AMULET',
  NECRO_SKULL = 'NECRO_SKULL',
  HORROR_MASK = 'HORROR_MASK'
}

export interface AccessoryStats {
  description: string;
  // Passive Multipliers
  moveSpeedMult?: number;
  maxHpMult?: number;
  damageReduction?: number;
  powerSizeMult?: number;
  powerRangeMult?: number;
  projectileSpeedMult?: number;
  pickupRangeMult?: number;
  // Active/Reactive Logic
  hpRegenPer5?: number;
  thornsReflect?: number;
  thornsMin?: number;
  // New Mechanics
  amount?: number; // +1 Projectile/Summon
  damageMult?: number; // Global Damage
  critChance?: number; // 0-1
  critDamage?: number; // Multiplier
  cooldownReduction?: number; // 0.15 = 15% faster
  durationMult?: number; // 0.10 = 10% longer
  summonCount?: number; // +N summons
  summonHpMult?: number; 
  summonDmgMult?: number;
  fearChance?: number; // On Kill fear
  slowAura?: number; // % slow in radius
  
  // Dynamic Hooks (Stats that rely on runtime state)
  shieldCap?: number; // Max shield from overheal
  staticDischargeDamage?: number; 
  mirrorProcInterval?: number;
}

export interface AccessoryDefinition {
  id: AccessoryType;
  name: string;
  stats: AccessoryStats;
}

export interface AccessoryInstance {
  id: string; // Unique GUID
  type: AccessoryType;
  acquiredAt: number;
  // 🆕 Runtime state for mechanic tracking
  customData: Record<string, any>;
}

export interface AccessoryLogicHandler {
  // Returns modified damage amount
  onTakeDamage?: (damage: number, attacker: Entity | null, stats: AccessoryStats, instance: AccessoryInstance) => number;
  
  // Called every frame. Use for cooldowns, charging, area checks.
  onUpdate?: (player: Entity, delta: number, stats: AccessoryStats, instance: AccessoryInstance, time: number, enemies: Entity[], spawnProjectile: (data: any) => void) => void;
  
  // Called on kill
  onKill?: (victim: Entity, player: Entity, stats: AccessoryStats, instance: AccessoryInstance) => void;
}

export interface AccessoryArt {
  drawIcon: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;
  drawWorld: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) => void;
}

export interface AccessoryModule {
  definition: AccessoryDefinition;
  logic: AccessoryLogicHandler;
  art: AccessoryArt;
}
