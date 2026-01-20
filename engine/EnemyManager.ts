
import { Entity, EnemyArchetype, WeaponType } from '../types';
import { GAME_OPTIONS } from '../gameOptions';
import { AngelLogic } from './enemies/Angel.logic';
import { SanctifiedHeraldLogic } from './enemies/SanctifiedHerald.logic';
import { ANGEL_STATS } from './enemies/Angel.types';
import { SANCTIFIED_HERALD_STATS } from './enemies/SanctifiedHerald.types';
import { AIBrain } from '../ai/core/AIBrain'; 

export class EnemyManager {
  // ⚔️ REBALANCED BASE STATS
  private static ARCHETYPE_STATS: Record<EnemyArchetype, { hp: number, speed: number, size: number, damage: number }> = {
    // Early Game
    [EnemyArchetype.SKELETON]:      { hp: 100,  speed: 0.10, size: 14, damage: 10 },
    [EnemyArchetype.BAT_SWARM]:     { hp: 40,   speed: 0.22, size: 10, damage: 5 },
    [EnemyArchetype.VOID_IMP]:      { hp: 80,   speed: 0.15, size: 12, damage: 8 },
    [EnemyArchetype.WATER_SLIME]:   { hp: 150,  speed: 0.12, size: 15, damage: 12 },
    [EnemyArchetype.ZOMBIE]:        { hp: 350,  speed: 0.07, size: 16, damage: 20 },

    // Mid Game
    [EnemyArchetype.BLOOD_HOUND]:   { hp: 180,  speed: 0.24, size: 14, damage: 15 },
    [EnemyArchetype.NECRO_SPIDER]:  { hp: 250,  speed: 0.14, size: 18, damage: 18 },
    [EnemyArchetype.SHADOW_WRAITH]: { hp: 200,  speed: 0.12, size: 16, damage: 25 },
    [EnemyArchetype.DESERT_ZOMBIE]: { hp: 400,  speed: 0.09, size: 16, damage: 22 },
    [EnemyArchetype.COWBOY]:        { hp: 150,  speed: 0.16, size: 14, damage: 30 },

    // Late Game
    [EnemyArchetype.CRIMSON_GHOUL]: { hp: 800,  speed: 0.08, size: 24, damage: 40 },
    [EnemyArchetype.HORROR_STALKER]:{ hp: 600,  speed: 0.15, size: 15, damage: 35 },
    [EnemyArchetype.DEMON]:         { hp: 900,  speed: 0.19, size: 20, damage: 45 },
    [EnemyArchetype.KNIGHT]:        { hp: 1200, speed: 0.12, size: 18, damage: 50 },
    [EnemyArchetype.ROBO_FAIRY]:    { hp: 300,  speed: 0.28, size: 11, damage: 20 },

    // Special
    [EnemyArchetype.ANGEL]:             { hp: ANGEL_STATS.HP * 2, speed: ANGEL_STATS.SPEED, size: 14, damage: 10 },
    [EnemyArchetype.SANTA_CLAUS]:       { hp: 600, speed: 0.10, size: 18, damage: 40 },
    [EnemyArchetype.SANCTIFIED_HERALD]: { hp: SANCTIFIED_HERALD_STATS.HP * 2, speed: SANCTIFIED_HERALD_STATS.SPEED, size: SANCTIFIED_HERALD_STATS.SIZE, damage: 15 },
    
    // 🐉 NEW: Baby Dragon
    [EnemyArchetype.BABY_DRAGON]:       { hp: 500, speed: 0.30, size: 16, damage: 25 }
  };

  public static getScaledEnemyHP(baseHp: number, totalTimeMs: number, playerLevel: number): number {
    const minutes = totalTimeMs / 60000;
    const timeMult = 1 + (Math.pow(minutes, 2.2) * 0.1);
    const levelBuff = playerLevel * 8; 
    return Math.floor((baseHp * timeMult) + levelBuff);
  }

  public static getScaledDamage(baseDmg: number, totalTimeMs: number): number {
    const minutes = totalTimeMs / 60000;
    const mult = 1 + (Math.pow(minutes, 1.5) * 0.05);
    return Math.floor(baseDmg * mult);
  }

  static spawn(playerX: number, playerY: number, totalTimeMs: number, playerLevel: number): Partial<Entity> {
    const seconds = totalTimeMs / 1000;
    
    // 1. Position Logic
    let spawnX = 0, spawnY = 0, validPos = false, attempts = 0;
    while (!validPos && attempts < 5) {
      const angle = Math.random() * Math.PI * 2;
      const dist = GAME_OPTIONS.SAFE_SPAWN_RADIUS + Math.random() * (GAME_OPTIONS.ENEMY_SPAWN_DIST - GAME_OPTIONS.SAFE_SPAWN_RADIUS);
      spawnX = playerX + Math.cos(angle) * dist;
      spawnY = playerY + Math.sin(angle) * dist;
      validPos = true;
      attempts++;
    }

    // 2. Dynamic Pool
    const archetypes = Object.values(EnemyArchetype);
    let pool: EnemyArchetype[] = [];
    
    if (seconds < 60) pool = [EnemyArchetype.SKELETON, EnemyArchetype.BAT_SWARM, EnemyArchetype.VOID_IMP];
    else if (seconds < 180) pool = [EnemyArchetype.SKELETON, EnemyArchetype.BLOOD_HOUND, EnemyArchetype.WATER_SLIME, EnemyArchetype.ZOMBIE];
    else if (seconds < 360) pool = [EnemyArchetype.BLOOD_HOUND, EnemyArchetype.SHADOW_WRAITH, EnemyArchetype.NECRO_SPIDER, EnemyArchetype.DESERT_ZOMBIE, EnemyArchetype.COWBOY, EnemyArchetype.BABY_DRAGON];
    else if (seconds < 600) pool = [EnemyArchetype.CRIMSON_GHOUL, EnemyArchetype.HORROR_STALKER, EnemyArchetype.DEMON, EnemyArchetype.ANGEL, EnemyArchetype.ROBO_FAIRY, EnemyArchetype.BABY_DRAGON];
    else pool = [EnemyArchetype.KNIGHT, EnemyArchetype.CRIMSON_GHOUL, EnemyArchetype.DEMON, EnemyArchetype.ROBO_FAIRY, EnemyArchetype.SANCTIFIED_HERALD, EnemyArchetype.BABY_DRAGON];

    const archetype = pool[Math.floor(Math.random() * pool.length)];
    const stats = this.ARCHETYPE_STATS[archetype];
    const isKing = seconds > GAME_OPTIONS.KING_SPAWN_TIME && Math.random() > 0.96; 
    
    let scaledHp = this.getScaledEnemyHP(stats.hp, totalTimeMs, playerLevel);
    let scaledDmg = this.getScaledDamage(stats.damage, totalTimeMs);
    const speedRamp = Math.min(2.0, 1 + (seconds / 1200)); 
    let finalSpeed = stats.speed * speedRamp;

    if (isKing) {
        scaledHp *= GAME_OPTIONS.KING_HP_MULTIPLIER;
        scaledDmg *= 1.5;
        finalSpeed *= 1.1; 
    }

    const entity: Partial<Entity> = {
      id: Math.random().toString(36).substr(2, 9),
      x: spawnX,
      y: spawnY,
      size: isKing ? stats.size * 1.8 : stats.size,
      active: true,
      type: 'enemy',
      archetype,
      artKey: archetype,
      hp: scaledHp,
      maxHp: scaledHp,
      speed: finalSpeed,
      isKing,
      kingTimer: 0,
      reviveChance: archetype === EnemyArchetype.ZOMBIE ? (isKing ? 0.5 : 0.2) : 0,
      shieldHp: isKing ? scaledHp * 0.5 : 0,
      maxShieldHp: isKing ? scaledHp * 0.5 : 0,
      state: 'pursue',
      stateTimer: 0,
      velocity: { x: 0, y: 0 },
      customData: { collisionDamage: scaledDmg },
      aiValues: { seed: Math.random(), attackCooldown: 0, kiteDir: Math.random() > 0.5 ? 1 : -1 }
    };

    return entity;
  }

  static updateEnemy(
    e: Entity,
    player: Entity,
    time: number,
    delta: number,
    spawnProjectile: (data: any) => void,
    nearbyEnemies: Entity[]
  ) {
      if (!e.active || !e.aiValues) return;

      // Special Logic Override (Healers)
      if (e.archetype === EnemyArchetype.ANGEL) {
          AngelLogic.update(e, player, time, delta, spawnProjectile, nearbyEnemies);
          return;
      }
      if (e.archetype === EnemyArchetype.SANCTIFIED_HERALD) {
          SanctifiedHeraldLogic.update(e, player, time, delta, spawnProjectile, nearbyEnemies);
          return;
      }

      // Ranged Attack Logic (Still manual for simple projectiles)
      // Note: Ideally move this to a RangedAI Strategy in the future
      if (e.archetype === EnemyArchetype.COWBOY || e.archetype === EnemyArchetype.SANTA_CLAUS || e.archetype === EnemyArchetype.NECRO_SPIDER) {
          const dist = Math.sqrt((player.x - e.x)**2 + (player.y - e.y)**2);
          const range = 450;
          const fireRate = 2500;

          if (dist < range && time > (e.aiValues.attackCooldown || 0)) {
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              const dmg = (e.customData?.collisionDamage || 10) * 1.5;
              
              let projType = WeaponType.MISSILE;
              if (e.archetype === EnemyArchetype.SANTA_CLAUS) projType = WeaponType.SHADOW_EXPLOSION;
              if (e.archetype === EnemyArchetype.NECRO_SPIDER) projType = WeaponType.INKROOT_BIND;

              spawnProjectile({
                  x: e.x, y: e.y,
                  vx: Math.cos(angle) * 0.5, vy: Math.sin(angle) * 0.5,
                  damage: dmg, life: 2000,
                  type: projType, size: 10, isEnemyProjectile: true
              });
              e.aiValues.attackCooldown = time + fireRate;
          }
      }
  }

  static updateKing(
    king: Entity, 
    player: Entity, 
    time: number, 
    delta: number, 
    spawnProjectile: (data: any) => void,
    spawnEnemy: (type: EnemyArchetype, x: number, y: number) => void
  ) {
    if (!king.isKing) return;
    king.kingTimer = (king.kingTimer || 0) + delta;
    const dmg = (king.customData?.collisionDamage || 20);

    // Elite Ability
    if (king.kingTimer > 4000) {
        king.kingTimer = 0;
        if (Math.random() > 0.5) {
            // Dash (Handled by velocity override on AI)
            king.velocity = {
                x: (player.x - king.x) * 0.05,
                y: (player.y - king.y) * 0.05
            };
        } else {
            // Nova
            for(let i=0; i<6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                spawnProjectile({
                    x: king.x, y: king.y,
                    vx: Math.cos(angle) * 0.3, vy: Math.sin(angle) * 0.3,
                    damage: dmg, life: 1500,
                    type: WeaponType.DARK_PROJECTILE, size: 8, isEnemyProjectile: true
                });
            }
        }
    }
  }
}
