
import { ProceduralArt } from '../../types';
import { drawPolygon } from '../../art/primitives/Shapes';

export const CountDraculorArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // --- MIST FORM (Teleport/Immune) ---
    if (state === 'immune' || state === 'teleport') {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#aa0000';
      const particles = 20;
      for(let i=0; i<particles; i++) {
        const t = time * 3 + i;
        const r = size * (1 + Math.sin(t) * 0.5);
        const px = Math.cos(t * 1.3) * r;
        const py = Math.sin(t * 1.7) * r;
        
        ctx.beginPath();
        ctx.moveTo(px, py - 10);
        ctx.lineTo(px + 5, py + 5);
        ctx.lineTo(px - 5, py + 5);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // --- LIVING ANIMATION ---
    // Deep breathing scale
    const breath = 1 + Math.sin(time * 2) * 0.05;
    ctx.scale(breath, breath);
    
    // Hover bob
    ctx.translate(0, Math.sin(time * 3) * 5);

    // --- 1. FLUID CAPE (Sine Wave Simulation) ---
    ctx.fillStyle = '#220000';
    ctx.strokeStyle = '#440000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    const capeWidth = size * 2.5;
    const capeHeight = size * 2.5;
    const segments = 10;
    
    // Top anchor points
    ctx.moveTo(-size * 0.8, -size * 0.5);
    
    // Bottom wave edge
    for(let i=0; i<=segments; i++) {
        const t = i / segments;
        const waveX = -size * 1.2 + (t * capeWidth);
        const waveY = size * 1.8 + Math.sin(time * 4 + t * 5) * 15; // Cloth ripple
        ctx.lineTo(waveX, waveY);
    }
    
    ctx.lineTo(size * 0.8, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // --- 2. RIBBED ARMOR (Chitinous) ---
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#500';
    
    // Draw segmented torso
    for(let i=0; i<4; i++) {
        const w = size * (0.8 - i * 0.15);
        const h = size * 0.4;
        const yPos = -size * 0.8 + (i * h * 0.8);
        
        ctx.beginPath();
        ctx.moveTo(-w, yPos);
        ctx.bezierCurveTo(-w * 1.2, yPos + h/2, -w, yPos + h, 0, yPos + h + 5); // Pointed bottom
        ctx.bezierCurveTo(w, yPos + h, w * 1.2, yPos + h/2, w, yPos);
        ctx.fill();
        ctx.stroke();
    }

    // --- 3. HEAD (Angular Nosferatu Shape) ---
    ctx.save();
    ctx.translate(0, -size * 0.9);
    ctx.fillStyle = '#eec';
    ctx.beginPath();
    ctx.moveTo(-size*0.3, -size*0.4); // Left Ear
    ctx.lineTo(0, size*0.4); // Chin
    ctx.lineTo(size*0.3, -size*0.4); // Right Ear
    ctx.lineTo(0, -size*0.5); // Top
    ctx.closePath();
    ctx.fill();

    // --- 4. MULTI-EYE BLINKING SYSTEM ---
    const drawEye = (ex: number, ey: number, esize: number, offset: number) => {
        // Blink logic: sharp sine wave threshold
        const blink = Math.sin(time * 3 + offset);
        if (blink > 0.95) return; // Closed

        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(ex - esize, ey);
        ctx.quadraticCurveTo(ex, ey - esize, ex + esize, ey);
        ctx.quadraticCurveTo(ex, ey + esize, ex - esize, ey);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Pupil
        ctx.fillStyle = '#fff';
        ctx.fillRect(ex - 1, ey - 1, 2, 2);
    };

    // Main Eyes
    drawEye(-size*0.12, -size*0.1, 4, 0);
    drawEye(size*0.12, -size*0.1, 4, 0.5);
    
    // Chest Eyes (Eldritch Mutation)
    ctx.restore(); // Back to body space
    drawEye(0, -size * 0.2, 6, 2.0); // Heart Eye
    drawEye(-size * 0.3, size * 0.2, 3, 4.0);
    drawEye(size * 0.3, size * 0.2, 3, 1.5);

    // --- 5. ORBITING BATS ---
    const batCount = 4;
    ctx.fillStyle = '#000';
    for(let i=0; i<batCount; i++) {
        const t = time * 2 + (i * Math.PI * 2 / batCount);
        const orbitR = size * 2.2 + Math.sin(time * 5 + i) * 20;
        const bx = Math.cos(t) * orbitR;
        const by = Math.sin(t) * orbitR;
        
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(t + Math.PI/2);
        
        // Flapping
        const flap = Math.sin(time * 20 + i) * 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -5 + flap);
        ctx.lineTo(0, 5);
        ctx.lineTo(10, -5 + flap);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
  }
};
