// src/converters/itm-converter/convert.ts

import { GRS80, WGS84, ITM_TM, ISRAEL93_TO_WGS84 } from "./itm";
import {
  geodeticToGeodeticWithHelmertOut,
  geodeticToGeodeticWithInverseHelmertOut,
} from "./helmert";
import { tmForwardOut, tmInverseOut } from "./tm";

/**
 * Tuple API (kept): WGS84 lon/lat (+optional height) -> ITM E/N
 */
export function toItm(
  lonDeg: number,
  latDeg: number,
  hMeters = 0
): [number, number] {
  const out = new Float64Array(2);
  toItmOut(lonDeg, latDeg, hMeters, out, 0);
  return [out[0], out[1]];
}

/**
 * Tuple API (kept): ITM E/N -> WGS84 lon/lat (+optional height used in datum shift)
 */
export function fromItm(
  easting: number,
  northing: number,
  hMeters = 0
): [number, number] {
  const out = new Float64Array(2);
  fromItmOut(easting, northing, hMeters, out, 0);
  return [out[0], out[1]];
}

/**
 * Reusable scratch to avoid per-call allocations in Out APIs.
 * Layout:
 *  scratch[0..1]   = lon/lat intermediate
 *  scratch[2..4]   = ECEF xyz scratch
 */
const _scratch = new Float64Array(5);

/**
 * Allocation-free: WGS84 lon/lat -> ITM E/N.
 * Writes [E,N] into `out` at [offset, offset+1].
 */
export function toItmOut(
  lonDeg: number,
  latDeg: number,
  hMeters: number,
  out: Float64Array,
  offset = 0
): void {
  // WGS84 -> Israel 1993 (GRS80) geodetic
  geodeticToGeodeticWithInverseHelmertOut(
    WGS84,
    GRS80,
    ISRAEL93_TO_WGS84,
    lonDeg,
    latDeg,
    hMeters,
    _scratch,
    0,
    _scratch,
    2
  );

  // Israel 1993 geodetic -> ITM projected
  tmForwardOut(GRS80, ITM_TM, _scratch[0], _scratch[1], out, offset);
}

/**
 * Allocation-free: ITM E/N -> WGS84 lon/lat.
 * Writes [lon,lat] into `out` at [offset, offset+1].
 */
export function fromItmOut(
  easting: number,
  northing: number,
  hMeters: number,
  out: Float64Array,
  offset = 0
): void {
  // ITM projected -> Israel 1993 geodetic
  tmInverseOut(GRS80, ITM_TM, easting, northing, _scratch, 0);

  // Israel 1993 -> WGS84
  geodeticToGeodeticWithHelmertOut(
    GRS80,
    WGS84,
    ISRAEL93_TO_WGS84,
    _scratch[0],
    _scratch[1],
    hMeters,
    out,
    offset,
    _scratch,
    2
  );
}
