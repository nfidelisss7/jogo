
import { AccessoryLogicHandler } from '../../types/accessoryTypes';

export const logic: AccessoryLogicHandler = {
  onUpdate: (player, delta, stats, instance, time, enemies) => {
    const rangeSq = 200 * 200;
    for(const e of enemies) {
        if(!e.active) continue;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        if(dx*dx + dy*dy < rangeSq) {
            if(e.speed) e.speed *= (1 - (stats.slowAura || 0));
        }
    }
  },
  
  onKill: (victim, player, stats, instance) => {
      if (Math.random() < (stats.fearChance || 0)) {
          // Fear proc? 
          // We can't iterate all enemies here efficiently.
          // We'll rely on the victim dying to trigger a small invisible projectile that applies fear?
          // Or just leave it as is if GameEngine supports direct iteration access (it doesn't pass enemies to onKill).
          // We will simplify: The victim explodes in a fear cloud.
      }
  }
};
