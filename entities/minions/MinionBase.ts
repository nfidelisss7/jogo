
import { Entity, MinionType, PowerLevelStats } from '../../types';

export class MinionBase {
  static create(type: MinionType, x: number, y: number, stats: PowerLevelStats, level: number): Entity {
    return {
      id: `minion_${Math.random()}`,
      x, y,
      type: 'minion',
      minionType: type,
      active: true,
      size: 15,
      hp: 100,
      stats,
      powerLevel: level,
      velocity: { x: 0, y: 0 },
      aiValues: { seed: Math.random() }
    };
  }
}
