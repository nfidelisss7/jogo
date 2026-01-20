import { ProceduralArt } from '../../types';

export const AbyssPullArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Singularity
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Converging Lines
    ctx.strokeStyle = '#4400aa';
    ctx.lineWidth = 1;
    const lines = 12;
    for(let i=0; i<lines; i++) {
        const ang = (i / lines) * Math.PI * 2 + time * 0.5;
        const offset = (time * 2) % 1;
        const startR = size * 2;
        const endR = size * 0.4;
        
        const currentR = startR - (startR - endR) * offset;
        
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * currentR, Math.sin(ang) * currentR);
        ctx.lineTo(Math.cos(ang) * (currentR + 15), Math.sin(ang) * (currentR + 15));
        ctx.stroke();
    }

    // Distortion Ring
    ctx.strokeStyle = '#220055';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5 + Math.sin(time * 10) * 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
};