export default function ItmIntro() {
  return (
    <div>
      <h2>What is ITM (Israeli Transverse Mercator / EPSG:2039)?</h2>

      <p className="subtle" style={{ marginTop: 6, maxWidth: 820 }}>
        <b>ITM</b> stands for <b>Israeli Transverse Mercator</b> — Israel’s
        standard projected coordinate system used by government, surveying, GIS,
        and mapping applications. It is commonly referenced as <b>EPSG:2039</b>.
      </p>
      <div className="card">
        {/* <div className="chips" style={{ marginTop: 10 }}>
          <span className="pill">ITM</span>
          <span className="pill">EPSG:2039</span>
        </div> */}

        <div style={{ marginTop: 14 }} className="grid2">
          <div className="miniCard">
            <div className="miniTitle">Inputs</div>
            <div className="miniText">
              Typically starts from <b>longitude/latitude</b> (degrees) in
              EPSG:4326 (WGS84).
            </div>
          </div>

          <div className="miniCard">
            <div className="miniTitle">Outputs</div>
            <div className="miniText">
              Produces <b>Easting / Northing</b> in <b>meters</b> (planar
              coordinates) for local mapping and analysis.
            </div>
          </div>

          <div className="miniCard">
            <div className="miniTitle">Why people use it</div>
            <div className="miniText">
              Better local accuracy and simpler distance calculations than
              working directly in degrees.
            </div>
          </div>

          <div className="miniCard">
            <div className="miniTitle">GeoConverter focus</div>
            <div className="miniText">
              Numerically stable math, allocation-free APIs, and performance
              suited for <b>high-throughput movement/trajectory data</b>.
            </div>
          </div>
        </div>

        <p className="subtle" style={{ marginTop: 14 }}>
          Related terms: ITM converter, EPSG:2039, Israeli grid, Transverse
          Mercator Israel, Easting Northing Israel.
        </p>
      </div>
    </div>
  );
}
