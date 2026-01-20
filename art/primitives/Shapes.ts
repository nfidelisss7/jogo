
export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  vertices: { x: number; y: number }[]
) => {
  if (vertices.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

export const getJaggedVertices = (
  sides: number,
  radius: number,
  jitter: number,
  time: number
) => {
  const verts = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const offset = Math.sin(time + i) * jitter;
    verts.push({
      x: Math.cos(angle) * (radius + offset),
      y: Math.sin(angle) * (radius + offset),
    });
  }
  return verts;
};
