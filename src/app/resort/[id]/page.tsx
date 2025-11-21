import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchResorts } from "@/lib/api";
import { fallbackImage, formatDate } from "@/lib/format";
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

  if (!resort) {
    notFound();
  }

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Details zum Skigebiet" backHref="/" />
      <div className="page">
        <div className="container container--medium">
          <div className="nav-link" style={{ marginBottom: 8 }}>
            <Link href="/">← Zurück zur Übersicht</Link>
          </div>
          <div className="detail-hero">
            <div>
              <h1 className="intro-title" style={{ marginBottom: 6 }}>
                {resort.name ?? "Unbekanntes Gebiet"}
              </h1>
              <p className="intro-subtitle" style={{ margin: "0 0 12px" }}>
                {resort.weather_description ?? "Keine Wetterdaten verfügbar"}
              </p>
              <div className="detail-meta">
                <div className="pill">Land: <strong>{resort.country ?? "—"}</strong></div>
                <div className="pill">Bundesland/Kanton: <strong>{resort.state ?? "—"}</strong></div>
                <div className="pill">
                  Koordinaten: <strong>{resort.lat ?? "—"}, {resort.lon ?? "—"}</strong>
                </div>
              </div>
            </div>
            <img src={fallbackImage(resort.image_url)} alt="Bild des Skigebiets" />
          </div>

          <div className="stat-grid">
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

          <div className="detail-footer">
            <div>Letztes Update: {formatDate(resort.last_update)}</div>
            <div className="muted">ID: {resort.id}</div>
          </div>
        </div>
      </div>
    </>
  );
}
