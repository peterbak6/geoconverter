import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toItm, toWebMercator } from "@peterbak6/geoconverter";

type HoverInfo = {
  lon: number;
  lat: number;
  wmX: number;
  wmY: number;
  itmE: number;
  itmN: number;
  x: number;
  y: number;
};

export default function MapPanel({
  lon,
  lat,
  onPick,
}: {
  lon: number;
  lat: number;
  onPick: (lon: number, lat: number) => void;
}) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);

  // init once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty", // light
      center: [lon, lat],
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("mousemove", (e) => {
      const ll = e.lngLat;
      const [wmX, wmY] = toWebMercator(ll.lng, ll.lat);
      const [itmE, itmN] = toItm(ll.lng, ll.lat);
      setHover({
        lon: ll.lng,
        lat: ll.lat,
        wmX,
        wmY,
        itmE,
        itmN,
        x: e.point.x,
        y: e.point.y,
      });
    });

    map.on("mouseleave", () => setHover(null));

    map.on("click", (e) => {
      onPick(e.lngLat.lng, e.lngLat.lat);
    });

    mapRef.current = map;

    requestAnimationFrame(() => map.resize());

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when demo lon/lat change, recenter smoothly (without recreating map)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({ center: [lon, lat], duration: 450 });
  }, [lon, lat]);

  return (
    <div className="card">
      <div className="mapWrap">
        <div ref={containerRef} className="mapCanvas" />

        {hover && (
          <div className="mapTooltip" style={{ left: hover.x + 12, top: hover.y + 12 }}>
            <div className="ttTitle">Hover coordinate</div>

            <div className="ttRow">
              <span className="ttKey">Lon/Lat</span>
              <span className="ttVal">
                {hover.lon.toFixed(6)}, {hover.lat.toFixed(6)}
              </span>
            </div>

            <div className="ttRow">
              <span className="ttKey">WebMercator</span>
              <span className="ttVal">
                {hover.wmX.toFixed(2)}, {hover.wmY.toFixed(2)}
              </span>
            </div>

            <div className="ttRow">
              <span className="ttKey">ITM</span>
              <span className="ttVal">
                {hover.itmE.toFixed(2)}, {hover.itmN.toFixed(2)}
              </span>
            </div>

            <div className="subtle" style={{ marginTop: 8 }}>
              Click to set Demo inputs
            </div>
          </div>
        )}
      </div>

      <div className="subtle" style={{ marginTop: 10 }}>
        Tip: move your mouse over the map to see the three coordinate systems. Click to set the Demo Lon/Lat.
      </div>
    </div>
  );
}
