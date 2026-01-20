
import { Entity } from '../../types';

export class Steering {
  
  static seek(me: Entity, targetX: number, targetY: number, slowingRadius: number = 0): { x: number, y: number } {
    const dx = targetX - me.x;
    const dy = targetY - me.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist === 0) return { x: 0, y: 0 };

    let speed = 1.0;
    if (slowingRadius > 0 && dist < slowingRadius) {
      speed = dist / slowingRadius;
    }

    return { x: (dx/dist) * speed, y: (dy/dist) * speed };
  }

  static flee(me: Entity, targetX: number, targetY: number): { x: number, y: number } {
    const vec = this.seek(me, targetX, targetY);
    return { x: -vec.x, y: -vec.y };
  }

  static wander(me: Entity, radius: number = 100, seedOffset: number): { x: number, y: number } {
    const time = Date.now() * 0.001;
    const noise = Math.sin(time + seedOffset * 100);
    const angle = noise * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  // --- FLOCKING BEHAVIORS ---

  static separation(me: Entity, neighbors: Entity[], radius: number): { x: number, y: number } {
    let moveX = 0;
    let moveY = 0;
    let count = 0;
    const rSq = radius * radius;

    for (const other of neighbors) {
      if (other === me || !other.active) continue;
      const dx = me.x - other.x;
      const dy = me.y - other.y;
      const distSq = dx*dx + dy*dy;

      if (distSq > 0 && distSq < rSq) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / dist; // Stronger when closer
        moveX += (dx/dist) * force;
        moveY += (dy/dist) * force;
        count++;
      }
    }

    if (count > 0) {
      moveX /= count;
      moveY /= count;
    }
    return { x: moveX, y: moveY };
  }

  static alignment(me: Entity, neighbors: Entity[], radius: number): { x: number, y: number } {
    let avgVX = 0;
    let avgVY = 0;
    let count = 0;
    const rSq = radius * radius;

    for (const other of neighbors) {
      if (other === me || !other.active) continue;
      const distSq = (me.x - other.x)**2 + (me.y - other.y)**2;
      if (distSq < rSq && other.velocity) {
        avgVX += other.velocity.x;
        avgVY += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      avgVX /= count;
      avgVY /= count;
      const len = Math.sqrt(avgVX*avgVX + avgVY*avgVY);
      if (len > 0) return { x: avgVX/len, y: avgVY/len };
    }
    return { x: 0, y: 0 };
  }

  static cohesion(me: Entity, neighbors: Entity[], radius: number): { x: number, y: number } {
    let centerX = 0;
    let centerY = 0;
    let count = 0;
    const rSq = radius * radius;

    for (const other of neighbors) {
      if (other === me || !other.active) continue;
      const distSq = (me.x - other.x)**2 + (me.y - other.y)**2;
      if (distSq < rSq) {
        centerX += other.x;
        centerY += other.y;
        count++;
      }
    }

    if (count > 0) {
      centerX /= count;
      centerY /= count;
      return this.seek(me, centerX, centerY);
    }
    return { x: 0, y: 0 };
  }
}
