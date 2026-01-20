
import { Entity } from '../types';

export class Collision {
  static checkCircle(a: Entity, b: Entity): boolean {
    if (!a.active || !b.active) return false;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const r = a.size + b.size;
    return (dx * dx + dy * dy) < (r * r);
  }

  static checkPointCircle(px: number, py: number, circle: Entity): boolean {
    const dx = px - circle.x;
    const dy = py - circle.y;
    return (dx * dx + dy * dy) < (circle.size * circle.size);
  }

  static resolveOverlap(a: Entity, b: Entity, force: number = 0.5) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distSq = dx * dx + dy * dy;
    const minDist = a.size + b.size;

    if (distSq > 0 && distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;

      // Push a away
      a.x += nx * overlap * force;
      a.y += ny * overlap * force;
    }
  }
}
