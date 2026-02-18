export default function ApiPanel() {
  return (
    <div className="card">
      <h3>API</h3>

      <pre className="code">
        {`import { toItm, fromItm, toItmOut } from "@peterbak6/geoconverter";

const lon = 35.503194;
const lat = 32.547015;

// ITM
const [E, N] = toItm(lon, lat);
const [lonBack, latBack] = fromItm(E, N);

// Pre-allocation of output array for high-throughput 
const out = new Float64Array(2);
toItmOut(lon, lat, 0, out, 0);`}
      </pre>
    </div>
  );
}
