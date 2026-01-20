
import { DrawUtils } from '../primitives/DrawUtils';

export class TitleRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
  
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.resize(ctx.canvas.width, ctx.canvas.height);
    this.initParticles();
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5
      });
    }
  }

  draw(time: number, mouseX: number, mouseY: number) {
    const { ctx, width, height } = this;
    
    // Normalized Mouse (-1 to 1)
    const nmx = (mouseX / width) * 2 - 1;
    const nmy = (mouseY / height) * 2 - 1;

    // 1. Background (The Deep Void)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#020202');
    bgGrad.addColorStop(0.5, '#0a050a');
    bgGrad.addColorStop(1, '#1a0b1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. The Void Gate (Central Singularity)
    // Draw with Chromatic Aberration (RGB Split)
    const cx = width / 2 - nmx * 20;
    const cy = height / 2 - 50 - nmy * 20;
    const pulse = Math.sin(time * 0.001) * 0.05 + 1;
    
    // Glitch jitter
    const glitch = Math.random() > 0.98 ? (Math.random() - 0.5) * 10 : 0;

    ctx.globalCompositeOperation = 'screen';
    
    // Red Channel
    this.drawGateLayer(cx + 4 + glitch, cy, pulse, 'rgba(255, 0, 0, 0.3)', time);
    // Blue Channel
    this.drawGateLayer(cx - 4 - glitch, cy, pulse, 'rgba(0, 255, 255, 0.3)', time + 1);
    // Core
    ctx.globalCompositeOperation = 'source-over';
    this.drawGateLayer(cx, cy, pulse, 'rgba(0,0,0,1)', time);

    // 3. Volumetric Mist (Parallax Sine Waves)
    this.drawMist(time, 0.0005, 100, 0.1, '#2a002a', 1 + nmx * 50);
    this.drawMist(time, 0.001, 150, 0.2, '#1a001a', 2 + nmx * 100);
    this.drawMist(time, 0.002, 200, 0.3, '#000000', 3 + nmx * 200);

    // 4. Particles (Ash)
    this.updateAndDrawParticles(time);

    // 5. Film Grain & Vignette
    this.drawVignette();
  }

  private drawGateLayer(x: number, y: number, scale: number, color: string, time: number) {
    const radius = 120 * scale;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Accretion Disk Rays
    if (color !== 'rgba(0,0,0,1)') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        const rays = 24;
        for(let i=0; i<rays; i++) {
            const angle = (i / rays) * Math.PI * 2 + time * 0.0005;
            const len = radius * (1.5 + Math.sin(time * 0.002 + i) * 0.2);
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.cos(angle)*radius, y + Math.sin(angle)*radius);
            this.ctx.lineTo(x + Math.cos(angle)*len, y + Math.sin(angle)*len);
            this.ctx.stroke();
        }
    } else {
        // Inner Black Hole outline
        this.ctx.strokeStyle = '#4b0082';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#8a2be2';
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
  }

  private drawMist(time: number, speed: number, amplitude: number, alpha: number, color: string, offset: number) {
    const { ctx, width, height } = this;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, height);

    const baseHeight = height * 0.8;
    for (let x = 0; x <= width; x += 10) {
      const y = baseHeight + 
        Math.sin(x * 0.002 + time * speed + offset) * amplitude + 
        Math.sin(x * 0.01 - time * speed * 2) * (amplitude * 0.3);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  private updateAndDrawParticles(time: number) {
    const { ctx, width, height } = this;
    ctx.fillStyle = '#aaddff';
    
    for (const p of this.particles) {
      p.x += p.vx + Math.sin(time * 0.001 + p.y * 0.01) * 0.2;
      p.y += p.vy;
      
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      ctx.globalAlpha = p.alpha * (0.5 + Math.sin(time * 0.005 + p.x) * 0.5); // Twinkle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  private drawVignette() {
    const { ctx, width, height } = this;
    const grad = ctx.createRadialGradient(width/2, height/2, height*0.3, width/2, height/2, height*0.8);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for(let y=0; y<height; y+=4) {
        ctx.fillRect(0, y, width, 1);
    }
  }
}
