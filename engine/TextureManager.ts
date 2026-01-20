
import { EnemyArchetype, BossType } from '../types';
import { EnemyArtRegistry } from '../art/enemies/EnemyArtRegistry';

export class TextureManager {
  private static cache: Map<string, HTMLCanvasElement> = new Map();
  private static ctx: CanvasRenderingContext2D | null = null;

  /**
   * Generates or retrieves a cached canvas for an enemy archetype.
   * Renders the enemy at "time = 0" to capture the base pose.
   */
  static getEnemyTexture(archetype: EnemyArchetype, size: number): HTMLCanvasElement {
    const key = `${archetype}_${size}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Create offscreen canvas
    const canvas = document.createElement('canvas');
    // Allocate enough space for limbs/auras (2.5x radius is usually safe)
    const padding = size * 2.5; 
    const dim = Math.ceil(padding * 2);
    canvas.width = dim;
    canvas.height = dim;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return canvas; // Fail safe

    // Draw the procedural art into the buffer
    // We translate to center so (0,0) drawing operations work
    ctx.translate(dim / 2, dim / 2);
    
    const art = EnemyArtRegistry[archetype];
    if (art) {
        // Draw at time 0, angle 0
        art.draw(ctx, 0, 0, size, 0, 0, {}); 
    } else {
        // Fallback placeholder
        ctx.fillStyle = '#f0f';
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI*2);
        ctx.fill();
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  static clear() {
    this.cache.clear();
  }
}
