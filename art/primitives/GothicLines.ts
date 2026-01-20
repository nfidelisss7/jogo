
export const drawSpikyLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  spikeCount: number,
  spikeHeight: number
) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const dx = x2 - x1;
  const dy = y2 - y1;
  for (let i = 1; i <= spikeCount; i++) {
    const px = x1 + (dx * i) / spikeCount;
    const py = y1 + (dy * i) / spikeCount;
    const nx = -dy / Math.sqrt(dx * dx + dy * dy);
    const ny = dx / Math.sqrt(dx * dx + dy * dy);
    const jitter = i % 2 === 0 ? spikeHeight : -spikeHeight;
    ctx.lineTo(px + nx * jitter, py + ny * jitter);
  }
  ctx.stroke();
};
