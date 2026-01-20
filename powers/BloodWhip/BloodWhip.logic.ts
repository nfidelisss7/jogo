
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const count = power.stats.projectileCount || 1;
    // Determine facing angle based on velocity, default right
    const baseAngle = (player.velocity && (player.velocity.x !== 0 || player.velocity.y !== 0))
        ? Math.atan2(player.velocity.y, player.velocity.x) 
        : 0;

    for(let i=0; i<count; i++) {
        const offset = (i - (count-1)/2) * 0.5; // Fan out
        const angle = baseAngle + offset;

        spawnProjectile({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * 2, // Slow drift
            vy: Math.sin(angle) * 2,
            damage: power.stats.damage,
            life: 200, // Instant strike visual
            type: WeaponType.BLOOD_WHIP,
            size: power.stats.range, 
            pierce: 999,
            level: power.level
        });
    }
};
