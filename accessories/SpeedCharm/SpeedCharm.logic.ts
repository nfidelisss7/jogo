
import { AccessoryLogicHandler } from '../../types/accessoryTypes';
import { WeaponType } from '../../types';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance, time, enemies, spawnProjectile) => {
    // Init state
    if (instance.customData.charge === undefined) instance.customData.charge = 0;

    // Check movement
    const isMoving = player.velocity && (Math.abs(player.velocity.x) > 0.1 || Math.abs(player.velocity.y) > 0.1);
    
    if (isMoving) {
        instance.customData.charge += delta * 0.1; // Charge rate
        if (instance.customData.charge >= 100) {
            instance.customData.charge = 0;
            // Discharge
            spawnProjectile({
                x: player.x, y: player.y,
                vx: 0, vy: 0,
                damage: stats.staticDischargeDamage || 50,
                life: 500,
                type: WeaponType.THUNDER_ORB, // Reuse Thunder art
                size: 150,
                pierce: 999,
                level: 1,
                isExplosion: true
            });
        }
    } else {
        // Decay if standing still
        instance.customData.charge = Math.max(0, instance.customData.charge - delta * 0.05);
    }
  }
};
