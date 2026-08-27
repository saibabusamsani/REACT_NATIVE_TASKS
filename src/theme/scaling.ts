export const BREAKPOINT_TABLET = 600;
export const GUIDELINE_BASE = 375;
export const MIN_RATIO = 0.85;
export const MAX_RATIO = 1.25;

export const scaleRecord = <T extends Record<string, number>>(
  obj: T,
  scale: (n: number) => number
): Record<keyof T, number> =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, scale(v)])) as Record<keyof T, number>;

export function getScaleFns(width: number, height: number) {
  const shortDimension = Math.min(width, height);
  const isLandscape = width > height;
  const isTablet = shortDimension >= BREAKPOINT_TABLET;

  const rawRatio = shortDimension / GUIDELINE_BASE;
  const clampedRatio = Math.min(Math.max(rawRatio, MIN_RATIO), MAX_RATIO);

  const scale = (size: number) => clampedRatio * size;
  const moderateScale = (size: number, factor = 0.5) => {
    const scaleFactor = isLandscape ? factor * 0.6 : factor;
    return size + (scale(size) - size) * scaleFactor;
  };

  return { isLandscape, isTablet, scale, moderateScale };
}