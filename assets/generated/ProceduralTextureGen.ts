
export class ProceduralTextureGen {
  private static cache: Map<string, HTMLCanvasElement> = new Map();

  static getTexture(key: string, drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, width: number, height: number): HTMLCanvasElement {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      drawFn(ctx, width, height);
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  static createNoiseTexture(size: number, color: string): HTMLCanvasElement {
    return this.getTexture(`noise_${size}_${color}`, (ctx, w, h) => {
      const idata = ctx.createImageData(w, h);
      const buffer = new Uint32Array(idata.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        if (Math.random() > 0.5) {
          buffer[i] = 0xFFFFFFFF; // White noise
        }
      }
      ctx.putImageData(idata, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
    }, size, size);
  }
}
