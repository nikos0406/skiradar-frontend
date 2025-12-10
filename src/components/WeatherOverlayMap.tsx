"use client";

import { useMemo, useState } from "react";

type WeatherOverlay = "snowPrecip" | "rain" | "wind";

type Props = {
  lat: number;
  lon: number;
  resortName?: string | null;
};

const overlayOptions: { id: WeatherOverlay; label: string }[] = [
  { id: "snowPrecip", label: "Schnee" },
  { id: "rain", label: "Regen" },
  { id: "wind", label: "Wind" },
];

export function WeatherOverlayMap({ lat, lon, resortName }: Props) {
  const [overlay, setOverlay] = useState<WeatherOverlay>("snowPrecip");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lon.toFixed(3),
      detailLat: lat.toFixed(3),
      detailLon: lon.toFixed(3),
      zoom: "7",
      level: "surface",
      overlay,
      product: "ecmwf",
      menu: "",
      message: "true",
      type: "map",
      location: "coordinates",
      detail: "false",
      marker: "true",
      calendar: "24",
      pressure: "true",
    });

    return `https://embed.windy.com/embed2.html?${params.toString()}`;
  }, [lat, lon, overlay]);

  return (
    <section className="detail-map" aria-label="Wetterkarte mit Overlays">
      <div className="detail-map__header">
        <h2 className="detail-map__title">Wetterradar</h2>
        <p className="detail-map__subtitle">
          {resortName ? `${resortName}: ` : ""}Overlays für Schnee, Regen und Wind.
        </p>
      </div>
      <div className="detail-map__controls" role="tablist" aria-label="Wetter Overlays">
        {overlayOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={overlay === option.id}
            className={`detail-map__button${overlay === option.id ? " detail-map__button--active" : ""}`}
            onClick={() => setOverlay(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="detail-map__frame" role="tabpanel" aria-live="polite">
        <iframe
          title={`${overlay} Karte für ${resortName ?? "Skigebiet"}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="geolocation"
        />
      </div>
    </section>
  );
}
