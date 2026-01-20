
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const PapamamaDragonArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Hover
    ctx.translate(0, Math.sin(time * 1.5) * 8);

    // --- WINGS (Solid, Majestic) ---
    const drawWing = (mirror: boolean) => {
        ctx.save();
        if (mirror) ctx.scale(-1, 1);
        
        const flap = Math.sin(time * 2) * 0.15;
        ctx.rotate(flap);
        ctx.translate(size * 0.2, -size * 0.5);

        ctx.fillStyle = '#2a0a0a'; // Dark Red/Black
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 3.5, -size * 1.2); // Main Spar
        ctx.quadraticCurveTo(-size * 1.5, size * 1.5, 0, size * 0.5); // Webbing
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    drawWing(false);
    drawWing(true);

    // --- BODY (Heavy Scale) ---
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.2, size * 0.8, size * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chest Plate
    ctx.fillStyle = '#400';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.1, size * 0.5, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- HEAD 1: VOID (Left) ---
    ctx.save();
    ctx.rotate(-0.3);
    ctx.translate(0, -size * 1.0);
    
    // Neck
    ctx.fillStyle = '#111';
    ctx.fillRect(-size*0.2, 0, size*0.4, size*1.0);
    
    // Head
    ctx.translate(0, -size * 0.4);
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.moveTo(-size*0.3, 0);
    ctx.lineTo(size*0.3, 0);
    ctx.lineTo(0, -size*0.8);
    ctx.fill();
    
    // Eye (Static Glow)
    DrawUtils.drawGlow(ctx, 3, '#8a2be2', 0.8);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, -size*0.4, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // --- HEAD 2: FIRE (Right) ---
    ctx.save();
    ctx.rotate(0.3);
    ctx.translate(0, -size * 1.0);
    
    // Neck
    ctx.fillStyle = '#300';
    ctx.fillRect(-size*0.2, 0, size*0.4, size*1.0);
    
    // Head
    ctx.translate(0, -size * 0.4);
    ctx.fillStyle = '#600';
    ctx.beginPath();
    ctx.moveTo(-size*0.3, 0);
    ctx.lineTo(size*0.3, 0);
    ctx.lineTo(0, -size*0.8);
    ctx.fill();
    
    // Eye (Static Glow)
    DrawUtils.drawGlow(ctx, 3, '#ffaa00', 0.8);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, -size*0.4, 3, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.restore();
  }
};
