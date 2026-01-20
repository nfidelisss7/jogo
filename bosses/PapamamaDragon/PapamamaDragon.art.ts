
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../../art/primitives/DrawUtils';

export const PapamamaDragonArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Flight Hover
    const hover = Math.sin(time * 2) * 10;
    ctx.translate(0, hover);

    const isPhase2 = (state?.phase || 1) > 1;
    
    // --- WINGS (Massive, Bat-like) ---
    ctx.save();
    ctx.translate(0, -size * 0.5);
    const flap = Math.sin(time * 3) * 0.2;
    
    // Left Wing (Black/Red webbing)
    ctx.save();
    ctx.rotate(flap);
    ctx.fillStyle = '#220000';
    ctx.strokeStyle = '#550000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 3, -size * 1.5); // Tip
    ctx.lineTo(-size * 2, size * 1.5);
    ctx.lineTo(-size * 1, size * 0.8);
    ctx.lineTo(0, size * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.scale(-1, 1);
    ctx.rotate(flap);
    ctx.fillStyle = '#220000';
    ctx.strokeStyle = '#550000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 3, -size * 1.5);
    ctx.lineTo(-size * 2, size * 1.5);
    ctx.lineTo(-size * 1, size * 0.8);
    ctx.lineTo(0, size * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // --- BODY (Scaled Bulk) ---
    const scaleColor = '#1a1a1a';
    const bellyColor = '#4a0000';
    
    ctx.fillStyle = scaleColor;
    ctx.beginPath();
    // Oval torso
    ctx.ellipse(0, 0, size * 1.2, size * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Belly scales
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.2, size * 0.8, size * 1.0, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- NECKS & HEADS ---
    
    // Head 1: Black (Void) - Left
    ctx.save();
    const neck1Sway = Math.sin(time * 2 + 1) * 0.1;
    ctx.rotate(-0.3 + neck1Sway);
    ctx.translate(0, -size * 1.2);
    
    // Neck
    ctx.fillStyle = '#111';
    ctx.fillRect(-size*0.3, 0, size*0.6, size*1.2);
    
    // Head
    ctx.translate(0, -size * 0.5);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(-size*0.4, 0);
    ctx.lineTo(size*0.4, 0);
    ctx.lineTo(0, -size*0.8); // Snout
    ctx.fill();
    
    // Eyes (Purple Void)
    DrawUtils.drawGlow(ctx, 3, '#8a2be2');
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-5, -size*0.4, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -size*0.4, 3, 0, Math.PI*2); ctx.fill();
    
    // Breath Particle (Idle)
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#8a2be2';
        ctx.fillRect((Math.random()-0.5)*10, -size*0.9, 3, 3);
    }
    ctx.restore();

    // Head 2: Red (Fire) - Right
    ctx.save();
    const neck2Sway = Math.sin(time * 2.5) * 0.1;
    ctx.rotate(0.3 + neck2Sway);
    ctx.translate(0, -size * 1.2);
    
    // Neck
    ctx.fillStyle = '#300';
    ctx.fillRect(-size*0.3, 0, size*0.6, size*1.2);
    
    // Head
    ctx.translate(0, -size * 0.5);
    ctx.fillStyle = '#600';
    ctx.beginPath();
    ctx.moveTo(-size*0.4, 0);
    ctx.lineTo(size*0.4, 0);
    ctx.lineTo(0, -size*0.8);
    ctx.fill();
    
    // Eyes (Yellow Fire)
    DrawUtils.drawGlow(ctx, 3, '#ffaa00');
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-5, -size*0.4, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -size*0.4, 3, 0, Math.PI*2); ctx.fill();

    // Breath Particle (Idle)
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#ff4400';
        ctx.fillRect((Math.random()-0.5)*10, -size*0.9, 3, 3);
    }
    ctx.restore();

    // --- TAIL ---
    ctx.save();
    ctx.translate(0, size * 1.2);
    const tailWhip = Math.sin(time * 4) * 0.2;
    ctx.rotate(tailWhip);
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(-size*0.3, 0);
    ctx.lineTo(size*0.3, 0);
    ctx.lineTo(0, size*2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
};
