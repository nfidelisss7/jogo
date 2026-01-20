
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class RangedAI implements AIStrategy {
  private idealRange: number;
  private fleeRange: number;

  constructor(idealRange: number = 350, fleeRange: number = 200) {
    this.idealRange = idealRange;
    this.fleeRange = fleeRange;
  }

  update(entity: Entity, player: Entity, context: AIContext) {
    const distSq = (entity.x - player.x)**2 + (entity.y - player.y)**2;
    const dist = Math.sqrt(distSq);
    const speed = entity.speed || 0.15;

    let moveX = 0;
    let moveY = 0;

    if (dist < this.fleeRange) {
        // Too close! Back away
        const flee = Steering.flee(entity, player.x, player.y);
        moveX = flee.x;
        moveY = flee.y;
    } else if (dist > this.idealRange + 50) {
        // Too far! Approach
        const seek = Steering.seek(entity, player.x, player.y);
        moveX = seek.x;
        moveY = seek.y;
    } else {
        // In the sweet spot: Strafe / Orbit
        // Vector pointing to player
        const dx = player.x - entity.x;
        const dy = player.y - entity.y;
        
        // Perpendicular vector (-y, x) for orbit
        let orbitX = -dy / dist;
        let orbitY = dx / dist;

        // Randomly switch direction every few seconds based on ID
        const dirSwitch = Math.floor(context.time / 2000) % 2 === 0 ? 1 : -1;
        
        moveX = orbitX * dirSwitch;
        moveY = orbitY * dirSwitch;
    }

    // Separation from other enemies to avoid clumping while shooting
    const sep = Steering.separation(entity, context.nearbyEnemies, 25);
    
    // Combine vectors (Separation has high priority for ranged units)
    const finalX = moveX * 1.0 + sep.x * 2.0;
    const finalY = moveY * 1.0 + sep.y * 2.0;

    // Apply smooth turn
    const vx = entity.velocity?.x || 0;
    const vy = entity.velocity?.y || 0;
    const turnRate = 0.1;

    entity.velocity = {
        x: vx + (finalX * speed - vx) * turnRate,
        y: vy + (finalY * speed - vy) * turnRate
    };
  }
}
