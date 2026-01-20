
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    if (!targets[0]) return;
    const count = power.stats.projectileCount || 1;

    for(let i=0; i<count; i++) {
        const target = targets[i % targets.length];
        const angle = Math.atan2(target.y - player.y, target.x - player.x);
        const speed = power.stats.speed * 0.05;

        spawnProjectile({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: power.stats.damage,
            life: 3000,
            type: WeaponType.DARK_PROJECTILE,
            size: 15 + power.level * 2,
            level: power.level,
            onHit: (e) => {
                const kb = power.stats.knockback || 10;
                e.x += Math.cos(angle) * kb;
                e.y += Math.sin(angle) * kb;
                if (power.level >= 3) {
                    spawnProjectile({
                        x: e.x, y: e.y, vx:0, vy:0, damage: power.stats.damage * 0.5,
                        life: 300, type: WeaponType.SHADOW_EXPLOSION, size: 40, isExplosion: true
                    });
                }
            }
        });
    }
};
