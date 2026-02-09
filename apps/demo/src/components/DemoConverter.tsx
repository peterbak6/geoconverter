import { useEffect, useMemo, useState } from "react";
import { toItm, toWebMercator } from "@peterbak6/geoconverter";

function toNum(s: string): number | null {
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function DemoConverter({
  lon,
  lat,
  onChange,
}: {
  lon: number;
  lat: number;
  onChange: (lon: number, lat: number) => void;
}) {
  const [lonStr, setLonStr] = useState(lon.toString());
  const [latStr, setLatStr] = useState(lat.toString());

  useEffect(() => setLonStr(String(lon)), [lon]);
  useEffect(() => setLatStr(String(lat)), [lat]);

  const result = useMemo(() => {
    const lon = toNum(lonStr);
    const lat = toNum(latStr);
    if (lon === null || lat === null) return { ok: false as const };

    try {
      const [E, N] = toItm(lon, lat);
      const [x, y] = toWebMercator(lon, lat);
      return { ok: true as const, lon, lat, E, N, x, y };
    } catch {
      return { ok: false as const };
    }
  }, [lonStr, latStr]);

  return (
    <div className="grid2">
      <div className="card">
        <h3>Input</h3>

        <label>Longitude (degrees)</label>
        <input
          value={lonStr}
          onChange={(e) => {
            const s = e.target.value;
            setLonStr(s);
            const n = Number(s);
            if (Number.isFinite(n)) onChange(n, lat);
          }}
        />

        <label style={{ marginTop: 10 }}>Latitude (degrees)</label>
        <input
          value={latStr}
          onChange={(e) => {
            const s = e.target.value;
            setLatStr(s);
            const n = Number(s);
            if (Number.isFinite(n)) onChange(lon, n);
          }}
        />

        {!result.ok && (
          <div className="subtle" style={{ marginTop: 10 }}>
            Enter valid numbers to compute.
          </div>
        )}
      </div>

      <div className="card">
        <h3>Output</h3>

        <table className="outTable">
          <tbody>
            <tr>
              <td className="k">ITM Easting</td>
              <td className="mono">{result.ok ? result.E.toFixed(3) : "—"}</td>
            </tr>
            <tr>
              <td className="k">ITM Northing</td>
              <td className="mono">{result.ok ? result.N.toFixed(3) : "—"}</td>
            </tr>
            <tr>
              <td className="k">WebMercator X</td>
              <td className="mono">{result.ok ? result.x.toFixed(3) : "—"}</td>
            </tr>
            <tr>
              <td className="k">WebMercator Y</td>
              <td className="mono">{result.ok ? result.y.toFixed(3) : "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
