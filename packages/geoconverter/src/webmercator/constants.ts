// converters/webmercator-converter/constants.ts

export const EARTH_RADIUS = 6378137; // meters (Web Mercator standard)

export const MAX_LATITUDE = 85.05112877980659; // degrees

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function clampLatitude(latDeg: number): number {
  return Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, latDeg));
}
