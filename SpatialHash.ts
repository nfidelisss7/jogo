
import { Entity } from './types';

export class SpatialHash {
  private cellSize: number;
  // Use number keys to avoid string allocation. Map<int_key, Entity[]>
  // Reusing arrays inside the map to reduce allocation churn.
  private grid: Map<number, Entity[]>;
  private pool: Entity[][]; // Pool of arrays to reuse

  constructor(cellSize: number = 64) {
    this.cellSize = cellSize;
    this.grid = new Map();
    this.pool = [];
  }

  // Integer Hash Key: (x & 0xFFFF) | ((y & 0xFFFF) << 16)
  // Supports coords roughly -32000 to +32000
  private getKey(x: number, y: number): number {
    const gx = Math.floor(x / this.cellSize);
    const gy = Math.floor(y / this.cellSize);
    return (gx & 0xFFFF) | ((gy & 0xFFFF) << 16);
  }

  clear() {
    // Return arrays to pool instead of discarding
    for (const bucket of this.grid.values()) {
      bucket.length = 0;
      this.pool.push(bucket);
    }
    this.grid.clear();
  }

  insert(entity: Entity) {
    const key = this.getKey(entity.x, entity.y);
    let cell = this.grid.get(key);
    if (!cell) {
      cell = this.pool.pop() || [];
      this.grid.set(key, cell);
    }
    cell.push(entity);
  }

  // Zero-allocation query that fills a provided buffer
  queryToBuffer(x: number, y: number, radius: number, buffer: Entity[]) {
    buffer.length = 0; // Reset buffer
    
    const startX = Math.floor((x - radius) / this.cellSize);
    const endX = Math.floor((x + radius) / this.cellSize);
    const startY = Math.floor((y - radius) / this.cellSize);
    const endY = Math.floor((y + radius) / this.cellSize);

    for (let gx = startX; gx <= endX; gx++) {
      for (let gy = startY; gy <= endY; gy++) {
        // Reconstruct key logic manually for performance
        const key = (gx & 0xFFFF) | ((gy & 0xFFFF) << 16);
        const cell = this.grid.get(key);
        if (cell) {
          const len = cell.length;
          for (let i = 0; i < len; i++) {
             buffer.push(cell[i]);
          }
        }
      }
    }
  }

  // Legacy method wrapper for compatibility
  getNearby(x: number, y: number, radius: number): Entity[] {
    const results: Entity[] = [];
    this.queryToBuffer(x, y, radius, results);
    return results;
  }

  query(x: number, y: number, radius: number, callback: (e: Entity) => void) {
    const startX = Math.floor((x - radius) / this.cellSize);
    const endX = Math.floor((x + radius) / this.cellSize);
    const startY = Math.floor((y - radius) / this.cellSize);
    const endY = Math.floor((y + radius) / this.cellSize);

    for (let gx = startX; gx <= endX; gx++) {
      for (let gy = startY; gy <= endY; gy++) {
        const key = (gx & 0xFFFF) | ((gy & 0xFFFF) << 16);
        const cell = this.grid.get(key);
        if (cell) {
          const len = cell.length;
          for (let i = 0; i < len; i++) {
             callback(cell[i]);
          }
        }
      }
    }
  }
}
