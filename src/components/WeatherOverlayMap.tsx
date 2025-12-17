"use client";

import { useMemo, useState } from "react";

type Props = {
  lat: number;
  lon: number;
  resortName?: string | null;
};

const OVERLAY_OPTIONS = [
  { id: "snowcover", label: "Schneehöhe" },
  { id: "wind", label: "Wind" },
  { id: "temp", label: "Temperatur" },
] as const;

const DEFAULT_OVERLAY = OVERLAY_OPTIONS[0].id;

export function WeatherOverlayMap({ lat, lon, resortName }: Props) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const [overlay, setOverlay] = useState<string>(DEFAULT_OVERLAY);

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lon.toFixed(3),
      detailLat: lat.toFixed(3),
      detailLon: lon.toFixed(3),
      zoom: "9",
      level: "surface",
      overlay,
    });

    return `https://embed.windy.com/embed2.html?${params.toString()}`;
  }, [lat, lon, overlay]);

  const coordinatesText = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  const title = resortName ? `Wetterkarte für ${resortName}` : "Wetterkarte";

  return (
    <section className="detail-map" aria-label="Windy Wetterkarte">
      <div className="detail-map__header">
        <h2 className="detail-map__title">{title}</h2>
        <p className="detail-map__subtitle">Overlays zeigen live Bedingungen.</p>
      </div>
      <div className="detail-map__controls" role="group" aria-label="Overlay auswählen">
        {OVERLAY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`detail-map__button${
              overlay === option.id ? " detail-map__button--active" : ""
            }`}
            onClick={() => setOverlay(option.id)}
            aria-pressed={overlay === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="detail-map__frame">
        <iframe
          title={`Windy Karte für ${resortName ?? "Skigebiet"}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="geolocation"
        />
        <div className="detail-map__center-marker" aria-hidden="true" />
      </div>
    </section>
  );
}
