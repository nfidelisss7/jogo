import { ProceduralArt } from '../../types';

export const HorrorWaveArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Expanding Waves
    ctx.strokeStyle = '#220033';
    ctx.lineWidth = 3;
    
    for(let i=0; i<3; i++) {
        const waveProgress = (time * 0.5 + i * 0.33) % 1;
        const r = waveProgress * size;
        const alpha = 1 - waveProgress;
        
        ctx.globalAlpha = alpha;
        
        // Distorted Ring
        ctx.beginPath();
        for(let j=0; j<=20; j++) {
            const ang = (j/20) * Math.PI * 2;
            const distortion = Math.sin(ang * 8 + time * 10) * (size * 0.05);
            const rad = r + distortion;
            const px = Math.cos(ang) * rad;
            const py = Math.sin(ang) * rad;
            if(j===0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    ctx.restore();
  }
};