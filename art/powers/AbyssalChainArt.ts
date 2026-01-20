import { ProceduralArt } from '../../types';

export const AbyssalChainArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Chain Links
    const links = 5;
    const linkSize = size * 0.8;
    
    ctx.strokeStyle = '#440088';
    ctx.lineWidth = 3;

    for(let i=0; i<links; i++) {
        const offset = Math.sin(time * 10 + i) * 3;
        const xPos = -i * (linkSize * 1.2);
        
        ctx.save();
        ctx.translate(xPos, offset);
        if (i % 2 === 0) {
            ctx.strokeRect(-linkSize/2, -linkSize/3, linkSize, linkSize * 0.66);
        } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, linkSize/2, linkSize/3, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Hook/Head
    ctx.fillStyle = '#8800ff';
    drawPolygon(ctx, [
        { x: size, y: 0 },
        { x: 0, y: -size * 0.5 },
        { x: -size * 0.2, y: 0 },
        { x: 0, y: size * 0.5 }
    ]);

    ctx.restore();
  }
};

function drawPolygon(ctx: CanvasRenderingContext2D, pts: {x:number, y:number}[]) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for(let i=1; i<pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}