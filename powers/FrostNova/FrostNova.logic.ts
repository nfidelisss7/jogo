
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    // Visual
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: 0, life: 600,
        type: WeaponType.FROST_NOVA, size: power.stats.range, level: power.level
    });

    // Logic
    spawnProjectile({
        x: player.x, y: player.y, vx: 0, vy: 0, damage: power.stats.damage,
        life: 0, type: WeaponType.FROST_NOVA, size: power.stats.range, pierce: 999,
        onHit: (e) => {
            if (power.level >= 4 && e.isStunned) {
                // Shatter Combo
                e.hp! -= power.stats.damage * 2;
                spawnProjectile({
                    x: e.x, y: e.y, vx:0, vy:0, damage: 0, life: 200,
                    type: WeaponType.SPLINTER_SHOT, size: 20, isExplosion: true
                });
            }
            e.isStunned = true;
            e.stunTimer = 1000 + (power.level * 200);
        }
    });
};
