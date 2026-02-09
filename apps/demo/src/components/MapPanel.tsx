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
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [hover, setHover] = useState<HoverInfo | null>(null);

  // init once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json", // dark
      center: [lon, lat],
      zoom: 8,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("mousemove", (e) => {
      const ll = e.lngLat;
      const [wmX, wmY] = toWebMercator(ll.lng, ll.lat);
      const [itmE, itmN] = toItm(ll.lng, ll.lat);
      setHover({
        lon: Number(ll.lng),
        lat: Number(ll.lat),
        wmX: Number(wmX),
        wmY: Number(wmY),
        itmE: Number(itmE),
        itmN: Number(itmN),
        x: e.point.x,
        y: e.point.y,
      });
    });

    map.on("mouseleave", () => setHover(null));

    map.on("click", (e) => {
      onPick(Number(e.lngLat.lng.toFixed(6)), Number(e.lngLat.lat.toFixed(6)));
    });

    mapRef.current = map;

    const el = document.createElement("div");
    el.className = "pickMarker";
    el.title = "Selected coordinate";

    markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([lon, lat])
      .addTo(map);

    requestAnimationFrame(() => map.resize());

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when demo lon/lat change, recenter smoothly (without recreating map)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // map.easeTo({ center: [lon, lat], duration: 450 });
  }, [lon, lat]);

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLngLat([lon, lat]);
  }, [lon, lat]);

  return (
    <div className="card">
      <div className="mapWrap">
        <div ref={containerRef} className="mapCanvas" />

        {hover && (
          <div
            className="mapTooltip"
            style={{ left: hover.x + 12, top: hover.y + 12 }}
          >
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

          </div>
        )}
      </div>

      <div className="subtle" style={{ marginTop: 10 }}>
        Tip: move your mouse over the map to see the three coordinate systems.
        Click to set the Demo Lon/Lat below.
      </div>
    </div>
  );
}
