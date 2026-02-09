import { useMemo, useState } from "react";
import proj4 from "proj4";
import {
  toItm,
  fromItm,
  toItmOut,
  toWebMercator,
} from "@peterbak6/geoconverter";

type AccuracyRow = {
  lon: number;
  lat: number;
  dE: number;
  dN: number;
  dLonDeg: number;
  dLatDeg: number;
  rtLonDeg: number;
  rtLatDeg: number;
};

type BenchResult = {
  name: string;
  ms: number;
  opsPerSec: number;
  msPerOp: number;
};

const EPSG2039 =
  "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 +k=1.0000067 " +
  "+x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
  "+towgs84=23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262 " +
  "+units=m +no_defs +type=crs";

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function bench(name: string, N: number, fn: (i: number) => void): BenchResult {
  const t0 = nowMs();
  let acc = 0; // prevent dead-code elimination
  for (let i = 0; i < N; i++) {
    fn(i);
    acc += i;
  }
  const t1 = nowMs();
  const ms = t1 - t0;
  void acc;

  const opsPerSec = (N / ms) * 1000;
  const msPerOp = ms / N;
  return { name, ms, opsPerSec, msPerOp };
}

export default function AccuracyPerformance({
  lon,
  lat,
}: {
  lon: number;
  lat: number;
}) {
  const points: Array<[number, number]> = useMemo(
    () => [[lon, lat]],
    [lon, lat],
  );
  // ---------- Accuracy (Proj4 comparison) ----------
  const rows: AccuracyRow[] = useMemo(() => {
    // define once (idempotent)
    if (!proj4.defs("EPSG:2039")) {
      proj4.defs("EPSG:2039", EPSG2039);
    }

    return points.map(([lon, lat]) => {
      // Forward our lib
      const [e, n] = toItm(lon, lat);

      // Forward proj4
      const pFwd = proj4("EPSG:4326", "EPSG:2039", [lon, lat]);
      const dE = e - pFwd[0];
      const dN = n - pFwd[1];

      // Backward our lib (using our e/n)
      const [lonBack, latBack] = fromItm(e, n);

      // Backward proj4
      const pBwd = proj4("EPSG:2039", "EPSG:4326", [e, n]);
      const dLonDeg = lonBack - pBwd[0];
      const dLatDeg = latBack - pBwd[1];

      // Roundtrip (self consistency)
      const rtLonDeg = lonBack - lon;
      const rtLatDeg = latBack - lat;

      return { lon, lat, dE, dN, dLonDeg, dLatDeg, rtLonDeg, rtLatDeg };
    });
  }, [lon, lat]);

  // ---------- Performance (in-browser microbench) ----------
  const [N, setN] = useState(200_000);
  const [benchResults, setBenchResults] = useState<BenchResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBench = () => {
    // keep UI responsive a bit
    setIsRunning(true);
    setBenchResults(null);

    setTimeout(() => {
      const lons = new Float64Array(N);
      const lats = new Float64Array(N);

      for (let i = 0; i < N; i++) {
        lons[i] = 34.2 + (i % 2000) * 0.00001;
        lats[i] = 31.2 + (i % 2000) * 0.00001;
      }

      const out = new Float64Array(2);

      const r1 = bench("WebMercator (tuple allocation)", N, (i) => {
        const [x, y] = toWebMercator(lons[i], lats[i]);
        // use values (no-op but prevents optimization)
        if (x === 123456789) console.log(y);
      });

      const r2 = bench("ITM (tuple allocation)", N, (i) => {
        const [e, n] = toItm(lons[i], lats[i], 0 as any);
        if (e === 123456789) console.log(n);
      });

      const r3 = bench("ITM (allocation-free: toItmOut)", N, (i) => {
        toItmOut(lons[i], lats[i], 0 as any, out, 0);
        if (out[0] === 123456789) console.log(out[1]);
      });

      // performance of Proj4:
        const r4 = bench("Proj4 (tuple allocation)", N, (i) => {
          const p = proj4("EPSG:4326", "EPSG:2039", [lons[i], lats[i]]);
          if (p[0] === 123456789) console.log(p[1]);
        });

      setBenchResults([r1, r2, r3, r4]);
      setIsRunning(false);
    }, 10);
  };

  return (
    <div className="grid2">
      {/* ---------- Accuracy panel ---------- */}
      <div className="card">
        <h3>Accuracy (vs Proj4)</h3>
        <div className="subtle">
          Deltas computed using the EPSG:2039 Proj4 string compared to GeoConverter.
        </div>

        <div style={{ marginTop: 12 }} className="table">
          <div className="tr th">
            <div>Lon</div>
            <div>Lat</div>
            <div>ΔE (m)</div>
            <div>ΔN (m)</div>
            <div>Roundtrip Δlon (°)</div>
            <div>Roundtrip Δlat (°)</div>
          </div>

          {rows.map((r, idx) => (
            <div key={idx} className="tr">
              <div className="mono">{r.lon.toFixed(4)}</div>
              <div className="mono">{r.lat.toFixed(4)}</div>
              <div className="mono">{r.dE.toFixed(3)}</div>
              <div className="mono">{r.dN.toFixed(3)}</div>
              <div className="mono">{r.rtLonDeg.toExponential(2)}</div>
              <div className="mono">{r.rtLatDeg.toExponential(2)}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ---------- Performance panel ---------- */}
      <div className="card">
        <h3>Performance (in-browser)</h3>
        <div className="subtle">
          Micro-benchmark (not a formal suite). Results vary by
          browser/machine/JIT.
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <div>
            <label>Iterations</label>
            <input
              value={String(N)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setN(
                  Number.isFinite(v)
                    ? Math.max(10_000, Math.min(2_000_000, v))
                    : 200_000,
                );
              }}
            />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button onClick={runBench} disabled={isRunning}>
              {isRunning ? "Running…" : "Run benchmark"}
            </button>
          </div>
        </div>

        {!benchResults && (
          <div className="subtle" style={{ marginTop: 12 }}>
            Click “Run benchmark” to populate results.
          </div>
        )}

        {benchResults && (
          <div style={{ marginTop: 12 }} className="table">
            <div className="tr th">
              <div>Test</div>
              <div>Time (ms)</div>
              <div>ms/op</div>
              <div>ops/sec</div>
            </div>

            {benchResults.map((r) => (
              <div key={r.name} className="tr">
                <div>{r.name}</div>
                <div className="mono">{r.ms.toFixed(1)}</div>
                <div className="mono">{(r.msPerOp * 1000).toFixed(3)} μs</div>
                <div className="mono">
                  {Math.round(r.opsPerSec).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
