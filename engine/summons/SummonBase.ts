
import { Entity, MinionType, PowerLevelStats } from '../../types';

export abstract class SummonBase {
  public id: string;
  public type: MinionType;
  public entity: Entity;
  public stats: PowerLevelStats;
  public level: number;
  
  // State Machine
  public state: 'idle' | 'move' | 'attack' | 'return' | 'special' = 'idle';
  public stateTimer: number = 0;
  
  // Animation State (Read by Renderer)
  public animScaleX: number = 1;
  public animScaleY: number = 1;
  public animRotation: number = 0;
  public animAlpha: number = 1;
  public animColorOffset: number = 0; // For flash effects

  // Combat
  public attackCooldownTimer: number = 0;
  public specialCooldownTimer: number = 0;

  constructor(entity: Entity, stats: PowerLevelStats, level: number) {
    this.entity = entity;
    this.id = entity.id;
    this.type = entity.minionType!;
    this.stats = stats;
    this.level = level;
    this.init();
  }

  abstract init(): void;
  abstract update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void): void;

  protected distanceTo(target: {x: number, y: number}): number {
    return Math.sqrt(Math.pow(target.x - this.entity.x, 2) + Math.pow(target.y - this.entity.y, 2));
  }

  protected angleTo(target: {x: number, y: number}): number {
    return Math.atan2(target.y - this.entity.y, target.x - this.entity.x);
  }

  protected getNearestEnemy(enemies: Entity[], range: number = 9999): Entity | null {
    let nearest: Entity | null = null;
    let minDst = range;

    for (const e of enemies) {
      if (!e.active) continue;
      const d = this.distanceTo(e);
      if (d < minDst) {
        minDst = d;
        nearest = e;
      }
    }
    return nearest;
  }
}
