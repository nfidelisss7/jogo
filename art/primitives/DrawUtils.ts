
export class DrawUtils {
  
  static drawShadow(ctx: CanvasRenderingContext2D, size: number) {
    ctx.save();
    ctx.scale(1, 0.3);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, size * 2, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  static createMetallicGradient(ctx: CanvasRenderingContext2D, size: number, colorBase: string, colorHighlight: string) {
    const grad = ctx.createLinearGradient(-size, -size, size, size);
    grad.addColorStop(0, colorBase);
    grad.addColorStop(0.4, colorHighlight);
    grad.addColorStop(0.6, colorBase);
    grad.addColorStop(1, '#000');
    return grad;
  }

  static createFleshGradient(ctx: CanvasRenderingContext2D, size: number, colorPrimary: string, colorShadow: string) {
    const grad = ctx.createRadialGradient(-size*0.3, -size*0.3, size*0.2, 0, 0, size);
    grad.addColorStop(0, colorPrimary);
    grad.addColorStop(1, colorShadow);
    return grad;
  }

  static drawGlow(ctx: CanvasRenderingContext2D, size: number, color: string, strength: number = 1) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha *= strength;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  static drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.save();
    ctx.translate(x, y);
    // Socket
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, size + 1, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(-size*0.3, -size*0.3, size*0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  static drawSpike(ctx: CanvasRenderingContext2D, length: number, width: number) {
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.lineTo(0, -length);
    ctx.lineTo(width/2, 0);
    ctx.fill();
  }
}