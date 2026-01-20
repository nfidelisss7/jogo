
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const count = power.stats.projectileCount || 1;
    for(let i=0; i<count; i++) {
        if(!targets[i]) break;
        spawnProjectile({
            x: targets[i].x, y: targets[i].y, vx:0, vy:0,
            damage: power.stats.damage, life: 3000,
            type: WeaponType.INKROOT_BIND, size: 30, level: power.level,
            onHit: (e) => {
                e.isStunned = true;
                e.stunTimer = 100; // Refresh root every frame
                
                // Strangulation (Level 4)
                if (power.level >= 4) {
                    e.hp! -= 1; // Extra tick
                }
            }
        });
    }
};
