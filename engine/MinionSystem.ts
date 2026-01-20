
import { Entity, MinionType, WeaponType } from '../types';
import { ObjectPool } from './ObjectPool';

export class MinionSystem {
  static update(
    minions: Entity[], 
    player: Entity, 
    enemies: Entity[], 
    delta: number, 
    time: number,
    spawnProjectile: (data: any) => void
  ) {
    for (const minion of minions) {
      if (!minion.active || minion.type !== 'minion') continue;

      switch (minion.minionType) {
          case MinionType.AETHER_GOLEM:
              this.updateGolem(minion, player, enemies, delta, time, spawnProjectile);
              break;
          case MinionType.VOID_BLOOM:
              this.updatePlant(minion, player, enemies, delta, time, spawnProjectile);
              break;
          case MinionType.UMBRA_CLONE:
              this.updateUmbra(minion, player, enemies, delta, time, spawnProjectile);
              break;
          case MinionType.BAT_FAMILIAR:
              this.updateBat(minion, player, enemies, delta, time, spawnProjectile);
              break;
          case MinionType.GRIMOIRE_BOOK:
              this.updateGrimoire(minion, player, enemies, delta, time, spawnProjectile);
              break;
      }
    }
  }

  // --- GOLEM AI ---
  private static updateGolem(golem: Entity, player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
    // Lead Player
    let targetX = player.x;
    let targetY = player.y;
    const pVx = player.velocity?.x || 0;
    const pVy = player.velocity?.y || 0;
    const pSpeed = Math.sqrt(pVx*pVx + pVy*pVy);
    if (pSpeed > 0.1) {
        targetX += (pVx / pSpeed) * 70;
        targetY += (pVy / pSpeed) * 70;
    } else {
        const t = time * 0.0005;
        targetX += Math.cos(t) * 70;
        targetY += Math.sin(t) * 70;
    }
    const dx = targetX - golem.x;
    const dy = targetY - golem.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 5) {
        const moveFactor = 0.2 * (delta / 16); 
        golem.x += dx * moveFactor;
        golem.y += dy * moveFactor;
    }

    // Collision
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      const ex = enemy.x - golem.x;
      const ey = enemy.y - golem.y;
      const distSq = ex*ex + ey*ey;
      const combined = golem.size + enemy.size;
      if (distSq < combined*combined) {
          const d = Math.sqrt(distSq);
          if (d > 0) {
              const push = (combined - d) / d;
              enemy.x += ex * push;
              enemy.y += ey * push;
              if (golem.powerLevel && golem.powerLevel >= 4) {
                  enemy.hp = (enemy.hp || 10) - 0.5;
              }
          }
      }
    }

    // Fire Rock
    if (time > (golem.attackCooldown || 0)) {
        const gx = golem.x - player.x;
        const gy = golem.y - player.y;
        const angleToGolem = Math.atan2(gy, gx);
        const angles = [angleToGolem + Math.PI/2, angleToGolem - Math.PI/2];
        const damage = golem.stats?.damage || 20;
        const stunDuration = 800 + ((golem.powerLevel || 1) * 200);

        angles.forEach(ang => {
            spawnProjectile({
                x: golem.x, y: golem.y,
                vx: Math.cos(ang) * 0.4, vy: Math.sin(ang) * 0.4,
                damage: damage, life: 800, type: WeaponType.AETHER_GOLEM,
                size: 12 + ((golem.powerLevel || 1) * 2), pierce: 2, level: golem.powerLevel || 1,
                isMinionShot: true,
                onHit: (e: Entity) => {
                    e.isStunned = true;
                    e.stunTimer = stunDuration;
                }
            });
        });
        golem.attackCooldown = time + (golem.stats?.cooldown || 3000);
    }
  }

  // --- PLANT AI ---
  private static updatePlant(plant: Entity, player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
    const distToPlayer = Math.sqrt(Math.pow(plant.x - player.x, 2) + Math.pow(plant.y - player.y, 2));
    if (distToPlayer > 500 && plant.state !== 'teleport') {
      plant.state = 'teleport';
      plant.stateTimer = 1000;
    }
    if (plant.state === 'teleport') {
      plant.stateTimer = (plant.stateTimer || 0) - delta;
      if (plant.stateTimer <= 0) {
        const angle = Math.random() * Math.PI * 2;
        plant.x = player.x + Math.cos(angle) * 100;
        plant.y = player.y + Math.sin(angle) * 100;
        plant.state = 'idle';
      }
      return;
    }
    if (time > (plant.attackCooldown || 0)) {
      let nearest: Entity | null = null;
      let minDist = 300;
      for (const enemy of enemies) {
        if (!enemy.active) continue;
        const d = Math.sqrt(Math.pow(enemy.x - plant.x, 2) + Math.pow(enemy.y - plant.y, 2));
        if (d < minDist) {
          minDist = d;
          nearest = enemy;
        }
      }
      if (nearest) {
        const angle = Math.atan2(nearest.y - plant.y, nearest.x - plant.x);
        spawnProjectile({
          x: plant.x, y: plant.y,
          vx: Math.cos(angle) * 0.4, vy: Math.sin(angle) * 0.4,
          damage: plant.stats?.damage || 39, life: 1000,
          type: WeaponType.ABYSSAL_BOTANY, size: 8, pierce: 1, isMinionShot: true, level: plant.powerLevel || 1
        });
        plant.attackCooldown = time + (plant.stats?.cooldown || 1000);
      }
    }
  }

  // --- UMBRA FAMILIAR AI ---
  // Behavior: Mimic player movement with delay. Slash contact damage.
  private static updateUmbra(umbra: Entity, player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
      if (!umbra.history) umbra.history = [];
      
      // Record player pos
      umbra.history.push({x: player.x, y: player.y});
      
      // Keep buffer roughly 20 frames (~300ms at 60fps)
      // Level 1: 0.3s delay. Level 2: faster mimic (shorter delay).
      const delayFrames = (umbra.powerLevel && umbra.powerLevel >= 2) ? 10 : 20;
      
      if (umbra.history.length > delayFrames) {
          const pos = umbra.history.shift();
          if (pos) {
              umbra.x = pos.x;
              umbra.y = pos.y;
          }
      } else if (umbra.history.length > 0) {
          // Init state catchup
          const pos = umbra.history[0];
          umbra.x = pos.x;
          umbra.y = pos.y;
      }

      // Contact Damage (Slashing)
      // "Slashes enemies it passes through" -> Contact hitbox
      for (const e of enemies) {
          if (!e.active) continue;
          const distSq = (e.x - umbra.x)**2 + (e.y - umbra.y)**2;
          if (distSq < (umbra.size + e.size)**2) {
              // Apply damage
              const damage = umbra.stats?.damage || 20;
              e.hp = (e.hp || 10) - (damage * delta * 0.06); // DPS scaling roughly
              
              // Level 2: Shadow Trails logic handled by separate projectile spawn? 
              // Or just baked in here? Prompt says "Movement leaves behind damaging shadow trails".
              // Let's spawn a stationary projectile every few frames if moving
          }
      }

      // Level 2 Trail
      if (umbra.powerLevel && umbra.powerLevel >= 2) {
          // Check if moved
          if (time % 200 < delta) { // Every 200ms
              spawnProjectile({
                  x: umbra.x, y: umbra.y, vx: 0, vy: 0,
                  damage: (umbra.stats?.damage || 20) * 0.5, life: 1000,
                  type: WeaponType.UMBRA_FAMILIAR, size: 20, pierce: 999, level: umbra.powerLevel,
                  isExplosion: true // Reusing visual tag for static
              });
          }
      }

      // Level 4: Piercing Charge
      if (umbra.powerLevel && umbra.powerLevel >= 4) {
          if (time > (umbra.attackCooldown || 0)) {
              // Find nearest enemy
              let nearest = null;
              let bestD = 400;
              for(const e of enemies) {
                  const d = Math.sqrt((e.x-umbra.x)**2 + (e.y-umbra.y)**2);
                  if(d < bestD) { bestD = d; nearest = e; }
              }
              if (nearest) {
                  const ang = Math.atan2(nearest.y - umbra.y, nearest.x - umbra.x);
                  spawnProjectile({
                      x: umbra.x, y: umbra.y,
                      vx: Math.cos(ang) * 0.8, vy: Math.sin(ang) * 0.8, // Fast
                      damage: (umbra.stats?.damage || 20) * 3,
                      life: 1000, type: WeaponType.NIGHT_BLADE, // Reuse slash art
                      size: 40, pierce: 99, level: umbra.powerLevel
                  });
                  umbra.attackCooldown = time + 5000;
              }
          }
      }
  }

  // --- BAT FAMILIAR AI ---
  // Behavior: Boids (spiral player + seek nearest)
  private static updateBat(bat: Entity, player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
      bat.orbitAngle = (bat.orbitAngle || 0) + (0.003 * delta); // Base spiral
      
      // Calculate Spiral Position
      const radius = 100 + Math.sin(time * 0.002) * 30;
      const spiralX = player.x + Math.cos(bat.orbitAngle) * radius;
      const spiralY = player.y + Math.sin(bat.orbitAngle) * radius;

      // Find Target (Hunt)
      let targetX = spiralX;
      let targetY = spiralY;
      let hasTarget = false;

      let nearestD = 300;
      for (const e of enemies) {
          const d = Math.sqrt((e.x - bat.x)**2 + (e.y - bat.y)**2);
          if (d < nearestD) {
              nearestD = d;
              targetX = e.x;
              targetY = e.y;
              hasTarget = true;
          }
      }

      // Move Logic (Steering)
      const dx = targetX - bat.x;
      const dy = targetY - bat.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const speed = (bat.stats?.speed || 0.2) * (hasTarget ? 1.5 : 1.0); // Faster when hunting
      
      if (dist > 5) {
          const vx = (dx / dist) * speed * delta;
          const vy = (dy / dist) * speed * delta;
          bat.x += vx;
          bat.y += vy;
      }

      // Contact Logic
      for (const e of enemies) {
          if (!e.active) continue;
          const dSq = (e.x - bat.x)**2 + (e.y - bat.y)**2;
          if (dSq < (bat.size + e.size)**2) {
              const dmg = bat.stats?.damage || 10;
              e.hp = (e.hp || 10) - (dmg * delta * 0.1); // DPS on contact
              
              // Level 3: Explode on impact (Cooldown?)
              if (bat.powerLevel && bat.powerLevel >= 3) {
                  if (time > (bat.attackCooldown || 0)) {
                      spawnProjectile({
                          x: bat.x, y: bat.y, vx: 0, vy: 0,
                          damage: dmg * 2, life: 300,
                          type: WeaponType.SHADOW_EXPLOSION, size: 40,
                          pierce: 99, level: bat.powerLevel, isExplosion: true
                      });
                      bat.attackCooldown = time + 3000; // Respawn/Recharge timer
                      // Teleport back to player to simulate "death/respawn"
                      bat.x = player.x; bat.y = player.y;
                  }
              }

              // Level 4: Lifesteal
              if (bat.powerLevel && bat.powerLevel >= 4) {
                  if (Math.random() < 0.05) { // 5% chance per frame contact
                      player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 1);
                  }
              }
          }
      }
  }

  // --- GRIMOIRE BOOK AI ---
  // Behavior: Orbit slowly, Fire Beams
  private static updateGrimoire(book: Entity, player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
      // Orbit
      const speed = 0.001;
      book.orbitAngle = (book.orbitAngle || 0) + (speed * delta);
      const radius = 70;
      
      // Update Position (Rigid Orbit)
      book.x = player.x + Math.cos(book.orbitAngle) * radius;
      book.y = player.y + Math.sin(book.orbitAngle) * radius;

      // Fire Logic
      if (time > (book.attackCooldown || 0)) {
          // Find Nearest
          let target = null;
          let bestD = (book.stats?.range || 400);
          for(const e of enemies) {
              const d = Math.sqrt((e.x - book.x)**2 + (e.y - book.y)**2);
              if (d < bestD) {
                  bestD = d;
                  target = e;
              }
          }

          if (target) {
              const ang = Math.atan2(target.y - book.y, target.x - book.x);
              
              // Fire Beam (Fast Missile)
              spawnProjectile({
                  x: book.x, y: book.y,
                  vx: Math.cos(ang) * 1.0, vy: Math.sin(ang) * 1.0, // Fast
                  damage: book.stats?.damage || 15,
                  life: 600, // Short life beam
                  type: WeaponType.MISSILE, // Reuse missile art or create beam art
                  size: 5 + (book.powerLevel || 1),
                  pierce: (book.powerLevel && book.powerLevel >= 4) ? 2 : 0,
                  level: book.powerLevel || 1,
                  // Level 3: Glyph
                  onHit: (e: Entity) => {
                      if (book.powerLevel && book.powerLevel >= 3) {
                          // Mark logic (bonus damage next hit? difficult to track state on enemy without prop)
                          e.hp! -= 5; // Direct bonus damage for simplicity
                      }
                  }
              });

              // Level 5: Arcane Pulse Counter
              if (book.powerLevel && book.powerLevel >= 5) {
                  // Hacky counter storage in entity
                  book.aiValues = book.aiValues || { seed: 0 }; // reuse seed as counter
                  book.aiValues.seed++;
                  if (book.aiValues.seed >= 6) {
                      book.aiValues.seed = 0;
                      spawnProjectile({
                          x: book.x, y: book.y, vx: 0, vy: 0,
                          damage: (book.stats?.damage || 15) * 2,
                          life: 300, type: WeaponType.SHADOW_EXPLOSION, size: 80, pierce: 99,
                          level: 5, isExplosion: true
                      });
                  }
              }

              book.attackCooldown = time + (book.stats?.cooldown || 1000);
          }
      }
  }
}
