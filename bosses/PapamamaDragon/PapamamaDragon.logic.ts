
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType, Entity } from '../../types';
import { PAPAMAMA_STATS, ABILITIES } from './PapamamaDragon.types';

export const PapamamaDragonLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy, nearbyEnemies) {
    const distToPlayer = Math.sqrt(Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2));

    // --- PHASE MANAGEMENT ---
    const hpPct = (boss.hp || 1) / (boss.maxHp || 1);
    if (hpPct < 0.5 && boss.phase === 1) {
        boss.phase = 2;
        // Enrage: Grow
        boss.size *= 1.2;
        // Roar
        spawnProjectile({
            x: boss.x, y: boss.y, vx: 0, vy: 0, damage: 20, life: 1000, 
            type: WeaponType.HORROR_WAVE, size: 400, level: 5, isExplosion: true
        });
        boss.invulnTimer = 1000;
    }

    // --- MOVEMENT ---
    // Aggressive Chase
    const speed = PAPAMAMA_STATS.SPEED * delta * (boss.phase === 2 ? 1.3 : 1.0);
    if (distToPlayer > 150) {
      boss.x += ((player.x - boss.x) / distToPlayer) * speed;
      boss.y += ((player.y - boss.y) / distToPlayer) * speed;
    }

    // --- ABILITIES ---

    // 1. Dual Breath (Continuous Stream)
    // Black Head (Void) & Red Head (Fire) fire alternately or together
    if (!boss.cooldowns![ABILITIES.DUAL_BREATH] || boss.cooldowns![ABILITIES.DUAL_BREATH] <= time) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
        
        // Red Head (Explosive Fire) - Left offset
        spawnProjectile({
            x: boss.x + Math.cos(angle - 0.5) * 40, 
            y: boss.y + Math.sin(angle - 0.5) * 40,
            vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
            damage: 60, life: 1500,
            type: WeaponType.SHADOW_EXPLOSION, // Reusing explosion for fireball
            size: 30, level: 5
        });

        // Black Head (Piercing Void) - Right offset
        spawnProjectile({
            x: boss.x + Math.cos(angle + 0.5) * 40,
            y: boss.y + Math.sin(angle + 0.5) * 40,
            vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10,
            damage: 50, life: 1500,
            type: WeaponType.DARK_PROJECTILE,
            size: 25, level: 5, pierce: 99
        });

        // Rapid fire in phase 2
        boss.cooldowns![ABILITIES.DUAL_BREATH] = time + (boss.phase === 2 ? 800 : 1500);
    }

    // 2. Magma Eruption (Zone Control)
    if (!boss.cooldowns![ABILITIES.MAGMA_ERUPTION] || boss.cooldowns![ABILITIES.MAGMA_ERUPTION] <= time) {
        const count = boss.phase === 2 ? 8 : 5;
        for(let i=0; i<count; i++) {
            const rx = boss.x + (Math.random()-0.5) * 600;
            const ry = boss.y + (Math.random()-0.5) * 600;
            
            spawnProjectile({
                x: rx, y: ry, vx: 0, vy: 0,
                damage: 30, life: 5000,
                type: WeaponType.RAZOR_MEADOW, // Reusing ground zone art
                size: 60, level: 5,
                onHit: (e: Entity) => { if(e.type === 'player') e.hp! -= 5; } // Damage player logic needs engine support or careful target check
            });
        }
        boss.cooldowns![ABILITIES.MAGMA_ERUPTION] = time + 10000;
    }

    // 3. Tail Swipe (Knockback)
    if (distToPlayer < 200 && (!boss.cooldowns![ABILITIES.TAIL_SWIPE] || boss.cooldowns![ABILITIES.TAIL_SWIPE] <= time)) {
        spawnProjectile({
            x: boss.x, y: boss.y, vx: 0, vy: 0,
            damage: 80, life: 300,
            type: WeaponType.HORROR_WAVE, size: 250, level: 5
        });
        
        // Push player
        const dx = player.x - boss.x;
        const dy = player.y - boss.y;
        player.x += (dx/distToPlayer) * 150;
        player.y += (dy/distToPlayer) * 150;

        boss.cooldowns![ABILITIES.TAIL_SWIPE] = time + 6000;
    }
  }
};
