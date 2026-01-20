
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const target = targets[0];
    if (!target) return;
    const angle = Math.atan2(target.y - player.y, target.x - player.x);

    spawnProjectile({
        x: player.x, y: player.y,
        vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10,
        damage: power.stats.damage, life: 1000,
        type: WeaponType.SPLINTER_SHOT, size: 15, pierce: 0, level: power.level,
        onHit: (e, p) => {
            // Shrapnel Cone BEHIND target
            const shards = 3 + power.level;
            for(let i=0; i<shards; i++) {
                const spread = angle + (Math.random()-0.5) * 1.5; // Wide cone
                spawnProjectile({
                    x: e.x, y: e.y,
                    vx: Math.cos(spread) * 12, vy: Math.sin(spread) * 12,
                    damage: power.stats.damage * 0.5, life: 300,
                    type: WeaponType.SPLINTER_SHOT, size: 5, pierce: 2
                });
            }
        }
    });
};
