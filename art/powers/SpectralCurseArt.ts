import { ProceduralArt } from '../../types';

export const SpectralCurseArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Ghostly Pulse
    const scale = 1 + Math.sin(time * 5) * 0.1;
    ctx.scale(scale, scale);

    // Skull/Rune Shape
    ctx.fillStyle = '#222';
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size, -size, size, size * 0.5, 0, size);
    ctx.bezierCurveTo(-size, size * 0.5, -size, -size, 0, -size);
    ctx.fill();
    ctx.stroke();

    // Hollow Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size*0.3, -size*0.1, size*0.15, 0, Math.PI*2);
    ctx.arc(size*0.3, -size*0.1, size*0.15, 0, Math.PI*2);
    ctx.fill();

    // Orbiting Wisps
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    for(let i=0; i<3; i++) {
        const ang = time * 3 + (i * Math.PI * 2 / 3);
        const r = size * 1.5;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * r, Math.sin(ang) * r, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  }
};