
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance, time, enemies) => {
      // Calculate density
      let count = 0;
      const rangeSq = 300 * 300;
      for(const e of enemies) {
          if (!e.active) continue;
          const d = (e.x - player.x)**2 + (e.y - player.y)**2;
          if (d < rangeSq) count++;
      }
      
      const stacks = Math.min(6, Math.floor(count / 10)); // Max 6 stacks (30%)
      instance.customData.bonusCDR = stacks * 0.05;
  }
};
