
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    spawnProjectile({
        x: player.x,
        y: player.y,
        vx: 0,
        vy: 0,
        damage: power.stats.damage,
        life: 600,
        type: WeaponType.HORROR_WAVE,
        size: power.stats.range,
        level: power.level,
        pierce: 9999,
        onHit: (e) => {
            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0) {
                 e.x += (dx/dist) * 20;
                 e.y += (dy/dist) * 20;
            }
        }
    });
};
