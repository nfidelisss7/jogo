
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    if (time > power.lastFired + 30) {
        power.lastFired = time; // Critical Fix: Update timer
        
        const count = power.stats.projectileCount || 1;
        const speed = 2.0;
        power.orbitAngle = (power.orbitAngle || 0) + speed * 0.05;
        
        // Expansion logic: Radius pulses + Scale with kills
        const breath = Math.sin(time * 0.002) * 50;
        const killBonus = (player.killCount || 0) * 0.2; // 1 pixel per 5 kills
        const radius = power.stats.range + breath + Math.min(100, killBonus); 

        for(let i=0; i<count; i++) {
            const angle = power.orbitAngle + (i * (Math.PI * 2 / count));
            
            spawnProjectile({
                x: player.x + Math.cos(angle) * radius,
                y: player.y + Math.sin(angle) * radius,
                vx: 0, vy: 0,
                damage: power.stats.damage,
                life: 40, 
                type: WeaponType.BLOOD_ORB,
                size: 20 + (power.level * 2),
                pierce: 999,
                level: power.level,
                onHit: (e) => {
                    if (power.level >= 5) {
                        e.isBleeding = true;
                        e.bleedDamage = 5;
                        e.bleedTimer = 2000;
                    }
                }
            });
        }
    }
};
