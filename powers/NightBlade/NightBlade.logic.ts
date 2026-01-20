
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    // Refresh orbit positions constantly (low cooldown in stats)
    // We only spawn if time > lastFired + some small throttle to prevent 60fps spawn spam
    if (time > power.lastFired + 50) {
        power.lastFired = time; // Critical Fix: Update timer to prevent infinite loop
        
        const count = power.stats.projectileCount || 1;
        const playerSpeed = Math.sqrt((player.velocity?.x||0)**2 + (player.velocity?.y||0)**2);
        
        // Spin faster if moving (Blade Dancer mechanic)
        const speedBase = power.stats.speed || 2;
        const speed = speedBase + (playerSpeed * 0.5);
        
        power.orbitAngle = (power.orbitAngle || 0) + speed * 0.1;
        
        for(let i=0; i<count; i++) {
            const angle = power.orbitAngle + (i * (Math.PI * 2 / count));
            const r = power.stats.range;
            
            spawnProjectile({
                x: player.x + Math.cos(angle) * r,
                y: player.y + Math.sin(angle) * r,
                vx: 0, vy: 0, 
                // Momentum Damage Bonus
                damage: power.stats.damage * (1 + (playerSpeed * 0.1)), 
                life: 200, 
                type: WeaponType.NIGHT_BLADE,
                size: 25,
                pierce: 999,
                level: power.level
            });
        }
    }
};
