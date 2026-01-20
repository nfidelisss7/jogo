
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const VoidBloomArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Pulse
    const pulse = 1 + Math.sin(time * 3) * 0.1;
    ctx.scale(pulse, pulse);

    const petalColor = '#4b0082';
    const veinColor = '#8a2be2';

    // --- LEAVES (Base) ---
    ctx.fillStyle = '#220033';
    for(let i=0; i<5; i++) {
        ctx.save();
        ctx.rotate((i/5) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, size, size*0.4, size*0.8, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    // --- PETALS (Waving) ---
    ctx.fillStyle = petalColor;
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 1;

    const petals = 6;
    for(let i=0; i<petals; i++) {
        ctx.save();
        ctx.rotate((i/petals) * Math.PI * 2 + Math.sin(time)*0.1);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size, -size*0.5, size*1.5, size*0.5, 0, size);
        ctx.bezierCurveTo(-size*1.5, size*0.5, -size, -size*0.5, 0, 0);
        ctx.fill();
        ctx.stroke();
        
        // Inner detail
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size * 0.7);
        ctx.stroke();
        
        ctx.restore();
    }

    // --- CORE (Spores) ---
    DrawUtils.drawGlow(ctx, size * 0.3, '#ff00ff', 0.8);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Floating Spores
    ctx.fillStyle = '#00ff00';
    for(let i=0; i<3; i++) {
        const t = time * 2 + i;
        const sx = Math.cos(t) * size * 0.8;
        const sy = Math.sin(t) * size * 0.8 - size;
        ctx.fillRect(sx, sy, 2, 2);
    }

    ctx.restore();
  }
};
