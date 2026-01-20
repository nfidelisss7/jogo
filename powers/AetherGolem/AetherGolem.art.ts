
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#a0522d', size * 0.5, 5);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * 5);

    // Rock
    ctx.fillStyle = '#8b4513';
    ctx.strokeStyle = '#cd853f';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    const sides = 6;
    for (let i = 0; i < sides; i++) {
        const theta = (i / sides) * Math.PI * 2;
        const rad = size * (0.8 + Math.random() * 0.2); // Jagged
        const px = Math.cos(theta) * rad;
        const py = Math.sin(theta) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Runes
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size*0.5, 0); ctx.lineTo(size*0.5, 0);
    ctx.moveTo(0, -size*0.5); ctx.lineTo(0, size*0.5);
    ctx.stroke();

    ctx.restore();
  }
};
