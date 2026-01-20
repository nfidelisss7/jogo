
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0,
        damage: power.stats.damage * 0.1, life: 200,
        type: WeaponType.PETAL_VORTEX, size: power.stats.range, attachToPlayer: true,
        onHit: (e) => {
            // Tornado Spin Physics
            if (power.level >= 3) {
                const dx = e.x - player.x;
                const dy = e.y - player.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx);
                
                // Orbit velocity (Perpendicular)
                const tangent = angle + Math.PI/2;
                const pullStrength = 2;
                e.x += Math.cos(tangent) * 3 - (dx/dist)*pullStrength; 
                e.y += Math.sin(tangent) * 3 - (dy/dist)*pullStrength;
            }
        }
    });
};
