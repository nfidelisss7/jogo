
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const count = power.stats.projectileCount || 1;
    for(let i=0; i<count; i++) {
        const target = targets[i];
        if(!target) break;
        
        // Spawn invisible instant-hit projectile to deal damage via engine
        spawnProjectile({
            x: target.x, y: target.y, vx: 0, vy: 0, 
            damage: power.stats.damage, 
            life: 100, // Short life
            type: WeaponType.SPECTRAL_CURSE, 
            size: 40, // Large hitbox to ensure hit
            pierce: 999,
            level: power.level,
            isExplosion: true // Treats as non-projectile for some logic
        });
    }
};
