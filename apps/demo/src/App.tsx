import { useState } from "react";
import "./app.css";
import DemoConverter from "./components/DemoConverter";
import MapPanel from "./components/MapPanel";
import AccuracyPerformance from "./components/AccuracyPerformance";
import ApiPanel from "./components/ApiPanel";
import InstallPanel from "./components/InstallPanel";
import MathPanel from "./components/MathPanel";

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

        <a href="#map">Map</a>
        <a href="#demo">Demo</a>
        <a href="#accuracy">Accuracy </a>
        <a href="#accuracy">Performance</a>
        <a href="#install">Install</a>
        <a href="#api">API</a>
        <a href="#math">Math</a>

        <div className="meta">
          <span className="pill">Lon/Lat in degrees</span>
          <span className="pill">E/N in meters</span>
          <span className="pill">Performant</span>
          <span className="pill">Auditable</span>
          <span className="pill">GitHub Pages ready</span>
        </div>
      </aside>

      <main className="main">
        <header className="hero">
          <h1>GeoConverter</h1>
          <p>
            Fast and auditable coordinate conversion: ITM (EPSG:2039) and Web
            Mercator (EPSG:3857).
          </p>
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
          <p className="subtle">Roundtrip drift + performance benchmark results.</p>
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
      </main>
    </div>
  );
}
