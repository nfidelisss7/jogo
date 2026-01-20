
import { Entity, WeaponType } from '../../types';
import { HealerAI } from './HealerAI';
import { ANGEL_STATS } from './Angel.types';

export class AngelLogic {
  static update(
    enemy: Entity,
    player: Entity,
    time: number,
    delta: number,
    spawnProjectile: (data: any) => void,
    nearbyEnemies: Entity[]
  ) {
    if (!enemy.aiValues) enemy.aiValues = { seed: Math.random(), attackCooldown: 0 };

    // 1. Movement: Evasive Kite
    const evade = HealerAI.getEvasiveVelocity(enemy, player, delta);
    if (evade.x !== 0 || evade.y !== 0) {
        enemy.x += evade.x;
        enemy.y += evade.y;
    } else {
        // Idle drift
        const t = time * 0.001 + enemy.aiValues.seed;
        enemy.x += Math.cos(t) * enemy.speed! * delta * 0.5;
        enemy.y += Math.sin(t) * enemy.speed! * delta * 0.5;
    }

    // 2. Ability: Heavenly Ward (Single Target Shield/Heal)
    if (time > (enemy.aiValues.attackCooldown || 0)) {
        const target = HealerAI.findTriageTarget(enemy, nearbyEnemies, ANGEL_STATS.HEAL_RANGE);
        
        if (target) {
            // Apply Heal
            target.hp = Math.min(target.maxHp!, target.hp! + ANGEL_STATS.HEAL_AMOUNT);
            
            // Visual Beam
            spawnProjectile({
                x: enemy.x, y: enemy.y,
                vx: (target.x - enemy.x) * 0.01,
                vy: (target.y - enemy.y) * 0.01, // Fast visual travel
                damage: 0,
                life: 300,
                type: WeaponType.VOID_TETHER, // Reusing tether art for beam
                size: 5,
                isEnemyProjectile: false // Visual only
            });

            // Grant Shield if King
            if (target.isKing) {
                target.shieldHp = (target.shieldHp || 0) + 25;
            }

            enemy.aiValues.attackCooldown = time + ANGEL_STATS.WARD_COOLDOWN;
        }
    }
  }
}
