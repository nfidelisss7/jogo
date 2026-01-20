
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class BasicChaserAI implements AIStrategy {
  private desiredVelocity = { x: 0, y: 0 };

  update(entity: Entity, player: Entity, context: AIContext) {
    // 1. Seek Player
    const seek = Steering.seek(entity, player.x, player.y);
    
    // 2. Separate from neighbors (prevent stacking)
    const sep = Steering.separation(entity, context.nearbyEnemies, 30);

    // 3. Combine
    const finalX = seek.x * 1.0 + sep.x * 1.5;
    const finalY = seek.y * 1.0 + sep.y * 1.5;

    // Normalize
    const len = Math.sqrt(finalX*finalX + finalY*finalY);
    if (len > 0) {
        this.desiredVelocity.x = finalX / len;
        this.desiredVelocity.y = finalY / len;
    }

    // Apply
    const turnSpeed = 0.15;
    const speed = entity.speed || 0.1;
    
    // Smooth turn
    const vx = (entity.velocity?.x || 0);
    const vy = (entity.velocity?.y || 0);
    
    entity.velocity = {
        x: vx + (this.desiredVelocity.x * speed - vx) * turnSpeed,
        y: vy + (this.desiredVelocity.y * speed - vy) * turnSpeed
    };
  }
}
