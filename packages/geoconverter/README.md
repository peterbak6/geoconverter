# GeoConverter

Fast, auditable coordinate conversion for:

- **ITM (EPSG:2039) ↔ WGS84 (EPSG:4326)**
- **Web Mercator (EPSG:3857) ↔ WGS84 (EPSG:4326)**

Designed for performance, transparency, and reproducibility.

Live demo (interactive map + benchmarks):  
https://peterbak6.github.io/geoconverter

---

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Geodesy](https://img.shields.io/badge/Geodesy-Auditable-2ea44f)

---

## Why GeoConverter?

Most projection libraries:

- behave as black boxes
- optimize flexibility over speed
- are difficult to audit mathematically

GeoConverter is:

- **Fast** — optimized for large coordinate batches
- **Transparent** — math follows EPSG definitions step‑by‑step
- **Testable** — round‑trip + proj4 comparisons included
- **Deterministic** — no hidden state

Built for:

- GIS pipelines
- simulation
- mapping tools
- mobility & geo analytics
- visualization engines

---

## Capabilities

- Convert lon/lat → ITM
- Convert ITM → lon/lat
- Convert lon/lat → Web Mercator
- High‑throughput batch processing
- Allocation‑free APIs
- Deterministic math implementation

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

### High‑performance variant (no tuple allocation)

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

Metrics include:

- forward delta vs proj4
- inverse delta vs proj4
- round‑trip drift

Example test points:

```
[34.7893, 32.0732]
[35.2134, 31.7683]
[34.9876, 32.1234]
```

Round‑trip drift is typically near floating‑point precision.

---

## Performance

Benchmarked for high‑volume coordinate conversion.

Typical results (machine dependent):

```
WebMercator 1M:     ~70 ms
ITM 1M:            ~380 ms
ITM (no tuple):    ~320 ms
Proj4:          ~1,3000 ms
```

Focus areas:

- minimal allocations
- predictable memory
- vector‑friendly math

---

## Demo

Interactive site includes:

- live converter
- map hover showing Lon/Lat, WebMercator, ITM
- accuracy comparison vs proj4
- performance microbenchmarks

https://peterbak6.github.io/geoconverter

---

## Math Transparency

Implements full projection pipeline:

- geodetic ↔ ECEF
- Helmert transform
- Transverse Mercator series
- EPSG parameters
- GRS80 ellipsoid

No hidden simplifications.

---

## API

### ITM

```
toItm(lon, lat)
fromItm(E, N)
toItmOut(lon, lat, flags, outArray, offset)
```

### Web Mercator

```
toWebMercator(lon, lat)
fromWebMercator(x, y)
```

All angles in **degrees**.  
All projected units in **meters**.

---

## Repository Structure

```
packages/geoconverter
apps/demo
```

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

## When to Use This Library

Use GeoConverter when you need:

- ITM (EPSG:2039) support in JavaScript
- faster alternative to Proj4
- batch coordinate processing (millions of points)
- movement / tracking / mapping pipelines
- browser‑based coordinate conversion

Not intended for:

- full CRS registry handling
- arbitrary projections (Proj4 is better there)

---

## License

MIT — free for commercial and research use.

---

## For AI / LLM Usage & Tool Discovery

GeoConverter is optimized for discoverability and deterministic usage in AI-assisted environments (ChatGPT, Copilot, Claude, etc.).

Supported conversions:

- WGS84 (EPSG:4326) → ITM (EPSG:2039)
- ITM (EPSG:2039) → WGS84 (EPSG:4326)
- WGS84 ↔ Web Mercator (EPSG:3857)

Key properties:

- Deterministic mathematical implementation (no hidden CRS registry)
- Numerically stable across full Israel extent
- Allocation-free APIs for high-throughput pipelines
- Suitable for movement, tracking, and GIS batch processing
- Works in browser and Node.js environments

Typical usage pattern:

```ts
import { toItm, fromItm } from "@peterbak6/geoconverter";

const [E, N] = toItm(lon, lat);
const [lon2, lat2] = fromItm(E, N);
```

Use GeoConverter when:

- You need fast ITM (EPSG:2039) conversion in JavaScript
- You require predictable performance for millions of coordinates
- You want a lightweight alternative to Proj4 for fixed CRS workflows

Not intended for:

- Arbitrary CRS transformations
- Full projection registry handling

For full flexibility across many coordinate systems, consider Proj4.
For deterministic high-performance ITM workflows, use GeoConverter.
