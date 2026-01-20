
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const DemonArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    
    // Aggressive breathing
    const breath = 1 + Math.sin(time * 8) * 0.05;
    ctx.scale(breath, breath);

    const skinColor = '#800000';
    const highlight = '#b03030';

    // Tail
    const tailWhip = Math.sin(time * 10) * 10;
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.quadraticCurveTo(-size, size + tailWhip, -size * 1.5, size * 0.5 + tailWhip);
    ctx.stroke();
    // Tail tip
    ctx.fillStyle = '#300';
    ctx.beginPath();
    ctx.moveTo(-size*1.5, size*0.5+tailWhip);
    ctx.lineTo(-size*1.7, size*0.4+tailWhip);
    ctx.lineTo(-size*1.6, size*0.7+tailWhip);
    ctx.fill();

    // Body (Upper Torso)
    const grad = DrawUtils.createFleshGradient(ctx, size, highlight, skinColor);
    ctx.fillStyle = grad;
    
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, -size * 0.8);
    ctx.lineTo(size * 0.6, -size * 0.8);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.4, size * 0.5);
    ctx.fill();

    // Magma Cracks
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.moveTo(-5, -10); ctx.lineTo(0, 0); ctx.lineTo(5, -5);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';

    // Head
    ctx.save();
    ctx.translate(0, -size * 0.9);
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.rect(-size*0.3, -size*0.3, size*0.6, size*0.6);
    ctx.fill();
    
    // Horns
    ctx.fillStyle = '#222';
    // Left
    ctx.beginPath(); ctx.moveTo(-size*0.2, -size*0.3); ctx.quadraticCurveTo(-size*0.6, -size*0.8, -size*0.3, -size*0.9); ctx.lineTo(-size*0.1, -size*0.3); ctx.fill();
    // Right
    ctx.beginPath(); ctx.moveTo(size*0.2, -size*0.3); ctx.quadraticCurveTo(size*0.6, -size*0.8, size*0.3, -size*0.9); ctx.lineTo(size*0.1, -size*0.3); ctx.fill();

    // Burning Eyes
    DrawUtils.drawGlow(ctx, 3, '#ff4400');
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(-5, -2, 3, 3);
    ctx.fillRect(2, -2, 3, 3);

    ctx.restore();

    // Arms
    ctx.fillStyle = skinColor;
    // Left
    ctx.save();
    ctx.translate(-size*0.6, -size*0.6);
    ctx.rotate(Math.sin(time*8)*0.5);
    ctx.fillRect(-5, 0, 10, size);
    ctx.restore();
    // Right
    ctx.save();
    ctx.translate(size*0.6, -size*0.6);
    ctx.rotate(-Math.sin(time*8)*0.5);
    ctx.fillRect(-5, 0, 10, size);
    ctx.restore();

    // Fire Particles
    ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
    for(let i=0; i<3; i++) {
        const pY = -size + Math.random() * size * 2;
        const pX = (Math.random()-0.5) * size;
        if (Math.random() > 0.5) {
            ctx.fillRect(pX, pY, 2, 2);
        }
    }

    ctx.restore();
  }
};
