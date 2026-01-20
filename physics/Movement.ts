
import { Entity } from '../types';

export class Movement {
  static seek(me: Entity, targetX: number, targetY: number, speed: number, delta: number) {
    const dx = targetX - me.x;
    const dy = targetY - me.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      me.x += (dx / dist) * speed * delta;
      me.y += (dy / dist) * speed * delta;
    }
  }

  static separate(me: Entity, neighbors: Entity[], radius: number, force: number, delta: number) {
    let moveX = 0;
    let moveY = 0;
    let count = 0;

    for (const other of neighbors) {
      if (other === me || !other.active) continue;
      const dx = me.x - other.x;
      const dy = me.y - other.y;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0 && distSq < radius * radius) {
        const dist = Math.sqrt(distSq);
        // Weight by distance (closer = stronger push)
        const push = (radius - dist) / dist; 
        moveX += dx * push;
        moveY += dy * push;
        count++;
      }
    }

    if (count > 0) {
      me.x += (moveX / count) * force * delta;
      me.y += (moveY / count) * force * delta;
    }
  }
}
