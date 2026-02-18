# GeoConverter — Israeli Transverse Mercator (ITM / EPSG:2039)

Numerically stable, high-performance coordinate conversion library for ITM (Israel Transverse Mercator).

Designed for:
- GIS pipelines
- movement / trajectory processing
- mapping UIs
- large batch conversion (millions of points)

Live demo:
https://peterbak6.github.io/geoconverter/

---

## Install

```bash
npm install @peterbak6/geoconverter
```

## Usage

```ts
import { toItm, fromItm } from "@peterbak6/geoconverter";

const [E, N] = toItm(35.2, 31.7);
const [lon, lat] = fromItm(E, N);
```

High-performance (allocation-free):

```ts
import { toItmOut } from "@peterbak6/geoconverter";

const out = new Float64Array(2);
toItmOut(lon, lat, 0, out, 0);
```
