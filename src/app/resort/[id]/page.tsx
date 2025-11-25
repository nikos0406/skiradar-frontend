import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchResorts } from "@/lib/api";
import { fallbackImage, formatDate, isFresh } from "@/lib/format";
import { SkiResort } from "@/types/resort";

async function loadResort(id: string): Promise<SkiResort | null> {
  const parsedId = Number(id);
  if (Number.isNaN(parsedId)) return null;

  try {
    const resorts = await fetchResorts(parsedId);
    return resorts?.[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type Props = { params: { id: string } };

export default async function ResortDetail({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const resort = await loadResort(id);
  const fresh = resort ? isFresh(resort.last_update) : false;

  if (!resort) {
    notFound();
  }

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Details zum Skigebiet" backHref="/" />
      <main className="page" role="main">
        <div className="detail-shell">
          <div className="detail-breadcrumb">
            <Link href="/">← Zurück zur Übersicht</Link>
          </div>

          <div className="detail-banner">
            <div className="detail-banner__body">
              <div className="detail-kicker">Live-Daten</div>
              <h1 className="detail-title">{resort.name ?? "Unbekanntes Gebiet"}</h1>
              <p className="detail-lede">{resort.weather_description ?? "Keine Wetterdaten verfügbar"}</p>
              <div className="detail-banner__meta">
                <div className="pill">Land: <strong>{resort.country ?? "—"}</strong></div>
                <div className="pill">Bundesland/Kanton: <strong>{resort.state ?? "—"}</strong></div>
                <div className="pill">Koordinaten: <strong>{resort.lat ?? "—"}, {resort.lon ?? "—"}</strong></div>
              </div>
              <div className="detail-badges">
                <span className={`detail-badge ${fresh ? "detail-badge--fresh" : "detail-badge--stale"}`}>
                  {fresh ? "Aktuell (< 1h)" : "Daten älter als 1h"}
                </span>
                <span className="detail-badge detail-badge--muted">Letztes Update: {formatDate(resort.last_update)}</span>
              </div>
            </div>
            <div className="detail-banner__media">
              <img
                className="detail-banner__image"
                src={fallbackImage(resort.image_url)}
                alt="Bild des Skigebiets"
              />
            </div>
          </div>

          <div className="detail-stats-grid">
            <div className="stat">
              <div className="stat-label">Temperatur</div>
              <div className="stat-value">
                {resort.temp_c ?? "—"}<span className="unit">°C</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Wind</div>
              <div className="stat-value">
                {resort.wind_kmh ?? "—"}<span className="unit">km/h</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Schneehöhe</div>
              <div className="stat-value">
                {resort.snow_depth_cm ?? "—"}<span className="unit">cm</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Neuschnee (24h)</div>
              <div className="stat-value">
                {resort.snow_new_cm ?? "—"}<span className="unit">cm</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Schneehöhe gestern</div>
              <div className="stat-value">
                {resort.snow_depth_yesterday_cm ?? "—"}<span className="unit">cm</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Referenzdatum</div>
              <div className="stat-value">{resort.snow_ref_date ?? "—"}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
