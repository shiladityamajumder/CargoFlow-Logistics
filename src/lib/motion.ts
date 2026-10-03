/** CSS cubic Bézier easing, shared with the measured scroll timeline. */
export function bezierEase(x1: number, y1: number, x2: number, y2: number) {
  const coordinate = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  return (progress: number) => {
    const value = Math.min(1, Math.max(0, progress));
    if (value === 0 || value === 1) return value;
    let low = 0;
    let high = 1;
    for (let i = 0; i < 18; i++) {
      const middle = (low + high) / 2;
      if (coordinate(middle, x1, x2) < value) low = middle;
      else high = middle;
    }
    return coordinate((low + high) / 2, y1, y2);
  };
}

export const globeEase = bezierEase(0.42, 0, 0.58, 1);
export const routeEase = bezierEase(0.25, 0.1, 0.25, 1);
