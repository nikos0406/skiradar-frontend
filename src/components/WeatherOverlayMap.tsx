"use client";

import { useMemo } from "react";

type Props = {
  lat: number;
  lon: number;
  resortName?: string | null;
};

const DEFAULT_OVERLAY = "snowcover";

export function WeatherOverlayMap({ lat, lon, resortName }: Props) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lon.toFixed(3),
      detailLat: lat.toFixed(3),
      detailLon: lon.toFixed(3),
      zoom: "10",
      level: "surface",
      overlay: DEFAULT_OVERLAY,
    });

    return `https://embed.windy.com/embed2.html?${params.toString()}`;
  }, [lat, lon]);

  return (
    <section className="detail-map" aria-label="Windy Wetterkarte">
      <div className="detail-map__frame">
        <iframe
          title={`Windy Karte für ${resortName ?? "Skigebiet"}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="geolocation"
        />
      </div>
    </section>
  );
}
