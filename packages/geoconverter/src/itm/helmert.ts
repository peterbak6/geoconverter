// src/converters/itm-converter/helmert.ts

import { Ellipsoid, geodeticToECEFOut, ecefToGeodeticOut } from "./ellipsoid";

export type HelmertParams = Readonly<{
  dx: number;
  dy: number;
  dz: number;
  rx: number; // radians
  ry: number; // radians
  rz: number; // radians
  ds: number; // unitless
}>;

export function arcsecToRad(arcsec: number): number {
  return arcsec * (Math.PI / (180 * 3600));
}

export function ppmToScale(ppm: number): number {
  return ppm * 1e-6;
}

/** Tuple API (kept) */
export function helmertECEF(
  p: HelmertParams,
  x: number,
  y: number,
  z: number
): [number, number, number] {
  const out = new Float64Array(3);
  helmertECEFOut(p, x, y, z, out, 0);
  return [out[0], out[1], out[2]];
}

/** Allocation-free */
export function helmertECEFOut(
  p: HelmertParams,
  x: number,
  y: number,
  z: number,
  out: Float64Array,
  offset = 0
): void {
  const { dx, dy, dz, rx, ry, rz, ds } = p;

  const xRot = -rz * y + ry * z;
  const yRot = rz * x - rx * z;
  const zRot = -ry * x + rx * y;

  const k = 1 + ds;

  out[offset] = dx + k * (x + xRot);
  out[offset + 1] = dy + k * (y + yRot);
  out[offset + 2] = dz + k * (z + zRot);
}

/** Tuple API (kept) */
export function inverseHelmertECEF(
  p: HelmertParams,
  x2: number,
  y2: number,
  z2: number
): [number, number, number] {
  const out = new Float64Array(3);
  inverseHelmertECEFOut(p, x2, y2, z2, out, 0);
  return [out[0], out[1], out[2]];
}

/** Allocation-free */
export function inverseHelmertECEFOut(
  p: HelmertParams,
  x2: number,
  y2: number,
  z2: number,
  out: Float64Array,
  offset = 0
): void {
  const { dx, dy, dz, rx, ry, rz, ds } = p;

  // Remove translations
  const xt = x2 - dx;
  const yt = y2 - dy;
  const zt = z2 - dz;

  // Remove scale
  const k = 1 + ds;
  const xs = xt / k;
  const ys = yt / k;
  const zs = zt / k;

  // Remove rotation (inverse small-angle)
  out[offset] = xs + rz * ys - ry * zs;
  out[offset + 1] = ys - rz * xs + rx * zs;
  out[offset + 2] = zs + ry * xs - rx * ys;
}

/** Tuple API (kept) */
export function geodeticToGeodeticWithHelmert(
  srcEll: Ellipsoid,
  dstEll: Ellipsoid,
  p: HelmertParams,
  lonDeg: number,
  latDeg: number,
  h = 0
): [number, number] {
  const out = new Float64Array(2);
  const scratch = new Float64Array(3);
  geodeticToGeodeticWithHelmertOut(
    srcEll,
    dstEll,
    p,
    lonDeg,
    latDeg,
    h,
    out,
    0,
    scratch,
    0
  );
  return [out[0], out[1]];
}

/** Allocation-free (needs scratch 3 floats for ECEF) */
export function geodeticToGeodeticWithHelmertOut(
  srcEll: Ellipsoid,
  dstEll: Ellipsoid,
  p: HelmertParams,
  lonDeg: number,
  latDeg: number,
  h: number,
  outLonLat: Float64Array,
  outOffset = 0,
  scratch3: Float64Array,
  scratchOffset = 0
): void {
  // scratch3[s..s+2] = x,y,z
  geodeticToECEFOut(srcEll, lonDeg, latDeg, h, scratch3, scratchOffset);

  const x = scratch3[scratchOffset];
  const y = scratch3[scratchOffset + 1];
  const z = scratch3[scratchOffset + 2];

  helmertECEFOut(p, x, y, z, scratch3, scratchOffset);

  ecefToGeodeticOut(
    dstEll,
    scratch3[scratchOffset],
    scratch3[scratchOffset + 1],
    scratch3[scratchOffset + 2],
    outLonLat,
    outOffset
  );
}

/** Tuple API (kept) */
export function geodeticToGeodeticWithInverseHelmert(
  srcEll: Ellipsoid,
  dstEll: Ellipsoid,
  p: HelmertParams,
  lonDeg: number,
  latDeg: number,
  h = 0
): [number, number] {
  const out = new Float64Array(2);
  const scratch = new Float64Array(3);
  geodeticToGeodeticWithInverseHelmertOut(
    srcEll,
    dstEll,
    p,
    lonDeg,
    latDeg,
    h,
    out,
    0,
    scratch,
    0
  );
  return [out[0], out[1]];
}

/** Allocation-free (needs scratch 3 floats for ECEF) */
export function geodeticToGeodeticWithInverseHelmertOut(
  srcEll: Ellipsoid,
  dstEll: Ellipsoid,
  p: HelmertParams,
  lonDeg: number,
  latDeg: number,
  h: number,
  outLonLat: Float64Array,
  outOffset = 0,
  scratch3: Float64Array,
  scratchOffset = 0
): void {
  geodeticToECEFOut(srcEll, lonDeg, latDeg, h, scratch3, scratchOffset);

  inverseHelmertECEFOut(
    p,
    scratch3[scratchOffset],
    scratch3[scratchOffset + 1],
    scratch3[scratchOffset + 2],
    scratch3,
    scratchOffset
  );

  ecefToGeodeticOut(
    dstEll,
    scratch3[scratchOffset],
    scratch3[scratchOffset + 1],
    scratch3[scratchOffset + 2],
    outLonLat,
    outOffset
  );
}
