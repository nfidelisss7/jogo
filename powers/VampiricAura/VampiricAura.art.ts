
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);

    const pulse = 1 + Math.sin(time * 3) * 0.05;
    ctx.scale(pulse, pulse);

    // Red Field
    const grad = ctx.createRadialGradient(0, 0, size*0.5, 0, 0, size);
    grad.addColorStop(0, 'rgba(100, 0, 0, 0.0)');
    grad.addColorStop(1, 'rgba(200, 0, 0, 0.3)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.fill();

    // Draining Blood Lines
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'lighter';
    
    const lines = 12;
    for(let i=0; i<lines; i++) {
        const offset = (time * 0.5 + i/lines) % 1;
        const r = size * (1 - offset); // Inward
        const theta = i * (Math.PI*2/lines) + time;
        
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px * 0.8, py * 0.8);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(px, py, 1, 1);
    }

    ctx.restore();
  }
};
