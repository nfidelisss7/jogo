
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class SkeletonAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    // Generate a consistent "slot" angle for this skeleton based on its ID
    // simple hash
    let hash = 0;
    for (let i = 0; i < entity.id.length; i++) hash = entity.id.charCodeAt(i) + ((hash << 5) - hash);
    const slotIndex = Math.abs(hash) % 8; // 8 slots around player
    
    const angle = (slotIndex / 8) * Math.PI * 2;
    const surroundDist = 120; // Radius of the encirclement

    // Target position is offset from player
    const targetX = player.x + Math.cos(angle) * surroundDist;
    const targetY = player.y + Math.sin(angle) * surroundDist;

    // Seek that slot
    const seek = Steering.seek(entity, targetX, targetY);
    
    // Avoid crowding
    const sep = Steering.separation(entity, context.nearbyEnemies, 25);

    // Combine
    const finalX = seek.x * 1.0 + sep.x * 1.5;
    const finalY = seek.y * 1.0 + sep.y * 1.5;

    const speed = entity.speed || 0.1;
    const vx = entity.velocity?.x || 0;
    const vy = entity.velocity?.y || 0;
    const turnRate = 0.15;

    entity.velocity = {
        x: vx + (finalX * speed - vx) * turnRate,
        y: vy + (finalY * speed - vy) * turnRate
    };
  }
}
