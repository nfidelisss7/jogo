
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType } from '../../types';
import { REVENANT_STATS, ABILITIES } from './EternalRevenant.types';

export const EternalRevenantLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy) {
    const distToPlayer = Math.sqrt(Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2));

    // --- REGENERATION ---
    if (boss.hp! < boss.maxHp! * REVENANT_STATS.REGEN_THRESHOLD) {
       // Regenerate per second (approximate by delta)
       boss.hp = Math.min(boss.maxHp!, boss.hp! + (REVENANT_STATS.REGEN_AMOUNT * (delta/1000)));
    }

    // --- PHASE ---
    if (boss.phase === 1 && boss.hp! < boss.maxHp! * 0.5) {
       boss.phase = 2;
       boss.hp! += 3000; // Shield mechanic (just heal for now)
       boss.size *= 1.2; // Grow larger
    }

    // --- MOVEMENT ---
    const moveStep = REVENANT_STATS.SPEED * delta;
    if (distToPlayer > 80) {
      boss.x += ((player.x - boss.x) / distToPlayer) * moveStep;
      boss.y += ((player.y - boss.y) / distToPlayer) * moveStep;
    }

    // --- ABILITIES ---

    // 1. Necro Horde
    if (!boss.cooldowns![ABILITIES.NECRO_HORDE] || boss.cooldowns![ABILITIES.NECRO_HORDE] <= time) {
       const count = boss.phase === 2 ? 20 : 10;
       for(let i=0; i<count; i++) {
         const type = Math.random() > 0.6 ? EnemyArchetype.CRIMSON_GHOUL : EnemyArchetype.NECRO_SPIDER;
         const ox = (Math.random()-0.5) * 300;
         const oy = (Math.random()-0.5) * 300;
         spawnEnemy(type, boss.x + ox, boss.y + oy);
       }
       boss.cooldowns![ABILITIES.NECRO_HORDE] = time + 12000;
    }

    // 2. Plague Breath (Cone)
    if (!boss.cooldowns![ABILITIES.PLAGUE_BREATH] || boss.cooldowns![ABILITIES.PLAGUE_BREATH] <= time) {
       // Calculate angle to player
       const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
       // Spawn projectiles in a fan
       for(let i=-2; i<=2; i++) {
          const fanAngle = angle + (i * 0.2);
          spawnProjectile({
            x: boss.x, y: boss.y,
            vx: Math.cos(fanAngle) * 5, vy: Math.sin(fanAngle) * 5,
            damage: 40, life: 2000,
            type: WeaponType.SHADOW_SWARM, // Reusing swarm art for plague cloud
            size: 30, level: 5
          });
       }
       boss.cooldowns![ABILITIES.PLAGUE_BREATH] = time + 10000;
    }

    // 3. Earthshatter Slam (AoE Stun)
    if (!boss.cooldowns![ABILITIES.EARTHSHATTER] || boss.cooldowns![ABILITIES.EARTHSHATTER] <= time) {
       if (distToPlayer < 600) {
          spawnProjectile({
             x: boss.x, y: boss.y, vx: 0, vy: 0,
             damage: 40, // Nerfed from 200 to prevent one-shot
             life: 500,
             type: WeaponType.HORROR_WAVE, // Shockwave art
             size: 600, level: 5,
             onHit: (e: any) => { e.isStunned = true; e.stunTimer = 2000; }
          });
          boss.cooldowns![ABILITIES.EARTHSHATTER] = time + 14000;
       }
    }
  }
};
