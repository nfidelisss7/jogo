
import { Entity } from '../../types';
import { SpatialHash } from '../../SpatialHash';

export class Perception {
  static getDistanceSq(a: Entity, b: Entity): number {
    return (a.x - b.x)**2 + (a.y - b.y)**2;
  }

  static getDirectionTo(from: Entity, to: Entity): { x: number, y: number } {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist === 0) return { x: 0, y: 0 };
    return { x: dx/dist, y: dy/dist };
  }

  static getNearbyEntities(
    me: Entity, 
    spatialHash: SpatialHash, 
    radius: number, 
    typeFilter?: string
  ): Entity[] {
    const results: Entity[] = [];
    spatialHash.queryToBuffer(me.x, me.y, radius, results);
    
    if (typeFilter) {
      return results.filter(e => e.active && e.type === typeFilter && e.id !== me.id);
    }
    return results.filter(e => e.active && e.id !== me.id);
  }

  static calculateCrowdingVector(me: Entity, neighbors: Entity[], radius: number): { x: number, y: number } {
    let moveX = 0;
    let moveY = 0;
    let count = 0;
    const radiusSq = radius * radius;

    for (const other of neighbors) {
      const dSq = this.getDistanceSq(me, other);
      if (dSq > 0 && dSq < radiusSq) {
        const dist = Math.sqrt(dSq);
        const push = (radius - dist) / dist; // Stronger push if closer
        moveX += (me.x - other.x) * push;
        moveY += (me.y - other.y) * push;
        count++;
      }
    }

    if (count > 0) {
      // Normalize
      const len = Math.sqrt(moveX*moveX + moveY*moveY);
      if (len > 0) {
        moveX /= len;
        moveY /= len;
      }
    }

    return { x: moveX, y: moveY };
  }
}
