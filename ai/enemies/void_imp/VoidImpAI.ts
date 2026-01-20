
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

export class VoidImpAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    if (!entity.aiValues) entity.aiValues = { seed: Math.random(), timer: 0 }; // Timer = Teleport Cooldown

    const distSq = (entity.x - player.x)**2 + (entity.y - player.y)**2;
    const speed = entity.speed || 0.15;

    // Cooldown management
    if (entity.aiValues.timer! > 0) {
        entity.aiValues.timer! -= context.delta;
    }

    // TELEPORT LOGIC
    // Trigger if too close OR if taken damage (handled roughly by checking if HP dropped?) 
    // For now, just proximity check + random chance
    if (distSq < 100 * 100 && entity.aiValues.timer! <= 0) {
        // Teleport behind player or to random spot
        const angle = Math.random() * Math.PI * 2;
        const teleportDist = 250;
        
        entity.x = player.x + Math.cos(angle) * teleportDist;
        entity.y = player.y + Math.sin(angle) * teleportDist;
        
        entity.aiValues.timer = 3000; // 3s cooldown
        entity.velocity = { x: 0, y: 0 };
        return; // Skip movement this frame
    }

    // MOVEMENT LOGIC (Kiting)
    let moveX = 0, moveY = 0;

    if (distSq < 200 * 200) {
        // Too close: Flee
        const flee = Steering.flee(entity, player.x, player.y);
        moveX = flee.x;
        moveY = flee.y;
    } else if (distSq > 400 * 400) {
        // Too far: Seek
        const seek = Steering.seek(entity, player.x, player.y);
        moveX = seek.x;
        moveY = seek.y;
    } else {
        // Sweet spot: Strafe/Orbit
        const seek = Steering.seek(entity, player.x, player.y);
        // Perpendicular vector (-y, x)
        moveX = -seek.y;
        moveY = seek.x;
        
        // Randomly switch direction
        if (Math.floor(context.time / 2000) % 2 === 0) {
            moveX = -moveX;
            moveY = -moveY;
        }
    }

    // Separation is weak for Imps (they float)
    const sep = Steering.separation(entity, context.nearbyEnemies, 20);
    
    // Combine
    const finalX = moveX * 1.0 + sep.x * 0.5;
    const finalY = moveY * 1.0 + sep.y * 0.5;

    // Apply
    const currentVx = entity.velocity?.x || 0;
    const currentVy = entity.velocity?.y || 0;
    const turnRate = 0.1; // Floatier

    entity.velocity = {
        x: currentVx + (finalX * speed - currentVx) * turnRate,
        y: currentVy + (finalY * speed - currentVy) * turnRate
    };
  }
}
