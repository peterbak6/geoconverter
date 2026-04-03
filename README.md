# GeoConverter

Fast, auditable coordinate conversion for:

- **ITM (EPSG:2039) ↔ WGS84 (EPSG:4326)**
- **Web Mercator (EPSG:3857) ↔ WGS84 (EPSG:4326)**

Designed for performance, transparency, and reproducibility.

**Live:**
[itm-geoconverter.pages.dev](https://itm-geoconverter.pages.dev/)

**Github:**
[Demo (interactive map +
benchmarks)](https://peterbak6.github.io/geoconverter)

**Website:**
[https://visualanalytics.co.il/geoconverter](https://visualanalytics.co.il/geoconverter)

---

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Math audited](https://img.shields.io/badge/Geodesy-Auditable-2ea44f)

---

## Why GeoConverter?

Most projection libraries:

- are black boxes
- optimized for flexibility, not speed
- hard to audit mathematically

GeoConverter is:

- ⚡ **Fast** --- optimized for large coordinate batches
- 📐 **Transparent** --- math matches EPSG definitions step-by-step
- 🧪 **Testable** --- roundtrip + proj4 comparisons included
- 🧭 **Deterministic** --- no hidden state

Built for:

- GIS pipelines
- simulation
- mapping tools
- mobility & geo analytics
- visualization engines

---

## Install

```bash
npm install @peterbak6/geoconverter
```

---

## Usage

### ITM (EPSG:2039)

```ts
import { toItm, fromItm } from "@peterbak6/geoconverter";

const [E, N] = toItm(35.503194, 32.547015);
const [lon, lat] = fromItm(E, N);
```

### High-performance variant (no tuple allocation)

```ts
import { toItmOut } from "@peterbak6/geoconverter";

const out = new Float64Array(2);
toItmOut(lon, lat, 0, out, 0);

const E = out[0];
const N = out[1];
```

### Web Mercator

```ts
import { toWebMercator, fromWebMercator } from "@peterbak6/geoconverter";

const [x, y] = toWebMercator(35.21, 31.77);
const [lon, lat] = fromWebMercator(x, y);
```

---

## Accuracy

Validated against Proj4 using the official EPSG:2039 definition.

Metrics:

- forward delta vs proj4
- inverse delta vs proj4
- roundtrip drift

Example test points:

    [34.7893, 32.0732]
    [35.2134, 31.7683]
    [34.9876, 32.1234]

Roundtrip drift is typically near floating-point precision.

---

## Performance

Benchmarked for high-volume coordinate conversion.

Typical results (machine dependent):

    WebMercator 1M: ~70 ms
    ITM 1M:        ~380 ms
    ITM (no tuple): ~320 ms

Focus:

- minimal allocations
- predictable memory
- vector-friendly math

---

## Demo

Interactive site includes:

- live converter
- map hover showing Lon/Lat, WM, ITM
- accuracy comparison vs proj4
- performance microbenchmarks

→ https://peterbak6.github.io/geoconverter

---

## Math transparency

Implements full pipeline:

- geodetic ↔ ECEF
- Helmert transform
- Transverse Mercator series
- EPSG parameters
- GRS80 ellipsoid

No hidden simplifications.

---

## API

### ITM

    toItm(lon, lat)
    fromItm(E, N)
    toItmOut(lon, lat, flags, outArray, offset)

### WebMercator

    toWebMercator(lon, lat)
    fromWebMercator(x, y)

All angles in **degrees**.\
All projected units in **meters**.

---

## Repository structure

    packages/geoconverter
    apps/demo

- npm library
- demo site (GitHub Pages)

---

## Development

```bash
pnpm install
pnpm -C packages/geoconverter build
pnpm -F demo dev
```

---

## License

MIT --- free for commercial and research use.
