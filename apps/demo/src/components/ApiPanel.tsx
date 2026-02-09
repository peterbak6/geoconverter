export default function ApiPanel() {
  return (
    <div className="card">
      <h3>API</h3>

      <pre className="code">
{`import { toItm, fromItm, toWebMercator, fromWebMercator } from "@peterbak6/geoconverter";

// ITM
const [E, N] = toItm(lon, lat);
const [lonBack, latBack] = fromItm(E, N);

// Web Mercator
const [x, y] = toWebMercator(lon, lat);
const [lon2, lat2] = fromWebMercator(x, y);

// High-performance
const out = new Float64Array(2);
toItmOut(lon, lat, 0, out, 0);`}
      </pre>
    </div>
  );
}
