
import { Entity, WeaponType } from '../../types';
import { HealerAI } from './HealerAI';
import { SANCTIFIED_HERALD_STATS } from './SanctifiedHerald.types';

export class SanctifiedHeraldLogic {
  static update(
    enemy: Entity,
    player: Entity,
    time: number,
    delta: number,
    spawnProjectile: (data: any) => void,
    nearbyEnemies: Entity[]
  ) {
    if (!enemy.aiValues) enemy.aiValues = { seed: Math.random(), attackCooldown: 0 };
    
    // 1. Movement: Slow, stays behind but follows group
    // Basic "Stay near nearest ally" or drift towards player slowly
    const distToPlayer = Math.sqrt((player.x - enemy.x)**2 + (player.y - enemy.y)**2);
    if (distToPlayer > 400) {
        const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(ang) * enemy.speed! * delta;
        enemy.y += Math.sin(ang) * enemy.speed! * delta;
    } else if (distToPlayer < 200) {
        // Back up slightly
        const ang = Math.atan2(enemy.y - player.y, enemy.x - player.x);
        enemy.x += Math.cos(ang) * enemy.speed! * delta * 0.5;
        enemy.y += Math.sin(ang) * enemy.speed! * delta * 0.5;
    }

    // 2. Ability: Holy Nova (AOE Heal)
    if (time > (enemy.aiValues.attackCooldown || 0)) {
        // Check if valuable targets are nearby
        const target = HealerAI.findTriageTarget(enemy, nearbyEnemies, SANCTIFIED_HERALD_STATS.HEAL_RANGE);
        
        if (target) {
            enemy.state = 'attack';
            
            // Spawn AOE Visual/Logic
            spawnProjectile({
                x: enemy.x, y: enemy.y,
                vx: 0, vy: 0,
                damage: 0, // Negative damage handled via special type or onHit logic? 
                // We use a "Heal Pulse" projectile type. Since we don't have one, we use 'SURVIVOR_BOON' visual logic usually
                // But here we need it to hit ENEMIES.
                // We'll spawn a "Blast" that we manually check collision for, or reuse an enemy projectile that heals
                type: WeaponType.SHADOW_EXPLOSION, // Visual base
                size: SANCTIFIED_HERALD_STATS.HEAL_RANGE,
                life: 500,
                isEnemyProjectile: true,
                isExplosion: true,
                // Custom logic for healing attached to the projectile system is limited without modifying GameEngine significantly.
                // Instead, we apply heal instantly here and just spawn visual.
            });

            // Apply Immediate Heal to area
            nearbyEnemies.forEach(e => {
                const d = (e.x - enemy.x)**2 + (e.y - enemy.y)**2;
                if (d < SANCTIFIED_HERALD_STATS.HEAL_RANGE**2 && e.hp! < e.maxHp!) {
                    e.hp = Math.min(e.maxHp!, e.hp! + SANCTIFIED_HERALD_STATS.HEAL_AMOUNT);
                    // Shield logic: Grant temp barrier
                    if (e.isKing || e.type === 'boss') {
                        e.shieldHp = (e.shieldHp || 0) + 50;
                    }
                }
            });

            enemy.aiValues.attackCooldown = time + SANCTIFIED_HERALD_STATS.COOLDOWN_HEAL;
        }
    }
  }
}
