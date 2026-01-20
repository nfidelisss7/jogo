
import { Entity } from '../../types';

export class VFX {
  // Global particle limiter
  private static particleBudget = 500;
  private static currentParticles = 0;

  // --- UTILS ---
  
  static drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, strength: number = 1) {
    if (radius < 2 || strength < 0.1) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = 'screen'; // Use screen for better light blending
    ctx.globalAlpha = strength;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  static drawLightning(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, thickness: number, jitter: number) {
    const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const steps = Math.max(2, Math.floor(dist / 40)); 
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    
    for(let i=1; i<steps; i++) {
        const t = i / steps;
        const lx = x1 + (x2-x1) * t;
        const ly = y1 + (y2-y1) * t;
        const offX = (Math.random()-0.5) * jitter;
        const offY = (Math.random()-0.5) * jitter;
        ctx.lineTo(lx + offX, ly + offY);
    }
    ctx.lineTo(x2, y2);
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Outer glow layer
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness * 3;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  // --- TRAIL SYSTEM ---
  
  static drawTrail(ctx: CanvasRenderingContext2D, entity: Entity, camX: number, camY: number, color: string, width: number, length: number = 10) {
    if (entity.x - camX < -50 || entity.x - camX > ctx.canvas.width + 50) return;

    if (!entity.customData) entity.customData = {};
    if (!entity.customData.trail) entity.customData.trail = [];
    
    const trail = entity.customData.trail as {x: number, y: number}[];
    
    trail.push({x: entity.x, y: entity.y});
    if (trail.length > length) trail.shift();
    
    if (trail.length < 2) return;

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Tapering opacity
    for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i+1];
        const alpha = i / trail.length;
        
        ctx.beginPath();
        ctx.moveTo(p1.x - camX, p1.y - camY);
        ctx.lineTo(p2.x - camX, p2.y - camY);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.lineWidth = width * alpha;
        ctx.stroke();
    }
    
    ctx.restore();
  }

  // --- PARTICLE SYSTEM ---
  
  static emitParticle(entity: Entity, x: number, y: number, props: any) {
      if (this.currentParticles > this.particleBudget) return;

      if (!entity.customData) entity.customData = {};
      if (!entity.customData.particles) entity.customData.particles = [];
      
      if (entity.customData.particles.length > 15) return;

      entity.customData.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * (props.speed || 5),
          vy: (Math.random() - 0.5) * (props.speed || 5),
          life: props.life || 30,
          maxLife: props.life || 30,
          color: props.color || '#fff',
          size: props.size || 2
      });
      this.currentParticles++;
  }

  static updateAndDrawParticles(ctx: CanvasRenderingContext2D, entity: Entity, camX: number, camY: number) {
      if (!entity.customData?.particles) return;
      
      const particles = entity.customData.particles;
      
      for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          
          if (p.life <= 0) {
              particles.splice(i, 1);
              this.currentParticles--;
              continue;
          }
          
          const px = p.x - camX;
          const py = p.y - camY;
          if (px < 0 || px > ctx.canvas.width || py < 0 || py > ctx.canvas.height) continue;

          // Draw with fade
          const alpha = p.life / p.maxLife;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          
          // Diamond shape particles look better than rects
          ctx.beginPath();
          ctx.moveTo(px, py - p.size);
          ctx.lineTo(px + p.size, py);
          ctx.lineTo(px, py + p.size);
          ctx.lineTo(px - p.size, py);
          ctx.fill();
      }
      ctx.globalAlpha = 1.0;
  }
}
