
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

enum HoundState {
  CHASE = 0,
  PREP = 1,
  LUNGE = 2,
  COOLDOWN = 3
}

export class BloodHoundAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    if (!entity.aiValues) entity.aiValues = { seed: Math.random(), customState: HoundState.CHASE, timer: 0 };
    
    const state = entity.aiValues.customState as HoundState;
    const distSq = (entity.x - player.x)**2 + (entity.y - player.y)**2;
    const speed = entity.speed || 0.2;

    switch (state) {
      case HoundState.CHASE:
        // Move towards player
        const seek = Steering.seek(entity, player.x, player.y);
        const sep = Steering.separation(entity, context.nearbyEnemies, 40);
        
        // Combine vectors
        let dx = seek.x + sep.x * 1.2;
        let dy = seek.y + sep.y * 1.2;
        
        // Apply velocity
        entity.velocity = { x: dx * speed, y: dy * speed };

        // Trigger Lunge if close
        if (distSq < 200 * 200) {
            entity.aiValues.customState = HoundState.PREP;
            entity.aiValues.timer = 500; // 0.5s prep time
            // Visual cue: Flash red or stop
            entity.velocity = { x: 0, y: 0 };
        }
        break;

      case HoundState.PREP:
        // Stand still and aim
        entity.aiValues.timer! -= context.delta;
        // Rotate towards player visually (if renderer supported it)
        if (entity.aiValues.timer! <= 0) {
            entity.aiValues.customState = HoundState.LUNGE;
            entity.aiValues.timer = 300; // 0.3s dash duration
            
            // Calculate Lunge Vector
            const lungeDir = Steering.seek(entity, player.x, player.y);
            // Massive speed burst (4x)
            entity.velocity = { 
                x: lungeDir.x * speed * 4, 
                y: lungeDir.y * speed * 4 
            };
        }
        break;

      case HoundState.LUNGE:
        // Locked velocity (cannot turn)
        entity.aiValues.timer! -= context.delta;
        if (entity.aiValues.timer! <= 0) {
            entity.aiValues.customState = HoundState.COOLDOWN;
            entity.aiValues.timer = 1500; // 1.5s fatigue
            entity.velocity = { x: 0, y: 0 };
        }
        break;

      case HoundState.COOLDOWN:
        // Slow movement recovery
        entity.aiValues.timer! -= context.delta;
        const recoverSeek = Steering.seek(entity, player.x, player.y);
        entity.velocity = { 
            x: recoverSeek.x * speed * 0.3, 
            y: recoverSeek.y * speed * 0.3 
        };
        
        if (entity.aiValues.timer! <= 0) {
            entity.aiValues.customState = HoundState.CHASE;
        }
        break;
    }
  }
}
