// converters/webmercator-converter/mercator.ts

import { EARTH_RADIUS, toRadians, toDegrees, clampLatitude } from "./constants";

/**
 * EPSG:4326 (lon/lat degrees) -> EPSG:3857 (x/y meters)
 * Latitude is silently clamped to Web Mercator limits.
 */
export function forwardMercator(
  lonDeg: number,
  latDeg: number
): [number, number] {
  const latClamped = clampLatitude(latDeg);

  const λ = toRadians(lonDeg);
  const φ = toRadians(latClamped);

  const x = EARTH_RADIUS * λ;
  const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + φ / 2));

  return [x, y];
}

/**
 * EPSG:3857 (x/y meters) -> EPSG:4326 (lon/lat degrees)
 */
export function inverseMercator(x: number, y: number): [number, number] {
  const λ = x / EARTH_RADIUS;
  const φ = 2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2;

  return [toDegrees(λ), toDegrees(φ)];
}
