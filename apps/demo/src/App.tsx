import { useState } from "react";
import "./app.css";
import DemoConverter from "./components/DemoConverter";
import MapPanel from "./components/MapPanel";
import AccuracyPerformance from "./components/AccuracyPerformance";
import ApiPanel from "./components/ApiPanel";
import InstallPanel from "./components/InstallPanel";
import MathPanel from "./components/MathPanel";
import ItmIntro from "./components/ItmIntro";

export default function App() {
  const [demoLon, setDemoLon] = useState(35.503194);
  const [demoLat, setDemoLat] = useState(32.547015);

  return (
    <div className="page">
      <aside className="nav">
        <div className="brand">
          <span className="dot" />
          ITM Coordinates Converter
        </div>

        <a href="#map">Map</a>
        <a href="#demo">Converter</a>
        <a href="#accuracy">Accuracy </a>
        <a href="#accuracy">Performance</a>
        <a href="#install">Install</a>
        <a href="#api">API</a>
        <a href="#math">Math</a>

        <div className="meta">
          <span className="pill">ITM</span>
          <span className="pill">EPSG:2039</span>
          <span className="pill">Performant</span>
          <span className="pill">Auditable</span>
        </div>
      </aside>

      <main className="main">
        <header className="hero">
          <h1>ITM Coordinates Converter</h1>
          <p>
            GeoConverter is a numerically stable, auditable coordinate
            conversion library optimized for high-throughput workloads. Designed
            for movement/trajectory pipelines, vehicle tracing and trecking,
            mapping UIs, and large batches (millions of objects), with
            allocation-free APIs to keep performance predictable.
          </p>
        </header>

        <section className="section" id="intro">
          <ItmIntro />
        </section>

        <section className="section" id="map">
          <h2>Map</h2>
          <p className="subtle">
            Hover the map to see Lon/Lat, WebMercator, and ITM at the cursor.
          </p>
          <MapPanel
            lon={demoLon}
            lat={demoLat}
            onPick={(lon, lat) => {
              setDemoLon(lon);
              setDemoLat(lat);
            }}
          />
        </section>

        <section className="section" id="demo">
          <h2>Convert Israeli Transverse Mercator (ITM EPSG:2039)</h2>
          <DemoConverter
            lon={demoLon}
            lat={demoLat}
            onChange={(lon, lat) => {
              setDemoLon(lon);
              setDemoLat(lat);
            }}
          />
        </section>

        <section className="section" id="accuracy">
          <h2>Accuracy &amp; Performance</h2>
          <p className="subtle">
            Roundtrip drift + performance benchmark results.
          </p>
          <AccuracyPerformance lon={demoLon} lat={demoLat} />
        </section>

        <section className="section" id="install">
          <InstallPanel />
        </section>

        <section className="section" id="api">
          <ApiPanel />
        </section>

        <section className="section" id="math">
          <MathPanel />
        </section>
        <footer className="footer">
          <p>
            Built by <a href="https://peterbak.com">Peter Bak</a>{" "}
            .{" "}
          </p>
          <p>
            <a href="https://github.com/peterbak6/geoconverter">
              Source on GitHub
            </a>
            {" · "}
            <a href="https://visualanalytics.co.il">Website</a>
            {" · "}
            <a href="mailto:peter@visualanalytics.co.il">
              Email
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
