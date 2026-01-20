
import { WeaponType, PowerLogicHandler } from '../../types';

export const logic: PowerLogicHandler = (power, player, targets, time, spawnProjectile) => {
  const count = power.stats.projectileCount || 1;

  for(let i=0; i<count; i++) {
    const target = targets[i];
    if(!target) break;

    const angle = Math.atan2(target.y - player.y, target.x - player.x);
    const speed = power.stats.speed * 0.05; 

    spawnProjectile({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage: power.stats.damage,
      life: 1500,
      type: WeaponType.VOID_TETHER,
      size: 15,
      pierce: 9999, // Fix: Must persist to show tether effect
      level: power.level,
      onHit: (e, proj) => {
          e.speed *= 0.5; // Massive slow
          e.isStunned = true;
          e.stunTimer = 100;
          
          if (power.level >= 5) {
              // Arcing
              spawnProjectile({
                  x: e.x, y: e.y, vx: 0, vy: 0, damage: power.stats.damage * 0.5,
                  life: 200, type: WeaponType.SHADOW_EXPLOSION, size: 50, isExplosion: true
              });
          }
      }
    });
  }
};
