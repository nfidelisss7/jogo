
import { SummonBase } from './SummonBase';
import { Entity, MinionType, WeaponType } from '../../types';
import { SummonAI } from './SummonAI';

// 🟣 1. UMBRA FAMILIAR (Shadow Clone)
export class UmbraSummon extends SummonBase {
  private history: {x: number, y: number}[] = [];
  private historyMax = 30;

  init() {
    this.entity.speed = 0; // Manual control
  }

  update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: any) {
    // 1. Record Player History
    if (this.distanceTo(player) > 5) {
      this.history.push({x: player.x, y: player.y});
      if (this.history.length > this.historyMax) this.history.shift();
    }

    // 2. Movement (Lag behind)
    const delayIndex = Math.max(0, this.history.length - (10 + (5 - this.level))); // Higher level = closer follow
    const targetPos = this.history[delayIndex] || player;
    
    this.entity.x = SummonAI.interpolatePosition(this.entity.x, targetPos.x, 0.2, delta);
    this.entity.y = SummonAI.interpolatePosition(this.entity.y, targetPos.y, 0.2, delta);

    // 3. Attack (Contact Slash)
    this.attackCooldownTimer -= delta;
    if (this.attackCooldownTimer <= 0) {
      const target = this.getNearestEnemy(enemies, 60); // Melee range
      if (target) {
        this.performSlash(target, spawnProjectile);
        this.attackCooldownTimer = 400; // Fast slashes
      }
    }

    // 4. Special: Shadow Dash (Teleport Strike)
    this.specialCooldownTimer -= delta;
    if (this.level >= 3 && this.specialCooldownTimer <= 0) {
      const farTarget = this.getNearestEnemy(enemies, 300);
      if (farTarget && this.distanceTo(farTarget) > 100) {
        this.performShadowDash(farTarget, spawnProjectile);
        this.specialCooldownTimer = 3000;
      }
    }

    // Animation
    this.animScaleX = 1 + Math.sin(time * 0.01) * 0.1; // Flicker
    this.animAlpha = 0.7;
  }

  private performSlash(target: Entity, spawnProjectile: any) {
    target.hp! -= this.stats.damage;
    // Visual Slash
    spawnProjectile({
      x: this.entity.x, y: this.entity.y,
      vx: 0, vy: 0, life: 150, damage: 0,
      type: WeaponType.NIGHT_BLADE, // Reusing blade art
      size: 40, level: this.level
    });
  }

  private performShadowDash(target: Entity, spawnProjectile: any) {
    // Teleport
    this.entity.x = target.x;
    this.entity.y = target.y;
    // Explosion
    spawnProjectile({
      x: this.entity.x, y: this.entity.y,
      vx: 0, vy: 0, life: 300, damage: this.stats.damage * 2,
      type: WeaponType.SHADOW_EXPLOSION,
      size: 60, level: this.level, isExplosion: true
    });
    // Reset history to snap trail
    this.history = [{x: this.entity.x, y: this.entity.y}];
  }
}

// 🔴 2. VAMPIRE SWARM (Bats)
export class BatSummon extends SummonBase {
  private orbitAngle: number = Math.random() * Math.PI * 2;
  private isMega: boolean = false;

  init() {
    this.isMega = this.level >= 5 && Math.random() > 0.8; 
  }

  update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: any) {
    const orbitRadius = this.isMega ? 150 : 80;
    const orbitSpeed = this.isMega ? 0.001 : 0.003;
    
    // 1. Target Determination (For movement steering)
    let target = { 
      x: player.x + Math.cos(this.orbitAngle) * orbitRadius, 
      y: player.y + Math.sin(this.orbitAngle) * orbitRadius 
    };

    const nearestEnemy = this.getNearestEnemy(enemies, 300);
    if (nearestEnemy) {
      target = { x: nearestEnemy.x, y: nearestEnemy.y };
    }

    // 2. Movement
    this.orbitAngle += orbitSpeed * delta;
    const dx = target.x - this.entity.x;
    const dy = target.y - this.entity.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const speed = (this.isMega ? 0.18 : 0.28) * delta;

    if (dist > 10) {
      this.entity.x += (dx / dist) * speed;
      this.entity.y += (dy / dist) * speed;
    }

    // 3. Attack (Collision Check against ALL enemies, not just target)
    for (const enemy of enemies) {
        if (!enemy.active) continue;
        const dSq = (this.entity.x - enemy.x)**2 + (this.entity.y - enemy.y)**2;
        const hitRadius = (this.entity.size + enemy.size);
        
        if (dSq < hitRadius * hitRadius) {
            enemy.hp! -= this.stats.damage * (delta / 32); 

            if (this.level >= 4 && Math.random() < 0.005) { 
                player.hp = Math.min(player.maxHp!, player.hp! + 1);
            }

            if (this.isMega) {
                this.specialCooldownTimer -= delta;
                if (this.specialCooldownTimer <= 0) {
                    spawnProjectile({
                        x: this.entity.x, y: this.entity.y,
                        vx: 0, vy: 0, life: 300, damage: this.stats.damage * 4,
                        type: WeaponType.SHADOW_EXPLOSION, size: 100, level: 5, isExplosion: true
                    });
                    this.specialCooldownTimer = 2000;
                }
            }
        }
    }

    this.animScaleX = 1 + Math.sin(time * 0.02) * 0.3; // Flapping
    this.entity.velocity = {x: dx, y: dy}; // For rotation
  }
}

// 🟤 3. AETHER GOLEM (Defensive)
export class GolemSummon extends SummonBase {
  init() {
    this.entity.hp = 2000;
    this.attackCooldownTimer = 1000; 
  }

  update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: any) {
    const isTitan = this.level >= 5;
    const targetSize = isTitan ? 60 : (25 + (this.level * 3));
    
    if (this.entity.size < targetSize) this.entity.size += 0.5;
    if (isTitan) {
        this.entity.maxHp = 10000;
        this.entity.hp = 10000;
    }

    const nearest = this.getNearestEnemy(enemies, 400);
    
    // 1. Movement: Shield Interpose
    let targetX = player.x;
    let targetY = player.y;

    if (nearest) {
      const shieldDist = isTitan ? 90 : 60;
      const shieldPos = SummonAI.getInterposePosition(player, nearest, shieldDist);
      targetX = shieldPos.x;
      targetY = shieldPos.y;
    } else {
      targetX = player.x + Math.cos(time * 0.0005) * (isTitan ? 90 : 60);
      targetY = player.y + Math.sin(time * 0.0005) * (isTitan ? 90 : 60);
    }

    this.entity.x = SummonAI.interpolatePosition(this.entity.x, targetX, 0.1, delta);
    this.entity.y = SummonAI.interpolatePosition(this.entity.y, targetY, 0.1, delta);

    // 2. Collision / Blocking logic (Shield Bash)
    if (nearest && this.distanceTo(nearest) < this.entity.size + nearest.size + 10) {
      const pushAng = this.angleTo(nearest);
      const pushForce = isTitan ? 10 : 5;
      nearest.x += Math.cos(pushAng) * pushForce;
      nearest.y += Math.sin(pushAng) * pushForce;
      nearest.hp! -= this.stats.damage * (delta / 100); 
    }

    // 3. Attack: Dual Stun Rock
    if (this.attackCooldownTimer > 0) this.attackCooldownTimer -= delta;

    if (this.attackCooldownTimer <= 0) {
        const attackTarget = nearest || this.getNearestEnemy(enemies, 600);
        
        if (attackTarget) {
            const angle = this.angleTo(attackTarget);
            const projectileCount = isTitan ? 3 : 2;
            const spread = isTitan ? 0.5 : 0.3;
            
            for(let i=0; i<projectileCount; i++) {
                const offset = -spread + (i * spread);
                spawnProjectile({
                    x: this.entity.x, y: this.entity.y,
                    vx: Math.cos(angle + offset) * 0.4, vy: Math.sin(angle + offset) * 0.4,
                    damage: isTitan ? this.stats.damage * 2 : this.stats.damage, 
                    life: 1000,
                    type: WeaponType.AETHER_GOLEM, 
                    size: isTitan ? 25 : 15, 
                    level: this.level,
                    onHit: (e: Entity) => { e.isStunned = true; e.stunTimer = 1000; }
                });
            }
            const baseCooldown = this.stats.cooldown || 3000;
            const adjustedCooldown = Math.max(800, baseCooldown - (this.level * 400));
            this.attackCooldownTimer = adjustedCooldown;
            this.animScaleY = 1.2; // Attack recoil
        } else {
            this.attackCooldownTimer = 200;
        }
    }

    if (this.animScaleY > 1) this.animScaleY -= 0.01 * delta;
  }
}

// 🟢 4. ABYSSAL BOTANY (Plants)
export class PlantSummon extends SummonBase {
  init() {
    this.state = 'idle';
  }

  update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: any) {
    const dist = this.distanceTo(player);
    if (dist > 400) {
      if (Math.random() < 0.01) {
        const angle = Math.random() * Math.PI * 2;
        this.entity.x = player.x + Math.cos(angle) * 150;
        this.entity.y = player.y + Math.sin(angle) * 150;
        spawnProjectile({
            x: this.entity.x, y: this.entity.y, vx:0, vy:0, life: 200, damage: 0,
            type: WeaponType.RAZOR_MEADOW, size: 20, level: 1 // Dust puff
        });
      }
    } else if (dist > 150) {
        const angle = this.angleTo(player);
        this.entity.x += Math.cos(angle) * 0.05 * delta;
        this.entity.y += Math.sin(angle) * 0.05 * delta;
    }

    this.attackCooldownTimer -= delta;
    if (this.attackCooldownTimer <= 0) {
      const target = this.getNearestEnemy(enemies, 350);
      if (target) {
        const angle = this.angleTo(target);
        spawnProjectile({
          x: this.entity.x, y: this.entity.y,
          vx: Math.cos(angle) * 0.3, vy: Math.sin(angle) * 0.3,
          damage: this.stats.damage, life: 1200,
          type: WeaponType.ABYSSAL_BOTANY, size: 8, level: this.level
        });
        this.attackCooldownTimer = 1500;
        this.animScaleX = 1.3;
      }
    }

    if (this.animScaleX > 1) this.animScaleX -= 0.01 * delta;
    this.animRotation = Math.sin(time * 0.002) * 0.1;
  }
}

// 📘 5. GRIMOIRE FURY (Floating Books)
export class GrimoireSummon extends SummonBase {
  private orbitSpeed: number = 0.0015;
  private orbitRadius: number = 80;

  init() {
    this.entity.orbitAngle = Math.random() * Math.PI * 2;
  }

  update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: any) {
    // 1. Orbit Logic
    this.entity.orbitAngle = (this.entity.orbitAngle || 0) + (this.orbitSpeed * delta);
    this.entity.x = player.x + Math.cos(this.entity.orbitAngle) * this.orbitRadius;
    this.entity.y = player.y + Math.sin(this.entity.orbitAngle) * this.orbitRadius;

    // 2. Attack Logic
    this.attackCooldownTimer -= delta;
    if (this.attackCooldownTimer <= 0) {
        const target = this.getNearestEnemy(enemies, this.stats.range || 400);
        if (target) {
            const angle = this.angleTo(target);
            // Fire Arcane Beam
            spawnProjectile({
                x: this.entity.x, y: this.entity.y,
                vx: Math.cos(angle) * 1.0, vy: Math.sin(angle) * 1.0,
                damage: this.stats.damage,
                life: 600,
                type: WeaponType.MISSILE, // Reuse missile art or simple beam
                size: 6 + this.level,
                pierce: (this.level >= 4) ? 2 : 0,
                level: this.level,
                onHit: (e: Entity) => {
                    if (this.level >= 3) {
                        e.hp! -= 5; // Bonus damage proc
                    }
                }
            });

            // Level 5: Arcane Pulse
            if (this.level >= 5) {
                this.specialCooldownTimer++;
                if (this.specialCooldownTimer >= 5) { // Every 5th shot
                    this.specialCooldownTimer = 0;
                    spawnProjectile({
                        x: this.entity.x, y: this.entity.y, vx: 0, vy: 0,
                        damage: this.stats.damage * 2,
                        life: 300, type: WeaponType.SHADOW_EXPLOSION, size: 80, pierce: 99,
                        level: 5, isExplosion: true
                    });
                }
            }

            this.attackCooldownTimer = this.stats.cooldown;
        }
    }
    
    // Bobbing animation
    this.entity.y += Math.sin(time * 0.005) * 0.5;
  }
}
