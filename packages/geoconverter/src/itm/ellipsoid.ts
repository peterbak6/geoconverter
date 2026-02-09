// converters/itm-converter/ellipsoid.ts

export type Ellipsoid = Readonly<{
  a: number; // semi-major axis
  f: number; // flattening
  b: number; // semi-minor axis
  e2: number; // first eccentricity squared
  ep2: number; // second eccentricity squared = e2 / (1 - e2)
}>;

export function makeEllipsoid(a: number, f: number): Ellipsoid {
  const b = a * (1 - f);
  const e2 = (a * a - b * b) / (a * a);
  const ep2 = e2 / (1 - e2);
  return Object.freeze({ a, f, b, e2, ep2 });
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export type Vec3 = [number, number, number];

/** Tuple API (kept) */
export function geodeticToECEF(
  ell: Ellipsoid,
  lonDeg: number,
  latDeg: number,
  h = 0
): Vec3 {
  const out = new Float64Array(3);
  geodeticToECEFOut(ell, lonDeg, latDeg, h, out, 0);
  return [out[0], out[1], out[2]];
}

/** Allocation-free */
export function geodeticToECEFOut(
  ell: Ellipsoid,
  lonDeg: number,
  latDeg: number,
  h: number,
  out: Float64Array,
  offset = 0
): void {
  const λ = toRadians(lonDeg);
  const φ = toRadians(latDeg);

  const sinφ = Math.sin(φ);
  const cosφ = Math.cos(φ);
  const sinλ = Math.sin(λ);
  const cosλ = Math.cos(λ);

  const N = ell.a / Math.sqrt(1 - ell.e2 * sinφ * sinφ);

  out[offset] = (N + h) * cosφ * cosλ;
  out[offset + 1] = (N + h) * cosφ * sinλ;
  out[offset + 2] = ((1 - ell.e2) * N + h) * sinφ;
}

/** Tuple API (kept) */
export function ecefToGeodetic(
  ell: Ellipsoid,
  x: number,
  y: number,
  z: number
): [number, number] {
  const out = new Float64Array(2);
  ecefToGeodeticOut(ell, x, y, z, out, 0);
  return [out[0], out[1]];
}

/** Allocation-free (lon/lat only) */
export function ecefToGeodeticOut(
  ell: Ellipsoid,
  x: number,
  y: number,
  z: number,
  out: Float64Array,
  offset = 0
): void {
  const p = Math.hypot(x, y);
  const θ = Math.atan2(z * ell.a, p * ell.b);

  const sinθ = Math.sin(θ);
  const cosθ = Math.cos(θ);

  const sinθ3 = sinθ * sinθ * sinθ;
  const cosθ3 = cosθ * cosθ * cosθ;

  const lat = Math.atan2(
    z + ell.ep2 * ell.b * sinθ3,
    p - ell.e2 * ell.a * cosθ3
  );

  const lon = Math.atan2(y, x);

  out[offset] = toDegrees(lon);
  out[offset + 1] = toDegrees(lat);
}
