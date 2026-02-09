// converters/itm-converter/tm.ts

import { Ellipsoid, toRadians, toDegrees } from "./ellipsoid";

export type TMParams = Readonly<{
  lon0Deg: number; // central meridian (degrees)
  lat0Deg: number; // latitude of origin (degrees)
  k0: number;
  falseEasting: number;
  falseNorthing: number;
}>;

function meridionalArc(ell: Ellipsoid, latRad: number): number {
  const e2 = ell.e2;
  const e4 = e2 * e2;
  const e6 = e4 * e2;

  const A0 = 1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256;
  const A2 = (3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024;
  const A4 = (15 * e4) / 256 + (45 * e6) / 1024;
  const A6 = (35 * e6) / 3072;

  return (
    ell.a *
    (A0 * latRad -
      A2 * Math.sin(2 * latRad) +
      A4 * Math.sin(4 * latRad) -
      A6 * Math.sin(6 * latRad))
  );
}

/** Tuple API (kept) */
export function tmForward(
  ell: Ellipsoid,
  p: TMParams,
  lonDeg: number,
  latDeg: number
): [number, number] {
  const out = new Float64Array(2);
  tmForwardOut(ell, p, lonDeg, latDeg, out, 0);
  return [out[0], out[1]];
}

/** Allocation-free */
export function tmForwardOut(
  ell: Ellipsoid,
  p: TMParams,
  lonDeg: number,
  latDeg: number,
  outEN: Float64Array,
  offset = 0
): void {
  const φ = toRadians(latDeg);
  const λ = toRadians(lonDeg);

  const φ0 = toRadians(p.lat0Deg);
  const λ0 = toRadians(p.lon0Deg);

  const sinφ = Math.sin(φ);
  const cosφ = Math.cos(φ);
  const tanφ = sinφ / cosφ;

  const N = ell.a / Math.sqrt(1 - ell.e2 * sinφ * sinφ);
  const T = tanφ * tanφ;
  const C = ell.ep2 * cosφ * cosφ;
  const A = (λ - λ0) * cosφ;

  const A2 = A * A;
  const A3 = A2 * A;
  const A5 = A3 * A2;

  const M = meridionalArc(ell, φ);
  const M0 = meridionalArc(ell, φ0);

  const x =
    p.falseEasting +
    p.k0 *
      N *
      (A +
        ((1 - T + C) * A3) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ell.ep2) * A5) / 120);

  const A4 = A2 * A2;
  const A6 = A3 * A3;

  const y =
    p.falseNorthing +
    p.k0 *
      (M -
        M0 +
        N *
          tanφ *
          (A2 / 2 +
            ((5 - T + 9 * C + 4 * C * C) * A4) / 24 +
            ((61 - 58 * T + T * T + 600 * C - 330 * ell.ep2) * A6) / 720));

  outEN[offset] = x;
  outEN[offset + 1] = y;
}

/** Tuple API (kept) */
export function tmInverse(
  ell: Ellipsoid,
  p: TMParams,
  x: number,
  y: number
): [number, number] {
  const out = new Float64Array(2);
  tmInverseOut(ell, p, x, y, out, 0);
  return [out[0], out[1]];
}

/** Allocation-free */
export function tmInverseOut(
  ell: Ellipsoid,
  p: TMParams,
  x: number,
  y: number,
  outLonLat: Float64Array,
  offset = 0
): void {
  const x_ = x - p.falseEasting;
  const y_ = y - p.falseNorthing;

  const φ0 = toRadians(p.lat0Deg);
  const λ0 = toRadians(p.lon0Deg);

  const M0 = meridionalArc(ell, φ0);
  const M_ = y_ / p.k0 + M0;

  const e2 = ell.e2;
  const e4 = e2 * e2;
  const e6 = e4 * e2;

  const mu = M_ / (ell.a * (1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256));

  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const e12 = e1 * e1;
  const e13 = e12 * e1;
  const e14 = e12 * e12;

  const J1 = (3 * e1) / 2 - (27 * e13) / 32;
  const J2 = (21 * e12) / 16 - (55 * e14) / 32;
  const J3 = (151 * e13) / 96;
  const J4 = (1097 * e14) / 512;

  const fp =
    mu +
    J1 * Math.sin(2 * mu) +
    J2 * Math.sin(4 * mu) +
    J3 * Math.sin(6 * mu) +
    J4 * Math.sin(8 * mu);

  const sinfp = Math.sin(fp);
  const cosfp = Math.cos(fp);
  const tanfp = sinfp / cosfp;

  const C1 = ell.ep2 * cosfp * cosfp;
  const T1 = tanfp * tanfp;

  const N1 = ell.a / Math.sqrt(1 - ell.e2 * sinfp * sinfp);
  const R1 = (ell.a * (1 - ell.e2)) / Math.pow(1 - ell.e2 * sinfp * sinfp, 1.5);

  const D = x_ / (N1 * p.k0);

  const D2 = D * D;
  const D3 = D2 * D;
  const D4 = D2 * D2;
  const D5 = D4 * D;
  const D6 = D3 * D3;

  const lat =
    fp -
    ((N1 * tanfp) / R1) *
      (D2 / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ell.ep2) * D4) / 24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 * T1 -
          252 * ell.ep2 -
          3 * C1 * C1) *
          D6) /
          720);

  const lon =
    λ0 +
    (D -
      ((1 + 2 * T1 + C1) * D3) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ell.ep2 + 24 * T1 * T1) * D5) /
        120) /
      cosfp;

  outLonLat[offset] = toDegrees(lon);
  outLonLat[offset + 1] = toDegrees(lat);
}
