
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    spawnProjectile({
        x: player.x, y: player.y, vx:0, vy:0,
        damage: power.stats.damage * 0.1, life: power.stats.duration || 5000,
        type: WeaponType.RAZOR_MEADOW, size: power.stats.range,
        behavior: (p, delta) => {
            // Overgrowth Mechanic (Level 5)
            if (power.level >= 5) {
                p.size += delta * 0.05; 
            }
        },
        attachToPlayer: false, // Static ground zone
        pierce: 9999, // Fix: Must be infinite to act as a zone
        onHit: (e) => { 
            e.hp! -= 1; // Extra tick
            if (power.level >= 3) e.speed *= 0.75;
            if (power.level >= 4) e.isBleeding = true;
        }
    });
};
