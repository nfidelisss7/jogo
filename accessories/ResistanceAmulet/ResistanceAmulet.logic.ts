
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance) => {
    // Manage cooldown
    if (instance.customData.cooldown > 0) {
      instance.customData.cooldown -= delta;
    }
    
    // Manage buff duration
    if (instance.customData.active > 0) {
      instance.customData.active -= delta;
    }
  },

  onTakeDamage: (damage, attacker, stats, instance) => {
    // Initialize data
    if (instance.customData.cooldown === undefined) instance.customData.cooldown = 0;
    if (instance.customData.active === undefined) instance.customData.active = 0;

    let finalDamage = damage;

    // Apply Passive
    finalDamage *= (1 - (stats.damageReduction || 0));

    // Check Active Buff
    if (instance.customData.active > 0) {
      finalDamage *= 0.5; // 50% reduction
    }

    // Trigger Reactive Armor if cooldown ready
    if (damage > 10 && instance.customData.cooldown <= 0) {
        instance.customData.active = 2000; // 2s duration
        instance.customData.cooldown = 10000; // 10s cooldown
    }

    return finalDamage;
  }
};
