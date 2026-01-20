
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const HorrorStalkerArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    
    // Glitch Effect (Random lateral shifts)
    if (Math.random() > 0.9) {
        const shift = (Math.random() - 0.5) * 5;
        ctx.translate(shift, 0);
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; // Ghost trail
        ctx.fillRect(-size/4, -size*2, size/2, size*3);
    }

    // Tall Sway
    const sway = Math.sin(time * 2) * 0.05;
    ctx.rotate(sway);

    // Suit/Body (Very thin)
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 1.5);
    ctx.lineTo(size * 0.2, -size * 1.5);
    ctx.lineTo(size * 0.15, size * 0.5); // Taper waist
    ctx.lineTo(size * 0.25, size * 2.0); // Leg R
    ctx.lineTo(0, size * 1.0); // Crotch
    ctx.lineTo(-size * 0.25, size * 2.0); // Leg L
    ctx.lineTo(-size * 0.15, size * 0.5);
    ctx.fill();

    // Arms (Long, reaching)
    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Left Arm
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 1.4);
    ctx.lineTo(-size * 0.8, -size * 0.5); // Elbow
    ctx.lineTo(-size * 0.6, size * 0.8 + Math.sin(time*3)*5); // Hand
    ctx.stroke();

    // Right Arm
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 1.4);
    ctx.lineTo(size * 0.8, -size * 0.5);
    ctx.lineTo(size * 0.6, size * 0.8 + Math.cos(time*3)*5);
    ctx.stroke();

    // Head (Blank White)
    ctx.save();
    ctx.translate(0, -size * 1.6);
    // Neck
    ctx.fillStyle = '#fff';
    ctx.fillRect(-2, 0, 4, 5);
    
    // Face
    const faceGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, size * 0.4);
    faceGrad.addColorStop(0, '#fff');
    faceGrad.addColorStop(1, '#ddd');
    ctx.fillStyle = faceGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.3, size * 0.4, 0, 0, Math.PI*2);
    ctx.fill();
    
    // No facial features (The Horror)
    // Maybe static fuzz?
    if (Math.random() > 0.8) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(-5, -5, 10, 2);
    }

    ctx.restore();

    // Tentacles (Back)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for(let i=0; i<4; i++) {
        const t = time + i;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(
            Math.sin(t) * 20, 
            -size - 20, 
            Math.cos(t * 2) * 30, 
            -size - 40
        );
        ctx.stroke();
    }

    ctx.restore();
  }
};
