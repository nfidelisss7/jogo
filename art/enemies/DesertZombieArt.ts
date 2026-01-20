
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const DesertZombieArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Shambling Tilt
    const tilt = Math.sin(time * 3) * 0.2;
    ctx.rotate(tilt);

    const colorSkin = '#8b7e66'; // Dried skin
    const colorBandage = '#dcd3b8'; // Dirty white

    // Legs
    ctx.fillStyle = colorSkin;
    ctx.fillRect(-6, 5, 4, 10);
    ctx.fillRect(2, 5, 4, 10);

    // Torso
    ctx.fillStyle = colorSkin;
    ctx.fillRect(-8, -10, 16, 18);
    
    // Bandages (Stripes)
    ctx.fillStyle = colorBandage;
    for(let i=0; i<4; i++) {
        ctx.fillRect(-9, -8 + (i * 4), 18, 2);
    }
    // Loose bandage trailing
    ctx.strokeStyle = colorBandage;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(15 + Math.sin(time*5)*5, 5, 12, 10);
    ctx.stroke();

    // Arms (Outstretched)
    ctx.save();
    ctx.translate(0, -5);
    ctx.rotate(Math.sin(time * 4) * 0.1); // Sway arms
    
    // Left Arm
    ctx.fillStyle = colorSkin;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-18, -2);
    ctx.lineTo(-18, 3);
    ctx.lineTo(-8, 5);
    ctx.fill();
    
    // Right Arm
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(18, -2);
    ctx.lineTo(18, 3);
    ctx.lineTo(8, 5);
    ctx.fill();
    ctx.restore();

    // Head
    ctx.save();
    ctx.translate(tilt * 5, -12); // Neck lag
    ctx.fillStyle = colorSkin;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    
    // Bandage on head
    ctx.fillStyle = colorBandage;
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, -0.5, 2.5);
    ctx.lineTo(0,0);
    ctx.fill();

    // One glowing eye
    DrawUtils.drawEye(ctx, 3, -2, 2, '#ffaa00');
    // Missing eye (dark spot)
    ctx.fillStyle = '#221';
    ctx.beginPath();
    ctx.arc(-3, -2, 2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    // Dust Cloud (Feet)
    ctx.fillStyle = 'rgba(194, 178, 128, 0.4)';
    const dX = Math.sin(time * 10) * 10;
    ctx.beginPath();
    ctx.arc(dX, 15, 4, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};
