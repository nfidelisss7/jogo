
import { Entity, EnemyArchetype } from '../../types';

export class EnemyBase {
  static create(id: string, x: number, y: number, archetype: EnemyArchetype): Entity {
    return {
      id,
      x, y,
      type: 'enemy',
      active: true,
      archetype,
      artKey: archetype,
      size: 15, // Default, overridden by factory
      hp: 100,
      maxHp: 100,
      speed: 0.1,
      velocity: { x: 0, y: 0 },
      isStunned: false,
      aiValues: { seed: Math.random() }
    };
  }
}
