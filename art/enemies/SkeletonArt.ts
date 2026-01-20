
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const SkeletonArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    
    // Rattle animation
    const rattle = Math.sin(time * 25) * 0.5;
    ctx.translate(rattle, 0);

    const boneColor = '#e0e0e0';
    const jointColor = '#aaa';

    // Pelvis
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.moveTo(-5, size * 0.5);
    ctx.lineTo(5, size * 0.5);
    ctx.lineTo(0, size * 0.8);
    ctx.fill();

    // Spine (Segments)
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = boneColor;
        ctx.fillRect(-2, -size * 0.2 + (i * 6), 4, 4);
    }

    // Ribcage
    ctx.strokeStyle = boneColor;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        const yPos = -size * 0.3 + i * 5;
        ctx.beginPath();
        ctx.moveTo(-8, yPos);
        ctx.quadraticCurveTo(0, yPos + 3, 8, yPos);
        ctx.stroke();
    }

    // Skull
    ctx.save();
    ctx.translate(0, -size * 0.6);
    // Bob head
    ctx.translate(0, Math.sin(time * 10) * 1);
    
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(0, -2, 9, 0, Math.PI * 2);
    ctx.fill();
    // Jaw
    ctx.fillRect(-5, 4, 10, 4);
    
    // Eyes
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-3, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(3, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sword Arm
    ctx.save();
    ctx.translate(10, -5);
    const swing = Math.sin(time * 5) * 0.5;
    ctx.rotate(swing);
    
    // Humerus
    ctx.strokeStyle = boneColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(5, 10);
    ctx.stroke();

    // Sword
    ctx.translate(5, 10);
    ctx.rotate(-Math.PI / 2);
    const metalGrad = DrawUtils.createMetallicGradient(ctx, 10, '#ddd', '#fff');
    ctx.fillStyle = metalGrad;
    
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(20, 0); // Tip
    ctx.lineTo(0, 2);
    ctx.fill();
    // Hilt
    ctx.fillStyle = '#432';
    ctx.fillRect(-5, -3, 5, 6);
    // Guard
    ctx.fillStyle = '#654';
    ctx.fillRect(-2, -6, 2, 12);
    
    ctx.restore();

    // Shield/Off Arm
    ctx.save();
    ctx.translate(-10, -5);
    ctx.rotate(-Math.sin(time * 5) * 0.2);
    ctx.fillStyle = boneColor;
    ctx.fillRect(-2, 0, 4, 10); // Bone
    // Tattered shield
    ctx.translate(-2, 10);
    ctx.fillStyle = '#533';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#322';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
};
