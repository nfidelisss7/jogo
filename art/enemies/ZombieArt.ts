
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const ZombieArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Wobble walk
    const wobble = Math.sin(time * 3) * 0.2;
    ctx.rotate(wobble);
    
    const isKing = state?.isKing;
    const skinBase = isKing ? '#3a443a' : '#556655';
    const skinDark = isKing ? '#202a20' : '#334433';

    // Legs (Dragging)
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.rect(-size*0.4, size*0.5, size*0.3, size*0.8); // Left Leg
    ctx.rect(size*0.1, size*0.5, size*0.3, size*0.8); // Right Leg (Dragging)
    ctx.fill();

    // Body
    const grad = DrawUtils.createFleshGradient(ctx, size, skinBase, skinDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-size*0.6, -size*0.8); // Shoulder L
    ctx.lineTo(size*0.7, -size*0.7); // Shoulder R (Sagging)
    ctx.lineTo(size*0.5, size*0.6); // Hip R
    ctx.lineTo(-size*0.5, size*0.6); // Hip L
    ctx.fill();

    // Ribs exposed?
    ctx.fillStyle = '#aa5555';
    ctx.beginPath();
    ctx.arc(size*0.2, 0, size*0.2, 0, Math.PI*2);
    ctx.fill();

    // Arms
    ctx.strokeStyle = skinBase;
    ctx.lineWidth = 4;
    // Left Arm (Reaching)
    ctx.beginPath();
    ctx.moveTo(-size*0.6, -size*0.7);
    ctx.lineTo(-size*0.8, size*0.2);
    ctx.stroke();
    // Right Arm (Broken)
    ctx.beginPath();
    ctx.moveTo(size*0.6, -size*0.6);
    ctx.lineTo(size*0.8, -size*0.2);
    ctx.stroke();

    // Head
    ctx.save();
    ctx.translate(wobble * 10, -size * 0.9);
    ctx.rotate(Math.sin(time * 5) * 0.1);
    ctx.fillStyle = skinBase;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    
    // Jaw hanging
    ctx.fillStyle = '#221111';
    ctx.beginPath();
    ctx.arc(size*0.1, size*0.2, size*0.2, 0, Math.PI);
    ctx.fill();

    // Eyes (One missing)
    DrawUtils.drawEye(ctx, -size*0.15, -size*0.1, 2, '#ffffff'); // Left eye blank
    ctx.fillStyle = '#110000'; // Right eye socket empty
    ctx.beginPath();
    ctx.arc(size*0.15, -size*0.1, 2, 0, Math.PI*2);
    ctx.fill();

    // King Crown
    if (isKing) {
        ctx.fillStyle = '#cd7f32'; // Rusted bronze
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-5, -20);
        ctx.lineTo(0, -10);
        ctx.lineTo(5, -20);
        ctx.lineTo(10, -10);
        ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }
};
