
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class SpiderAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    const speed = entity.speed || 0.14;
    
    // Base Seek
    const seek = Steering.seek(entity, player.x, player.y);
    
    // Zig-Zag: Add a perpendicular vector based on time
    // Perpendicular to (x, y) is (-y, x)
    const zigZagFreq = 0.005;
    const zigZagAmp = 1.5;
    const noise = Math.sin(context.time * zigZagFreq + entity.id.charCodeAt(0));
    
    const perpX = -seek.y * noise * zigZagAmp;
    const perpY = seek.x * noise * zigZagAmp;

    // Separation
    const sep = Steering.separation(entity, context.nearbyEnemies, 35);

    // Combine
    const finalX = seek.x + perpX + sep.x * 2.0;
    const finalY = seek.y + perpY + sep.y * 2.0;

    // Smooth
    const turnRate = 0.2;
    const vx = entity.velocity?.x || 0;
    const vy = entity.velocity?.y || 0;

    entity.velocity = {
        x: vx + (finalX * speed - vx) * turnRate,
        y: vy + (finalY * speed - vy) * turnRate
    };
  }
}
