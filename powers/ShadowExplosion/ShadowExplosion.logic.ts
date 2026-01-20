
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    const target = targets[0];
    if(!target) return;
    const angle = Math.atan2(target.y - player.y, target.x - player.x);
    
    spawnProjectile({
        x: player.x, y: player.y,
        vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
        damage: power.stats.damage, life: 1500,
        type: WeaponType.SHADOW_EXPLOSION, size: 20, 
        pierce: (power.level >= 5) ? 2 : 0, // Level 5: Missile pierces to create chain explosions
        onHit: (e, p) => {
            // Visual Effect (Persists for animation, no damage)
            spawnProjectile({
                x: e.x, y: e.y, vx:0, vy:0, damage: 0,
                life: 300, type: WeaponType.SHADOW_EXPLOSION, size: 80, isExplosion: true
            });
            
            // Damage Logic (Instant, hits everything in radius)
            spawnProjectile({
                x: e.x, y: e.y, vx:0, vy:0, damage: power.stats.damage,
                life: 0, type: WeaponType.SHADOW_EXPLOSION, size: 80, isExplosion: true,
                pierce: 999 
            });
        }
    });
};
