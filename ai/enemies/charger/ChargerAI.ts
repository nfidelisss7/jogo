
import { AIStrategy, AIContext } from '../../core/AIStrategy';
import { Entity } from '../../../types';
import { Steering } from '../../core/Steering';

enum ChargerState {
  TRACK = 0,
  WINDUP = 1,
  CHARGE = 2,
  RECOVER = 3
}

export class ChargerAI implements AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext) {
    if (!entity.aiValues) entity.aiValues = { seed: Math.random(), customState: ChargerState.TRACK, timer: 0 };
    
    const state = entity.aiValues.customState as ChargerState;
    const distSq = (entity.x - player.x)**2 + (entity.y - player.y)**2;
    const speed = entity.speed || 0.12;

    if (entity.aiValues.timer! > 0) entity.aiValues.timer! -= context.delta;

    switch (state) {
        case ChargerState.TRACK: {
            // Move normally towards player
            const seek = Steering.seek(entity, player.x, player.y);
            const sep = Steering.separation(entity, context.nearbyEnemies, 40);
            
            const dx = seek.x + sep.x;
            const dy = seek.y + sep.y;
            
            entity.velocity = { x: dx * speed, y: dy * speed };

            // Trigger Charge if lined up and close enough (but not too close)
            if (distSq < 250 * 250 && distSq > 100 * 100 && entity.aiValues.timer! <= 0) {
                entity.aiValues.customState = ChargerState.WINDUP;
                entity.aiValues.timer = 600; // 0.6s warning
                entity.velocity = { x: 0, y: 0 }; // Stop
                // Optional: Store target vector here if we want locked charge direction
            }
            break;
        }

        case ChargerState.WINDUP: {
            // Visual tell: shaking or stopping (handled by renderer usually)
            // Just aim at player perfectly during windup
            if (entity.aiValues.timer! <= 0) {
                entity.aiValues.customState = ChargerState.CHARGE;
                entity.aiValues.timer = 800; // Charge duration
                
                // Launch
                const dir = Steering.seek(entity, player.x, player.y);
                entity.velocity = { 
                    x: dir.x * speed * 3.5, 
                    y: dir.y * speed * 3.5 
                };
            }
            break;
        }

        case ChargerState.CHARGE: {
            // Locked velocity, high inertia
            // Only update timer
            if (entity.aiValues.timer! <= 0) {
                entity.aiValues.customState = ChargerState.RECOVER;
                entity.aiValues.timer = 1500; // Tired
                entity.velocity = { x: 0, y: 0 };
            }
            break;
        }

        case ChargerState.RECOVER: {
            // Move very slowly
            if (entity.aiValues.timer! <= 0) {
                entity.aiValues.customState = ChargerState.TRACK;
            } else {
                // Drift slowly
                const seek = Steering.seek(entity, player.x, player.y);
                entity.velocity = { x: seek.x * speed * 0.2, y: seek.y * speed * 0.2 };
            }
            break;
        }
    }
  }
}
