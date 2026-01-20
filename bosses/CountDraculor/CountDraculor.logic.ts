
import { BossLogicHandler, BossType, EnemyArchetype, WeaponType } from '../../types';
import { DRACULOR_STATS, ABILITIES } from './CountDraculor.types';

export const CountDraculorLogic: BossLogicHandler = {
  update(boss, player, time, delta, spawnProjectile, spawnEnemy) {
    const distToPlayer = Math.sqrt(Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2));
    
    // --- PHASE MANAGEMENT ---
    const hpPct = (boss.hp || 1) / (boss.maxHp || 1);
    
    // Phase 1: 100% - 75% (Standard Aggression)
    // Phase 2: 75% - 40% (Bat Inferno + Teleports)
    // Phase 3: 40% - 0% (Vampiric Frenzy + Blood Rain)
    
    let newPhase = 1;
    if (hpPct < 0.4) newPhase = 3;
    else if (hpPct < 0.75) newPhase = 2;

    if (boss.phase !== newPhase) {
        boss.phase = newPhase;
        // Phase Transition Explosion
        spawnProjectile({
            x: boss.x, y: boss.y, vx: 0, vy: 0, damage: 20, life: 1000, 
            type: WeaponType.SHADOW_EXPLOSION, size: 250, level: 5, isExplosion: true
        });
        boss.state = 'immune'; // Brief respite
        boss.stateTimer = 2000;
    }

    if (boss.state === 'immune') {
        boss.stateTimer! -= delta;
        if (boss.stateTimer! <= 0) boss.state = 'pursue';
        return;
    }

    // --- SMART MOVEMENT ---
    const baseSpeed = boss.phase === 3 ? DRACULOR_STATS.SPEED_PHASE : DRACULOR_STATS.SPEED_BASE;
    let finalSpeed = baseSpeed;

    if (boss.phase === 3) {
        // Frenzy: Just rush
        const dx = player.x - boss.x;
        const dy = player.y - boss.y;
        boss.x += (dx/distToPlayer) * finalSpeed * delta * 1.5;
        boss.y += (dy/distToPlayer) * finalSpeed * delta * 1.5;
    } else {
        // Tactical Movement: Cut off
        let targetX = player.x;
        let targetY = player.y;
        
        // Predict player movement
        if (player.velocity) {
            targetX += player.velocity.x * 20; // Look ahead 20 frames
            targetY += player.velocity.y * 20;
        }

        const dx = targetX - boss.x;
        const dy = targetY - boss.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        
        if (d > 10) {
            boss.x += (dx/d) * finalSpeed * delta;
            boss.y += (dy/d) * finalSpeed * delta;
        }
    }

    // --- ABILITIES (Context Aware) ---

    // 1. Bat Inferno (Summons) - Triggers when player is far or phase 2 start
    if (!boss.cooldowns![ABILITIES.BAT_INFERNO] || boss.cooldowns![ABILITIES.BAT_INFERNO] <= time) {
      if (distToPlayer > 300 || boss.phase === 2) {
          for(let i=0; i<5; i++) {
            const angle = (i/5)*Math.PI*2;
            spawnEnemy(EnemyArchetype.BAT_SWARM, boss.x + Math.cos(angle)*50, boss.y + Math.sin(angle)*50);
          }
          boss.cooldowns![ABILITIES.BAT_INFERNO] = time + (boss.phase === 3 ? 5000 : 8000);
      }
    }

    // 2. Vampiric Grasp (Root) - Triggers if close to punish melee
    if (!boss.cooldowns![ABILITIES.VAMPIRIC_GRASP] || boss.cooldowns![ABILITIES.VAMPIRIC_GRASP] <= time) {
      if (distToPlayer < 250) {
        spawnProjectile({
          x: boss.x, y: boss.y, 
          vx: (player.x - boss.x)*0.01, vy: (player.y - boss.y)*0.01,
          damage: 10, life: 1000, type: WeaponType.VOID_TETHER, size: 10, level: 5,
          onHit: (e: any) => { e.isStunned = true; e.stunTimer = 1000; }
        });
        boss.cooldowns![ABILITIES.VAMPIRIC_GRASP] = time + 6000;
      }
    }

    // 3. Blood Rain (Zoning) - Phase 2 & 3
    if (boss.phase >= 2) {
        if (!boss.cooldowns![ABILITIES.BLOOD_RAIN] || boss.cooldowns![ABILITIES.BLOOD_RAIN] <= time) {
            // Predict current path
            const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            for(let i=1; i<=3; i++) {
                const dist = i * 150;
                spawnProjectile({
                    x: boss.x + Math.cos(angle) * dist,
                    y: boss.y + Math.sin(angle) * dist,
                    vx: 0, vy: 0, damage: 30, life: 3000,
                    type: WeaponType.VAMPIRIC_AURA, size: 100, level: 5
                });
            }
            boss.cooldowns![ABILITIES.BLOOD_RAIN] = time + 5000;
        }
    }
  }
};
