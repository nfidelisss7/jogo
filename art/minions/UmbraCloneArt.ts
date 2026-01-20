
import { ProceduralArt } from '../../types';

export const UmbraCloneArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Glitch Shift
    if (Math.random() > 0.9) {
        ctx.translate((Math.random()-0.5)*5, 0);
    }

    // Silhouette Color
    ctx.fillStyle = 'rgba(10, 0, 20, 0.8)';
    ctx.strokeStyle = '#4b0082'; // Indigo outline
    ctx.lineWidth = 2;

    // --- BODY (Player Silhouette) ---
    ctx.beginPath();
    // Head
    ctx.arc(0, -size * 0.8, size * 0.35, 0, Math.PI * 2);
    // Body (Cape shape)
    ctx.moveTo(-size * 0.5, -size * 0.4);
    ctx.lineTo(size * 0.5, -size * 0.4);
    ctx.lineTo(size * 0.4, size * 1.2);
    ctx.lineTo(-size * 0.4, size * 1.2);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();

    // --- EYES (Glowing Slits) ---
    ctx.fillStyle = '#8a2be2';
    ctx.shadowColor = '#8a2be2';
    ctx.shadowBlur = 10;
    ctx.fillRect(-4, -size * 0.85, 3, 2);
    ctx.fillRect(1, -size * 0.85, 3, 2);
    ctx.shadowBlur = 0;

    // --- STATIC NOISE ---
    ctx.fillStyle = '#fff';
    for(let i=0; i<3; i++) {
        if(Math.random() > 0.5) {
            const nx = (Math.random()-0.5) * size;
            const ny = (Math.random()-0.5) * size * 2;
            ctx.fillRect(nx, ny, 4, 1); // Horizontal scanlines
        }
    }

    ctx.restore();
  }
};
