
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
    // Spawning handled by MinionSystem. 
    // This function runs on weapon tick but minions are persistent.
    // Can serve as a manual trigger or buff.
};
