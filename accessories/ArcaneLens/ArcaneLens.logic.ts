
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance, time) => {
      // 10s cycle: 7s charge, 3s active
      const cycle = time % 10000;
      const isActive = cycle > 7000;
      
      instance.customData.bonusSize = isActive ? 1.0 : 0;
      instance.customData.active = isActive;
  }
};
