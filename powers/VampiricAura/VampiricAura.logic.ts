
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: 0, life: 1100,
        type: WeaponType.VAMPIRIC_AURA, size: power.stats.range, attachToPlayer: true
    });
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: power.stats.damage, life: 0,
        type: WeaponType.VAMPIRIC_AURA, size: power.stats.range, pierce: 9999
    });
};
