
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    // Only fire if targets exist
    if(targets.length === 0) return;
    const count = power.stats.projectileCount || 1;

    for(let i=0; i<count; i++) {
        const target = targets[i % targets.length];
        if(!target) break;
        const angle = Math.atan2(target.y - player.y, target.x - player.x);
        
        spawnProjectile({
            x: player.x, y: player.y,
            vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
            damage: power.stats.damage, life: 2000,
            type: WeaponType.THUNDER_ORB, size: 30, pierce: 999, level: power.level,
            behavior: (proj, delta) => {
                // Tesla Arc (Level 3+)
                if (power.level >= 3 && Math.random() < 0.1) {
                    spawnProjectile({
                        x: proj.x, y: proj.y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
                        damage: power.stats.damage * 0.5, life: 100,
                        type: WeaponType.THUNDER_ORB, size: 5, pierce: 1 // Sparks
                    });
                }
            }
        });
    }
};
