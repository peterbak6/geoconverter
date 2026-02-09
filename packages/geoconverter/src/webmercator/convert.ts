// converters/webmercator-converter/convert.ts

import { forwardMercator, inverseMercator } from "./mercator";

/**
 * WGS84 / EPSG:4326 -> Web Mercator / EPSG:3857
 */
export function toWebMercator(
  lonDeg: number,
  latDeg: number
): [number, number] {
  return forwardMercator(lonDeg, latDeg);
}

/**
 * Web Mercator / EPSG:3857 -> WGS84 / EPSG:4326
 */
export function fromWebMercator(x: number, y: number): [number, number] {
  return inverseMercator(x, y);
}
