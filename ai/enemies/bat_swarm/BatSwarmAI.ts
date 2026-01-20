
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class BatSwarmAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    const neighbors = context.nearbyEnemies.filter(e => e.archetype === entity.archetype); // Only flock with other bats
    const speed = entity.speed || 0.22;

    // Reynolds Flocking Rules
    // 1. Separation (Avoid crowding)
    const sep = Steering.separation(entity, context.nearbyEnemies, 25); // Separate from ALL enemies
    // 2. Alignment (Fly in same direction)
    const ali = Steering.alignment(entity, neighbors, 100);
    // 3. Cohesion (Stay close to group center)
    const coh = Steering.cohesion(entity, neighbors, 100);
    // 4. Goal (Seek Player)
    const seek = Steering.seek(entity, player.x, player.y);

    // Weights
    const wSep = 2.0;
    const wAli = 1.0;
    const wCoh = 1.0;
    const wSeek = 0.8; // Swarm intent is slightly lower priority than swarm mechanics

    const dx = (sep.x * wSep) + (ali.x * wAli) + (coh.x * wCoh) + (seek.x * wSeek);
    const dy = (sep.y * wSep) + (ali.y * wAli) + (coh.y * wCoh) + (seek.y * wSeek);

    // Normalize
    const len = Math.sqrt(dx*dx + dy*dy);
    let finalX = 0, finalY = 0;
    if (len > 0) {
        finalX = (dx / len) * speed;
        finalY = (dy / len) * speed;
    }

    // Apply with high turn rate (Bats are agile)
    const turnRate = 0.2;
    const vx = entity.velocity?.x || 0;
    const vy = entity.velocity?.y || 0;

    entity.velocity = {
        x: vx + (finalX - vx) * turnRate,
        y: vy + (finalY - vy) * turnRate
    };
  }
}
