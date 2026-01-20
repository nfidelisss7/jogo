
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const count = power.stats.projectileCount || 1;
    for(let i=0; i<count; i++) {
        const target = targets[i % targets.length];
        const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : Math.random()*Math.PI*2;
        const speed = power.stats.speed * 0.05;

        spawnProjectile({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: power.stats.damage * 0.1, // Tick damage
            life: 2000,
            type: WeaponType.ABYSS_PULL,
            size: 60, 
            pierce: 999, 
            level: power.level,
            onHit: (e, proj) => {
                // Drag towards projectile
                const dx = proj.x - e.x;
                const dy = proj.y - e.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 10) {
                    e.x += (dx/dist) * 2;
                    e.y += (dy/dist) * 2;
                }
            },
            behavior: (proj, delta) => {
                // Implode at end
                if (proj.life! < 50 && !proj.customData?.exploded) {
                    proj.customData = { exploded: true };
                    spawnProjectile({
                        x: proj.x, y: proj.y, vx: 0, vy: 0,
                        damage: power.stats.damage * 3,
                        life: 300, type: WeaponType.SHADOW_EXPLOSION, size: 120, isExplosion: true
                    });
                }
                proj.x += proj.vx! * delta;
                proj.y += proj.vy! * delta;
                proj.vx! *= 0.95; // Slow down to stop
                proj.vy! *= 0.95;
            }
        });
    }
};
