
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    // 1. Visual Field (Sticks to player)
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: 0, life: 200,
        type: WeaponType.CHRONOKINETIC_FIELD,
        size: power.stats.range, level: power.level, attachToPlayer: true
    });

    // 2. Logic Hitbox
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: power.stats.damage, life: 0,
        type: WeaponType.CHRONOKINETIC_FIELD,
        size: power.stats.range, pierce: 999, level: power.level,
        onHit: (e) => {
            // Apply Slow
            e.slowTimer = 200;
            // Stutter Mechanic (Level 2+)
            if (power.level >= 2 && Math.random() < 0.05) {
               // Teleport enemy back along their velocity vector (Rewind)
               if (e.velocity) {
                   e.x -= e.velocity.x * 20;
                   e.y -= e.velocity.y * 20;
               }
            }
        }
    });
};
