import { ProceduralArt } from '../../types';

export const BloodWhipArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Whip Spine
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    // Wave motion
    const segments = 10;
    const length = size * 4;
    for(let i=1; i<=segments; i++) {
        const progress = i / segments;
        const wave = Math.sin(time * 15 + progress * 10) * size * 0.8 * progress;
        ctx.lineTo(progress * length, wave);
    }
    ctx.stroke();

    // Barbs
    ctx.fillStyle = '#ff0000';
    for(let i=1; i<=segments; i+=2) {
        const progress = i / segments;
        const wave = Math.sin(time * 15 + progress * 10) * size * 0.8 * progress;
        
        ctx.beginPath();
        ctx.moveTo(progress * length, wave);
        ctx.lineTo(progress * length - 5, wave - 5);
        ctx.lineTo(progress * length - 5, wave + 5);
        ctx.fill();
    }

    ctx.restore();
  }
};