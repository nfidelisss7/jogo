import { ProceduralArt } from '../../types';

export const DarkBoltArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Rotate core
    ctx.rotate(time * -10);

    // Serrated Disc
    ctx.fillStyle = '#050505';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    const points = 8;
    for(let i=0; i<=points * 2; i++) {
        const ang = (i / (points * 2)) * Math.PI * 2;
        const rad = i % 2 === 0 ? size : size * 0.5;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i===0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Void
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};