
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType } from '../../types';
import { SOVEREIGN_STATS, ABILITIES } from './AbyssSovereign.types';

export const AbyssSovereignLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy) {
    // Stationary boss, no movement logic.

    // --- PHASE MANAGEMENT ---
    const hpPct = (boss.hp || 1) / (boss.maxHp || 1);
    if (hpPct < 0.5 && boss.phase === 1) {
      boss.phase = 2;
      // Phase Shift: Spawn protective Imps
      for(let i=0; i<8; i++) {
         const a = (i/8)*Math.PI*2;
         spawnEnemy(EnemyArchetype.VOID_IMP, boss.x + Math.cos(a)*200, boss.y + Math.sin(a)*200);
      }
    }

    // --- ABILITIES ---

    // 1. Mega Void Tether (Damage Beam)
    if (!boss.cooldowns![ABILITIES.MEGA_TETHER] || boss.cooldowns![ABILITIES.MEGA_TETHER] <= time) {
       // Visual Beam
       spawnProjectile({
         x: boss.x, y: boss.y, vx: 0, vy: 0,
         damage: 10, // Ticks handled by projectile life overlap or logic
         life: 200, // Short lived visual that refreshes
         type: WeaponType.VOID_TETHER,
         size: 20,
         level: 5,
         onHit: (e: any) => { /* Logic handled below */ } 
       });
       
       // Instant damage tick
       player.hp! -= 10; 
       
       // Global damage if Phase 2
       if (boss.phase === 2) {
         player.hp! -= 5; // Extra passive rot
       }

       boss.cooldowns![ABILITIES.MEGA_TETHER] = time + 500; // Ticks every 0.5s
    }

    // 2. Portal Rift (Minions)
    if (!boss.cooldowns![ABILITIES.PORTAL_RIFT] || boss.cooldowns![ABILITIES.PORTAL_RIFT] <= time) {
       const portals = 4;
       for(let i=0; i<portals; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 300 + Math.random() * 200;
          const px = boss.x + Math.cos(angle) * dist;
          const py = boss.y + Math.sin(angle) * dist;
          
          spawnEnemy(EnemyArchetype.VOID_IMP, px, py);
          spawnEnemy(EnemyArchetype.VOID_IMP, px+10, py+10);
       }
       boss.cooldowns![ABILITIES.PORTAL_RIFT] = time + 20000;
    }

    // 3. Black Hole Pull (Physics)
    if (!boss.cooldowns![ABILITIES.BLACK_HOLE] || boss.cooldowns![ABILITIES.BLACK_HOLE] <= time) {
       // Pull player
       const dx = boss.x - player.x;
       const dy = boss.y - player.y;
       const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist > 50) {
         player.x += (dx/dist) * (delta * 0.3); // Strong pull
         player.y += (dy/dist) * (delta * 0.3);
       }
       
       // Visual
       spawnProjectile({
         x: boss.x, y: boss.y, vx: 0, vy: 0,
         damage: 60, life: 1000, 
         type: WeaponType.ABYSS_PULL, 
         size: 500, level: 5
       });

       boss.cooldowns![ABILITIES.BLACK_HOLE] = time + 18000;
    }
  }
};
