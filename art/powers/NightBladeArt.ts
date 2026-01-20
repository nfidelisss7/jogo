import { ProceduralArt } from '../../types';

export const NightBladeArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 20); // Fast spin

    // Crescent Blade
    ctx.fillStyle = '#222';
    ctx.strokeStyle = '#440066';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.moveTo(size * 0.6, 0);
    ctx.arc(size * 0.4, 0, size * 0.8, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.stroke();

    // Energy Trail
    ctx.strokeStyle = 'rgba(100, 0, 200, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.2, time * 10, time * 10 + Math.PI);
    ctx.stroke();

    ctx.restore();
  }
};