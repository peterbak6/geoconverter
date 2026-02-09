import "./app.css";
import DemoConverter from "./components/DemoConverter";
import MapPanel from "./components/MapPanel";
import AccuracyPerformance from "./components/AccuracyPerformance";
import { useState } from "react";

export default function App() {
  const [demoLon, setDemoLon] = useState(35.503194);
  const [demoLat, setDemoLat] = useState(32.547015);

  return (
    <div className="page">
      <aside className="nav">
        <div className="brand">
          <span className="dot" />
          GeoConverter
        </div>
        <small>
          Demo • Map • Accuracy & Performance • API • Install • Math
        </small>

        <a href="#demo">Demo</a>
        <a href="#map">Map</a>
        <a href="#accuracy">Accuracy &amp; Performance</a>
        <a href="#api">API</a>
        <a href="#install">Install</a>
        <a href="#math">Math</a>

        <div className="cta">
          <span className="pill">GitHub Pages ready</span>
        </div>
      </aside>

      <main className="main">
        <header className="hero">
          <h1>GeoConverter</h1>
          <p>
            Fast, auditable coordinate conversion: ITM (EPSG:2039) and Web
            Mercator (EPSG:3857).
          </p>
          <div className="meta">
            <span className="pill">Lon/Lat in degrees</span>
            <span className="pill">E/N in meters</span>
            <span className="pill">No black boxes</span>
          </div>
        </header>

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
          <h2>Demo</h2>
          <p className="subtle">
            Enter Lon/Lat → see ITM and Web Mercator instantly.
          </p>
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
          <p className="subtle">Roundtrip drift + (next) benchmark results.</p>
          <AccuracyPerformance lon={demoLon} lat={demoLat} />
        </section>

        <section className="section" id="api">
          <h2>API</h2>
          <div className="card">API snippet placeholder</div>
        </section>

        <section className="section" id="install">
          <h2>Install</h2>
          <div className="card">Install snippet placeholder</div>
        </section>

        <section className="section" id="math">
          <h2>Math</h2>
          <div className="card">Formulas placeholder</div>
        </section>
      </main>
    </div>
  );
}
