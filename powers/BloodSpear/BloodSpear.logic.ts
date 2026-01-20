
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
  const count = power.stats.projectileCount || 1;
  const target = targets[0];
  if (!target) return;

  for(let i=0; i<count; i++) {
     const dx = target.x - player.x;
     const dy = target.y - player.y;
     const angle = Math.atan2(dy, dx) + (i - (count-1)/2) * 0.15;
     const speed = power.stats.speed * 0.08;

     spawnProjectile({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage: power.stats.damage,
      life: 1500,
      type: WeaponType.CRIMSON_BOLT,
      size: 10 + (power.level * 2),
      pierce: power.stats.pierce,
      level: power.level,
      acceleration: 0.05
    });
  }
};
