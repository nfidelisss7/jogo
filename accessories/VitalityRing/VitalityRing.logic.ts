
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance) => {
    // Check for overheal
    if (player.hp !== undefined && player.maxHp !== undefined) {
        if (player.hp > player.maxHp) {
            const excess = player.hp - player.maxHp;
            const shieldCap = player.maxHp * (stats.shieldCap || 0.5);
            
            // Init shield storage
            if (instance.customData.shield === undefined) instance.customData.shield = 0;
            
            // Add to shield, clamp at cap
            instance.customData.shield = Math.min(shieldCap, instance.customData.shield + excess);
            
            // Reset player HP to max
            player.hp = player.maxHp;
        }
    }
    
    // Decay shield slowly if not taking damage? No, keep it permanent until hit.
  },

  onTakeDamage: (damage, attacker, stats, instance) => {
      let finalDamage = damage;
      if (instance.customData.shield > 0) {
          const absorb = Math.min(instance.customData.shield, finalDamage);
          instance.customData.shield -= absorb;
          finalDamage -= absorb;
      }
      return finalDamage;
  }
};
