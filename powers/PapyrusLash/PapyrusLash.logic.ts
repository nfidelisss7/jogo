
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const target = targets[0];
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
    
    // Unfurl segments
    for(let i=0; i<10; i++) {
        const dist = i * 40;
        spawnProjectile({
            x: player.x + Math.cos(angle) * dist,
            y: player.y + Math.sin(angle) * dist,
            vx: 0, vy: 0, damage: power.stats.damage, life: 500,
            type: WeaponType.PAPYRUS_LASH, size: 30, pierce: 999, level: power.level
        });
    }
};
