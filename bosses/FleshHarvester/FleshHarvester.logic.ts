
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType } from '../../types';
import { HARVESTER_STATS, ABILITIES } from './FleshHarvester.types';

export const FleshHarvesterLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy) {
    const distToPlayer = Math.sqrt(Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2));

    // --- PHASE MANAGEMENT ---
    const hpPct = (boss.hp || 1) / (boss.maxHp || 1);
    if (hpPct < 0.5 && boss.phase === 1) {
      boss.phase = 2;
      boss.size *= 1.3; // Grow larger
      // Enrage visual
      spawnProjectile({
          x: boss.x, y: boss.y, vx: 0, vy: 0, damage: 0, life: 1000, 
          type: WeaponType.SHADOW_EXPLOSION, size: 200, level: 5
      });
    }

    // --- MOVEMENT ---
    // Slow, relentless advance
    const speed = HARVESTER_STATS.SPEED * delta * (boss.phase === 2 ? 1.5 : 1.0);
    if (distToPlayer > 100) {
      boss.x += ((player.x - boss.x) / distToPlayer) * speed;
      boss.y += ((player.y - boss.y) / distToPlayer) * speed;
    }

    // --- ABILITIES ---

    // 1. Scythe Reap (Wide Arc Slash)
    if (!boss.cooldowns![ABILITIES.SCYTHE_REAP] || boss.cooldowns![ABILITIES.SCYTHE_REAP] <= time) {
        if (distToPlayer < 400) {
            const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            // Spawn a massive "Night Blade" style projectile that sweeps
            spawnProjectile({
                x: boss.x, y: boss.y,
                vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2,
                damage: 80, life: 500,
                type: WeaponType.NIGHT_BLADE, // Reusing art for slash
                size: 150, level: 5,
                pierce: 999
            });
            boss.cooldowns![ABILITIES.SCYTHE_REAP] = time + (boss.phase === 2 ? 3000 : 5000);
        }
    }

    // 2. Meat Tendrils (Ground Spikes)
    if (!boss.cooldowns![ABILITIES.MEAT_TENDRILS] || boss.cooldowns![ABILITIES.MEAT_TENDRILS] <= time) {
        const lines = boss.phase === 2 ? 5 : 3;
        for(let i=0; i<lines; i++) {
            const angle = Math.random() * Math.PI * 2;
            // Spawn a line of spikes
            for(let j=1; j<=5; j++) {
                spawnProjectile({
                    x: boss.x + Math.cos(angle) * (j * 80),
                    y: boss.y + Math.sin(angle) * (j * 80),
                    vx: 0, vy: 0,
                    damage: 40, life: 2000,
                    type: WeaponType.INKROOT_BIND, // Reusing root art
                    size: 40, level: 5,
                    onHit: (e: any) => { e.hp -= 10; e.speed *= 0.5; } // Slow logic for player would be different, here assumes enemy target but player takes damage via GameEngine proj check
                });
            }
        }
        boss.cooldowns![ABILITIES.MEAT_TENDRILS] = time + 8000;
    }

    // 3. Harvest Pull (Chains)
    if (!boss.cooldowns![ABILITIES.HARVEST_PULL] || boss.cooldowns![ABILITIES.HARVEST_PULL] <= time) {
        spawnProjectile({
            x: boss.x, y: boss.y, vx: 0, vy: 0,
            damage: 20, life: 1000,
            type: WeaponType.ABYSS_PULL,
            size: 500, level: 5,
            onHit: (e: any) => { /* Physics handled by Engine/Projectile logic */ } 
        });
        // Pull Player Manually
        if (distToPlayer < 500) {
            player.x += ((boss.x - player.x) / distToPlayer) * 10;
            player.y += ((boss.y - player.y) / distToPlayer) * 10;
        }
        boss.cooldowns![ABILITIES.HARVEST_PULL] = time + 15000;
    }
  }
};
