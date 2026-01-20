
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
  const count = power.stats.projectileCount || 1;
  for(let i=0; i<count; i++) {
    const target = targets[i % targets.length];
    if(!target) continue;
    const angle = Math.atan2(target.y - player.y, target.x - player.x);
    spawnProjectile({
      x: player.x, y: player.y, vx: Math.cos(angle)*5, vy: Math.sin(angle)*5,
      damage: power.stats.damage, life: 2000,
      type: WeaponType.MISSILE, size: 8, pierce: power.stats.pierce, level: power.level
    });
  }
};
