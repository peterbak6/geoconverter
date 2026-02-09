import { useEffect, useMemo, useState } from "react";
import { fromItm, toItm, toWebMercator } from "@peterbak6/geoconverter";

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

  const [northingStr, setNorthingStr] = useState("");
  const [eastingStr, setEastingStr] = useState("");

  useEffect(() => setLonStr(String(lon)), [lon]);
  useEffect(() => setLatStr(String(lat)), [lat]);

  const toITMResult = useMemo(() => {
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

  const fromITMResult = useMemo(() => {
    const E = toNum(eastingStr);
    const N = toNum(northingStr);
    if (E === null || N === null) return { ok: false as const };
    try {
      const [lon, lat] = fromItm(E, N);
      return { ok: true as const, E, N, lon, lat };
    } catch {
      return { ok: false as const };
    }
  }, [eastingStr, northingStr]);

  return (
    <>
      <p className="subtle">
        Enter Lon/Lat → see ITM and Web Mercator instantly.
      </p>
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

          {!toITMResult.ok && (
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
                <td className="mono">{toITMResult.ok ? toITMResult.E.toFixed(2) : "—"}</td>
              </tr>
              <tr>
                <td className="k">ITM Northing</td>
                <td className="mono">{toITMResult.ok ? toITMResult.N.toFixed(2) : "—"}</td>
              </tr>
              <tr>
                <td className="k">WebMercator X</td>
                <td className="mono">{toITMResult.ok ? toITMResult.x.toFixed(2) : "—"}</td>
              </tr>
              <tr>
                <td className="k">WebMercator Y</td>
                <td className="mono">{toITMResult.ok ? toITMResult.y.toFixed(2) : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="subtle">
        Enter Easting/Northing → see LonLat and Web Mercator instantly.
      </p>
      <div className="grid2">
        <div className="card">
          <h3>Input</h3>

          <label>Easting (meters)</label>
          <input
            value={eastingStr}
            onChange={(e) => {
              const s = e.target.value;
              setEastingStr(s);
            }}
          />

          <label style={{ marginTop: 10 }}>Northing (meters)</label>
          <input
            value={northingStr}
            onChange={(e) => {
              const s = e.target.value;
              setNorthingStr(s);
            }}
          />

          {!fromITMResult.ok && (
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
                <td className="k">Longitude</td>
                <td className="mono">{fromITMResult.ok ? fromITMResult.lon.toFixed(6) : "—"}</td>
              </tr>
              <tr>
                <td className="k">Latitude</td>
                <td className="mono">{fromITMResult.ok ? fromITMResult.lat.toFixed(6) : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </>
  );
}
