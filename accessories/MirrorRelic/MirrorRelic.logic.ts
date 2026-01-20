
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance, time) => {
      const cycle = time % 5000;
      const isActive = cycle > 3000; // Active last 2s of 5s cycle
      
      instance.customData.bonusAmount = isActive ? 2 : 0;
  }
};
