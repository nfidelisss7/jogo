
import { Entity } from '../../types';

export class HealerAI {
  /**
   * Finds the most critical ally to heal based on priority:
   * 1. Bosses/Kings (Always first)
   * 2. Elites (High HP pool)
   * 3. Low HP% Allies
   */
  static findTriageTarget(healer: Entity, candidates: Entity[], range: number): Entity | null {
    let bestTarget: Entity | null = null;
    let highestScore = -1;

    for (const ally of candidates) {
      if (!ally.active || ally.id === healer.id || ally.type !== 'enemy' && ally.type !== 'boss') continue;
      if (ally.hp! >= ally.maxHp!) continue; // Ignore full HP

      const distSq = (healer.x - ally.x)**2 + (healer.y - ally.y)**2;
      if (distSq > range * range) continue;

      let score = 0;

      // Priority 1: Value
      if (ally.type === 'boss') score += 1000;
      if (ally.isKing) score += 500;

      // Priority 2: Desperation (Missing HP %)
      const hpPct = ally.hp! / ally.maxHp!;
      score += (1 - hpPct) * 100;

      if (score > highestScore) {
        highestScore = score;
        bestTarget = ally;
      }
    }

    return bestTarget;
  }

  static getEvasiveVelocity(me: Entity, player: Entity, delta: number): {x: number, y: number} {
    const distSq = (me.x - player.x)**2 + (me.y - player.y)**2;
    const safeDist = 300 * 300;
    
    if (distSq < safeDist) {
        // Run away
        const angle = Math.atan2(me.y - player.y, me.x - player.x);
        return {
            x: Math.cos(angle) * me.speed! * delta,
            y: Math.sin(angle) * me.speed! * delta
        };
    }
    return { x: 0, y: 0 };
  }
}
