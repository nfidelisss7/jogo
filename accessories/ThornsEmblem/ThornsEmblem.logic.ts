
import { AccessoryLogicHandler } from '../../types/accessoryTypes';
import { WeaponType } from '../../types';

export const logic: AccessoryLogicHandler = {
  onTakeDamage: (damage, attacker, stats, instance) => {
      if (damage > 0 && (instance.customData.cooldown || 0) <= 0) {
          instance.customData.triggerBurst = true;
          instance.customData.cooldown = 2000;
      }
      return damage;
  },

  onUpdate: (player, delta, stats, instance, time, enemies, spawnProjectile) => {
      if (instance.customData.cooldown > 0) instance.customData.cooldown -= delta;

      if (instance.customData.triggerBurst) {
          instance.customData.triggerBurst = false;
          // Fire 8 spikes
          for(let i=0; i<8; i++) {
              const angle = (i/8) * Math.PI * 2;
              spawnProjectile({
                  x: player.x, y: player.y,
                  vx: Math.cos(angle) * 0.3, vy: Math.sin(angle) * 0.3, 
                  damage: 50, life: 1000,
                  type: WeaponType.INKROOT_BIND, // Reusing spike art
                  size: 10, pierce: 2, level: 1
              });
          }
      }
  }
};
