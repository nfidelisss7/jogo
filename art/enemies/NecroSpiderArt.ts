
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const NecroSpiderArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    
    // Skitter jitter
    const jitterX = Math.sin(time * 30) * 1.5;
    const jitterY = Math.cos(time * 30) * 1.5;
    ctx.translate(jitterX, jitterY);

    // Legs (8) - Draw BEFORE body
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for(let i=0; i<8; i++) {
        const side = i < 4 ? -1 : 1; // Left or Right
        const idx = i % 4; // 0-3 front to back
        
        // Leg Animation Phase
        const legPhase = time * 15 + (idx % 2 === 0 ? 0 : Math.PI);
        const lift = Math.sin(legPhase) * 5;
        const reach = Math.cos(legPhase) * 3;
        
        const hipX = side * 5;
        const hipY = (idx - 1.5) * 5;
        
        const kneeX = hipX + (side * size * 0.8);
        const kneeY = hipY - 10 + Math.abs(lift)*0.5;
        
        const footX = kneeX + (side * size * 0.6) + reach;
        const footY = kneeY + 15 - Math.max(0, lift); // Lift foot only
        
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();
    }

    // Abdomen (Rear)
    ctx.save();
    ctx.translate(0, size * 0.5);
    const abdomenGrad = ctx.createRadialGradient(-3, -3, 0, 0, 0, size * 0.8);
    abdomenGrad.addColorStop(0, '#333');
    abdomenGrad.addColorStop(1, '#111');
    ctx.fillStyle = abdomenGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.7, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Hourglass Symbol
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.lineTo(0, 0); 
    ctx.lineTo(-4, 4); ctx.lineTo(4, 4); ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    // Cephalothorax (Head)
    ctx.save();
    ctx.translate(0, -size * 0.3);
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI*2);
    ctx.fill();
    
    // Many Eyes
    DrawUtils.drawEye(ctx, -4, -6, 2, '#f00');
    DrawUtils.drawEye(ctx, 4, -6, 2, '#f00');
    DrawUtils.drawEye(ctx, -7, -3, 1.5, '#f00');
    DrawUtils.drawEye(ctx, 7, -3, 1.5, '#f00');
    
    // Mandibles
    const bite = Math.abs(Math.sin(time * 10)) * 3;
    ctx.fillStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(-3, 3); ctx.lineTo(-6 - bite, 10); ctx.lineTo(-2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, 3); ctx.lineTo(6 + bite, 10); ctx.lineTo(2, 8);
    ctx.fill();
    
    ctx.restore();

    ctx.restore();
  }
};
