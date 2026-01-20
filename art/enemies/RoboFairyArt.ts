
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const RoboFairyArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Hover Jitter
    ctx.translate(0, Math.sin(time * 20) * 2);

    const metalGrad = DrawUtils.createMetallicGradient(ctx, size, '#eef', '#99a');
    const coreColor = state?.isKing ? '#ff0000' : '#00ffff';

    // Wings (X Shape)
    ctx.save();
    const flap = Math.sin(time * 30) * 0.5;
    ctx.rotate(time); // Whole body slow spin
    
    ctx.fillStyle = 'rgba(200, 200, 255, 0.3)';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;

    for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI / 2));
        ctx.scale(1 - flap, 1); // Flap effect
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, -size * 1.5);
        ctx.lineTo(-10, -size * 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();

    // Body (Octahedron / Diamond)
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    
    // Core Light
    DrawUtils.drawGlow(ctx, 5, coreColor);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Electric Arcs
    if (Math.random() > 0.8) {
        ctx.strokeStyle = coreColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const ex = (Math.random()-0.5) * size * 3;
        const ey = (Math.random()-0.5) * size * 3;
        ctx.lineTo(ex, ey);
        ctx.stroke();
    }

    ctx.restore();
  }
};
