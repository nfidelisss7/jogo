
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onKill: (victim, player, stats, instance) => {
      if (victim.isBleeding) {
          player.hp = Math.min(player.maxHp!, player.hp! + 2);
      }
  }
};
