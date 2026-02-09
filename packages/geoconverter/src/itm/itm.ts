// converters/itm-converter/itm.ts

import { makeEllipsoid } from "./ellipsoid";
import { HelmertParams, arcsecToRad, ppmToScale } from "./helmert";
import { TMParams } from "./tm";

/**
 * ITM / Israel 1993 / EPSG:2039 core projection parameters.
 * Values match the ITM definition shown on Wikipedia / EPSG references. :contentReference[oaicite:1]{index=1}
 */
export const GRS80 = makeEllipsoid(6378137.0, 1 / 298.257222101);
export const WGS84 = makeEllipsoid(6378137.0, 1 / 298.257223563);

export const ITM_TM: TMParams = Object.freeze({
  k0: 1.0000067,
  lon0Deg: 35.2045169444444,
  lat0Deg: 31.7343936111111,
  falseEasting: 219529.584,
  falseNorthing: 626907.39,
});

/**
 * Helmert parameters "for conversion to WGS84" as listed on the ITM page. :contentReference[oaicite:2]{index=2}
 * Rotations are arc-seconds; scale is ppm.
 */
export const ISRAEL93_TO_WGS84: HelmertParams = Object.freeze({
  dx: 23.772,
  dy: 17.49,
  dz: 17.859,
  rx: arcsecToRad(-0.3132),
  ry: arcsecToRad(-1.85274),
  rz: arcsecToRad(1.67299),
  ds: ppmToScale(-5.4262),
});
