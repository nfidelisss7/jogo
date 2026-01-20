
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType, Entity } from '../../types';
import { FALLEN_ANGEL_STATS, ABILITIES } from './FallenAngel.types';

export const FallenAngelLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy, nearbyEnemies) {
    const distToPlayer = Math.sqrt(Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2));

    // --- PHASE MANAGEMENT ---
    const hpPct = (boss.hp || 1) / (boss.maxHp || 1);
    const expectedPhase = hpPct < 0.5 ? 2 : 1;
    
    if (boss.phase !== expectedPhase) {
      boss.phase = expectedPhase;
      // Phase Transition Effect: Corrupted Burst
      spawnProjectile({
        x: boss.x, y: boss.y, vx: 0, vy: 0, damage: 30, life: 1000, 
        type: WeaponType.SHADOW_EXPLOSION, size: 200, level: 5, isExplosion: true
      });
      boss.invulnTimer = 2000; // Brief immunity
    }

    // --- MOVEMENT ---
    // Slow, deliberate float towards player
    const speed = boss.phase === 2 ? FALLEN_ANGEL_STATS.SPEED_PHASE_2 : FALLEN_ANGEL_STATS.SPEED_BASE;
    if (distToPlayer > 150) {
      boss.x += ((player.x - boss.x) / distToPlayer) * speed * delta;
      boss.y += ((player.y - boss.y) / distToPlayer) * speed * delta;
    }

    // --- 1. PURIFYING NOVA (Heal Pulse) ---
    if (!boss.cooldowns![ABILITIES.PURIFYING_NOVA] || boss.cooldowns![ABILITIES.PURIFYING_NOVA] <= time) {
        // Visual
        spawnProjectile({
            x: boss.x, y: boss.y, vx: 0, vy: 0, damage: 0, life: 800,
            type: WeaponType.AURA, size: 300, level: 5 // White/Gold pulse visual
        });

        // Logic: Heal Nearby Enemies
        const healAmount = boss.phase === 2 ? 100 : 50;
        let healCount = 0;
        for (const enemy of nearbyEnemies) {
            const d = (enemy.x - boss.x)**2 + (enemy.y - boss.y)**2;
            if (d < 300 * 300 && enemy.id !== boss.id) {
                enemy.hp = Math.min(enemy.maxHp!, (enemy.hp || 0) + healAmount);
                healCount++;
            }
        }
        
        // Self-heal slightly if no minions
        if (healCount === 0 && boss.hp! < boss.maxHp!) {
            boss.hp! += healAmount * 0.5;
        }

        boss.cooldowns![ABILITIES.PURIFYING_NOVA] = time + (boss.phase === 2 ? 6000 : 8000);
    }

    // --- 2. RESURRECTION CHANT (Summon) ---
    if (!boss.cooldowns![ABILITIES.RESURRECTION] || boss.cooldowns![ABILITIES.RESURRECTION] <= time) {
        const count = boss.phase === 2 ? 4 : 2;
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 50;
            // Spawn Skeletons or Zombies as "Revived"
            spawnEnemy(EnemyArchetype.SKELETON, boss.x + Math.cos(angle)*dist, boss.y + Math.sin(angle)*dist);
        }
        boss.cooldowns![ABILITIES.RESURRECTION] = time + 12000;
    }

    // --- 3. WING SHIELD (Defense) ---
    // Toggled state logic
    if ((boss.state as string) === 'shielding') {
        boss.stateTimer! -= delta;
        if (boss.stateTimer! <= 0) {
            boss.state = 'pursue';
            boss.cooldowns![ABILITIES.WING_SHIELD] = time + 10000; // Cooldown starts after shield ends
        } else {
            // Regeneration while shielded?
            boss.hp = Math.min(boss.maxHp!, boss.hp! + (delta * 0.1));
        }
        return; // Don't move or attack while shielding
    }

    if ((boss.state as string) !== 'shielding' && (!boss.cooldowns![ABILITIES.WING_SHIELD] || boss.cooldowns![ABILITIES.WING_SHIELD] <= time)) {
        // Only shield if player is attacking/close? Random chance
        if (Math.random() > 0.5) {
            boss.state = 'shielding';
            boss.stateTimer = 4000; // Shield lasts 4s
        } else {
            boss.cooldowns![ABILITIES.WING_SHIELD] = time + 2000; // Retry soon
        }
    }

    // --- 4. SMITE BEAM ---
    if (!boss.cooldowns![ABILITIES.SMITE_BEAM] || boss.cooldowns![ABILITIES.SMITE_BEAM] <= time) {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
        
        // Telegraph Line (Visual only)
        // Actual Projectile
        spawnProjectile({
            x: boss.x, y: boss.y,
            vx: Math.cos(angle) * 12, vy: Math.sin(angle) * 12, // Very fast
            damage: 40, life: 2000,
            type: WeaponType.VOID_TETHER, // Use Tether art as beam
            size: 20, level: 5
        });

        boss.cooldowns![ABILITIES.SMITE_BEAM] = time + (boss.phase === 2 ? 2000 : 4000);
    }

    // --- 5. FALLEN METEOR (Phase 2) ---
    if (boss.phase === 2) {
        if (!boss.cooldowns![ABILITIES.FALLEN_METEOR] || boss.cooldowns![ABILITIES.FALLEN_METEOR] <= time) {
            // Target player + random spots
            for(let i=0; i<5; i++) {
                const tx = i === 0 ? player.x : player.x + (Math.random()-0.5)*400;
                const ty = i === 0 ? player.y : player.y + (Math.random()-0.5)*400;
                
                spawnProjectile({
                    x: tx, y: ty - 600, // Start high up
                    vx: 0, vy: 10, // Fall down
                    damage: 50, life: 1000,
                    type: WeaponType.DARK_PROJECTILE,
                    size: 30, level: 5,
                    onHit: (e: Entity) => {
                        // Explosion on land
                        spawnProjectile({
                            x: e.x, y: e.y, vx:0, vy:0, damage: 30, life: 500,
                            type: WeaponType.SHADOW_EXPLOSION, size: 60, isExplosion: true
                        });
                    }
                });
            }
            boss.cooldowns![ABILITIES.FALLEN_METEOR] = time + 5000;
        }
    }
  }
};
