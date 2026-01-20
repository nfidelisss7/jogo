
import { Entity } from '../types';

export class SpatialHashGrid {
  private cellSize: number;
  private cells: Map<number, Entity[]> = new Map();
  private queryId: number = 0;

  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
  }

  // Bitwise hashing for performance
  private getKey(x: number, y: number): number {
    const xi = Math.floor(x / this.cellSize);
    const yi = Math.floor(y / this.cellSize);
    return (xi * 73856093) ^ (yi * 19349663);
  }

  clear() {
    this.cells.clear();
  }

  insert(entity: Entity) {
    const key = this.getKey(entity.x, entity.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key)!.push(entity);
  }

  // Optimized buffer-filling query
  query(x: number, y: number, radius: number, buffer: Entity[]) {
    buffer.length = 0;
    const startX = Math.floor((x - radius) / this.cellSize);
    const endX = Math.floor((x + radius) / this.cellSize);
    const startY = Math.floor((y - radius) / this.cellSize);
    const endY = Math.floor((y + radius) / this.cellSize);

    for (let xi = startX; xi <= endX; xi++) {
      for (let yi = startY; yi <= endY; yi++) {
        const key = (xi * 73856093) ^ (yi * 19349663);
        const cell = this.cells.get(key);
        if (cell) {
          for (let i = 0; i < cell.length; i++) {
            buffer.push(cell[i]);
          }
        }
      }
    }
  }
}
