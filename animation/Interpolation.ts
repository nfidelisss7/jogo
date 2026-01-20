
export const Lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const EaseOutQuad = (t: number): number => {
  return t * (2 - t);
};

export const EaseInQuad = (t: number): number => {
  return t * t;
};

export const SmoothStep = (t: number): number => {
  return t * t * (3 - 2 * t);
};
