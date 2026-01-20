
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class ZombieAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    // 1. Horde Mechanics: Strong Cohesion/Alignment with other Zombies
    const neighbors = context.nearbyEnemies.filter(e => e.archetype === entity.archetype);
    
    // Weights
    const wSeek = 1.0;
    const wSep = 1.5; // Don't stack too much
    const wAlign = 0.5; // Move together
    
    const seek = Steering.seek(entity, player.x, player.y);
    const sep = Steering.separation(entity, context.nearbyEnemies, 25);
    const align = Steering.alignment(entity, neighbors, 80);

    let moveX = seek.x * wSeek + sep.x * wSep + align.x * wAlign;
    let moveY = seek.y * wSeek + sep.y * wSep + align.y * wAlign;

    // 2. Lunge Mechanic
    // If very close, ignore separation and burst forward
    const distSq = (entity.x - player.x)**2 + (entity.y - player.y)**2;
    let currentSpeed = entity.speed || 0.08;

    if (distSq < 80 * 80) {
        // Lunge!
        currentSpeed *= 2.5; 
        moveX = seek.x; // Pure seek
        moveY = seek.y;
    }

    // Normalize result
    const len = Math.sqrt(moveX*moveX + moveY*moveY);
    if (len > 0) {
        moveX = (moveX / len);
        moveY = (moveY / len);
    }

    // Apply
    const vx = entity.velocity?.x || 0;
    const vy = entity.velocity?.y || 0;
    const turnRate = 0.1; // Zombies turn slow

    entity.velocity = {
        x: vx + (moveX * currentSpeed - vx) * turnRate,
        y: vy + (moveY * currentSpeed - vy) * turnRate
    };
  }
}
