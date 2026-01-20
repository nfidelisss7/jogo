
import { Entity } from '../../types';

export class SummonAI {
  
  // --- Boids / Flocking (For Bats) ---
  static calculateFlocking(
    me: Entity, 
    neighbors: Entity[], 
    target: {x: number, y: number}, 
    separationRadius: number = 30, 
    cohesionWeight: number = 0.5
  ): { vx: number, vy: number } {
    let sepX = 0, sepY = 0;
    let cohX = 0, cohY = 0;
    let count = 0;

    for (const other of neighbors) {
      if (other.id === me.id || !other.active) continue;
      const d = Math.sqrt(Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2));
      
      if (d < separationRadius) {
        const force = (separationRadius - d) / d;
        sepX += (me.x - other.x) * force;
        sepY += (me.y - other.y) * force;
        count++;
      }
      
      // Simple Cohesion (center of mass)
      cohX += other.x;
      cohY += other.y;
    }

    // Target attraction (Steer towards player/target)
    const tx = target.x - me.x;
    const ty = target.y - me.y;
    const tDist = Math.sqrt(tx*tx + ty*ty);
    const targetForceX = tDist > 0 ? (tx/tDist) : 0;
    const targetForceY = tDist > 0 ? (ty/tDist) : 0;

    if (count > 0) {
      cohX = (cohX / count) - me.x;
      cohY = (cohY / count) - me.y;
    }

    return {
      vx: (sepX * 2.0) + (cohX * cohesionWeight) + (targetForceX * 1.5),
      vy: (sepY * 2.0) + (cohY * cohesionWeight) + (targetForceY * 1.5)
    };
  }

  // --- Defensive Positioning (For Golem) ---
  static getInterposePosition(player: Entity, enemy: Entity, distance: number = 60): {x: number, y: number} {
    const angle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
    return {
      x: player.x + Math.cos(angle) * distance,
      y: player.y + Math.sin(angle) * distance
    };
  }

  // --- Lagging Follow (For Botany/Umbra) ---
  static interpolatePosition(current: number, target: number, speed: number, delta: number): number {
    const diff = target - current;
    // Non-linear ease out
    return current + diff * Math.min(1, speed * (delta / 16));
  }
}
