import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { WeatherIcon } from "@/components/WeatherIcon";
import { WeatherOverlayMap } from "@/components/WeatherOverlayMap";
import { WebcamModal } from "@/components/WebcamModal";
import { ShareButton } from "@/components/ShareButton";
import { fetchSingleResort, fetchSingleResortForecast } from "@/lib/api";
import { fallbackImage, formatDate, formatForecastDate, isFresh } from "@/lib/format";
import { resolveWeatherIconVariant } from "@/lib/weatherIcon";
import {
  formatWeatherRating,
  normalizeWeatherRating,
  weatherRatingClassSuffix,
} from "@/lib/weatherRating";
import { SkiResort } from "@/types/resort";
import { WeatherForecast } from "@/types/forecast";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

async function loadResort(id: string): Promise<SkiResort | null> {
  const parsedId = Number(id);
  if (Number.isNaN(parsedId)) return null;

  try {
    const resort = await fetchSingleResort(parsedId);
    return resort ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadResortForecast(id: string): Promise<WeatherForecast[]> {
  const parsedId = Number(id);
  if (Number.isNaN(parsedId)) return [];

  try {
    const forecast = await fetchSingleResortForecast(parsedId);
    return forecast ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

type Props = { params: { id: string } };

function resolveWeatherIcon(day: WeatherForecast) {
  return resolveWeatherIconVariant(day.weather_code, day.weather_description);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const resort = await loadResort(id);
  const canonicalPath = resort?.id ? `/resort/${resort.id}` : `/resort/${id}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  if (!resort) {
    return {
      title: `Skigebiet nicht gefunden | ${SITE_NAME}`,
      description: "Die angefragten Live-Daten konnten nicht geladen werden.",
      alternates: { canonical: canonicalUrl },
    };
  }

  const locationLabel = [resort.state, resort.country].filter(Boolean).join(", ") || "Alpen";
  const heroImage = absoluteUrl(fallbackImage(resort.image_url));
  const description = `Live-Skiwetter, Schneehöhe, Wind & Webcams für ${resort.name ?? "dieses Skigebiet"} (${locationLabel}).`;
  const title = `${resort.name ?? "Skigebiet"} – Wetter, Schnee & Webcams | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 675,
          alt: `${resort.name ?? "Skigebiet"} Panorama`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
    },
  };
}

export default async function ResortDetail({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const [resort, forecast] = await Promise.all([loadResort(id), loadResortForecast(id)]);

  if (!resort) {
    notFound();
  }

  const fresh = isFresh(resort.last_update);
  const weatherRating = normalizeWeatherRating(resort.weather_rating);
  const heroImage = fallbackImage(resort.image_url);
  const heroImageAbsolute = absoluteUrl(heroImage);
  const locationLabel = [resort.state, resort.country].filter(Boolean).join(" · ");
  const locationDisplay = locationLabel.length > 0 ? locationLabel : "Standort unbekannt";
  const coordinatesLabel =
    Number.isFinite(resort.lat) && Number.isFinite(resort.lon)
      ? `${resort.lat.toFixed(2)}°, ${resort.lon.toFixed(2)}°`
      : "—";
  const currentIcon = resolveWeatherIconVariant(undefined, resort.weather_description);
  const hasFreshSnow = typeof resort.snow_new_cm === "number" && resort.snow_new_cm >= 5;
  const hasDeepBase = typeof resort.snow_depth_cm === "number" && resort.snow_depth_cm >= 120;
  const strongWind = typeof resort.wind_kmh === "number" && resort.wind_kmh >= 45;
  const mildWind = typeof resort.wind_kmh === "number" && resort.wind_kmh <= 20;
  const warmTemp = typeof resort.temp_c === "number" && resort.temp_c >= 3;
  const frigidTemp = typeof resort.temp_c === "number" && resort.temp_c <= -8;
  const staleData = !fresh;
  const upcomingSnowDay = forecast.find((day) => (day.snow_forecast_cm ?? 0) >= 5);
  const calmWindow = forecast.find((day) => typeof day.wind_kmh === "number" && day.wind_kmh <= 20);
  const warmWindow = forecast.find((day) => typeof day.temp_max_c === "number" && (day.temp_max_c ?? 0) >= 5);

  const intelligenceInsights: { title: string; detail: string }[] = [];

  if (hasFreshSnow && mildWind) {
    intelligenceInsights.push({
      title: "Powder & ruhig",
      detail: `${resort.snow_new_cm} cm Neuschnee treffen auf nur ${resort.wind_kmh ?? "?"} km/h Wind – früh raus für butterweiche Lines.`,
    });
  } else if (hasFreshSnow) {
    intelligenceInsights.push({
      title: "Powderfenster",
      detail: `${resort.snow_new_cm} cm Neuschnee in 24h. Nutze windgeschützte Hänge für beste Sicht.`,
    });
  }

  if (hasDeepBase && !warmTemp) {
    intelligenceInsights.push({
      title: "Tiefe Basis",
      detail: `Schneehöhe bei ${resort.snow_depth_cm} cm – ideale Grundlage für längere Touren & Variantenabfahrten.`,
    });
  }

  if (strongWind && !hasFreshSnow) {
    intelligenceInsights.push({
      title: "Wind-Alert",
      detail: `Aktuell ${resort.wind_kmh} km/h. Plane windarme Zonen oder spätere Liftenstarts ein.`,
    });
  } else if (mildWind && warmTemp) {
    intelligenceInsights.push({
      title: "Frühjahrsgefühl",
      detail: `Nur ${resort.wind_kmh ?? 0} km/h Wind und ${resort.temp_c ?? 0}°C – vormittags top, nachmittags wird's weich.`,
    });
  }

  if (frigidTemp && hasDeepBase) {
    intelligenceInsights.push({
      title: "Scharfe Kälte",
      detail: `${resort.temp_c}°C halten den Basepack hart – Kanten checken & Layer vorbereiten.`,
    });
  }

  if (staleData) {
    intelligenceInsights.push({
      title: "Update empfohlen",
      detail: "Daten älter als 60 Minuten. Kurz vor Abfahrt erneut abrufen für finale Planung.",
    });
  }

  if (upcomingSnowDay && (!hasFreshSnow || strongWind)) {
    intelligenceInsights.push({
      title: "Nächster Schneeschub",
      detail: `${formatForecastDate(upcomingSnowDay.forecast_date)} werden bis zu ${upcomingSnowDay.snow_forecast_cm ?? "?"} cm erwartet – Reise ggf. dahin timen.`,
    });
  }

  if (calmWindow && strongWind) {
    intelligenceInsights.push({
      title: "Ruhephase",
      detail: `${formatForecastDate(calmWindow.forecast_date)} fällt der Wind auf ${calmWindow.wind_kmh ?? "?"} km/h – Shuttle/Heli-Slots dort planen.`,
    });
  }

  if (warmWindow && !warmTemp) {
    intelligenceInsights.push({
      title: "Mildes Zeitfenster",
      detail: `${formatForecastDate(warmWindow.forecast_date)} steigt die Max-Temperatur auf ${warmWindow.temp_max_c ?? "?"}°C – Slush Runs gegen Nachmittag einkalkulieren.`,
    });
  }

  if (intelligenceInsights.length === 0) {
    intelligenceInsights.push({
      title: "Standardlage",
      detail: "Keine Extremwerte in Sicht – Fokus auf klassische Routen und frühe Startzeiten.",
    });
  }
  const heroIntel = intelligenceInsights.slice(0, 2);
  const canonicalUrl = absoluteUrl(resort.id ? `/resort/${resort.id}` : `/resort/${id}`);
  const resortSchema = {
    "@context": "https://schema.org",
    "@type": "SkiResort",
    name: resort.name ?? "Skigebiet",
    description: `Live-Wetter, Schneehöhen und Webcams für ${resort.name ?? "dieses Skigebiet"} in ${locationDisplay}.`,
    image: heroImageAbsolute,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressRegion: resort.state ?? "",
      addressCountry: resort.country ?? "",
    },
    geo:
      Number.isFinite(resort.lat) && Number.isFinite(resort.lon)
        ? {
            "@type": "GeoCoordinates",
            latitude: resort.lat,
            longitude: resort.lon,
          }
        : undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Skiwetter & Webcams",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: resort.name ?? "Skigebiet",
        item: canonicalUrl,
      },
    ],
  };

  const displayName = resort.name ?? "Dieses Skigebiet";
  const keywordBase = displayName.trim();
  const keywordSet = new Set(
    [
      `${keywordBase} Wetter`,
      `${keywordBase} Webcam`,
      `${keywordBase} Schneehöhe`,
      `${keywordBase} Schneebericht`,
      `${keywordBase} Lawinenlage`,
      `${keywordBase} Livecam`,
      locationDisplay !== "Standort unbekannt" ? `${keywordBase} Wetter ${locationDisplay.replace(" · ", " ")}` : null,
    ].filter(Boolean),
  );
  const keywordChips = Array.from(keywordSet);

  const metricSnippets = [
    typeof resort.temp_c === "number" ? `Temperatur liegt bei ${resort.temp_c}°C` : null,
    typeof resort.snow_depth_cm === "number" ? `Schneehöhe derzeit ${resort.snow_depth_cm} cm` : null,
    typeof resort.snow_new_cm === "number" ? `${resort.snow_new_cm} cm Neuschnee in 24h` : null,
    typeof resort.wind_kmh === "number" ? `Windgeschwindigkeit ${resort.wind_kmh} km/h` : null,
  ].filter(Boolean);

  const seoParagraph =
    metricSnippets.length > 0
      ? `${displayName} liefert aktuell: ${metricSnippets.join(", ")}. Wir kombinieren diese Werte mit Wetterradar und HD-Webcams, damit Anfragen wie "${displayName} Wetter" oder "${displayName} Webcam" sofort beantwortet werden.`
      : `${displayName} wird von SkiRadar mit stündlichen Wetter-, Schnee- und Webcam-Daten versorgt – ideal für Suchanfragen wie "${displayName} Wetter" oder "${displayName} Webcam".`;

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Details zum Skigebiet" backHref="/" />
      <main className="page" role="main">
        <div className="detail-shell">
          <div className="detail-breadcrumb">
            <Link href="/">← Zurück zur Übersicht</Link>
          </div>

          <div className="detail-banner">
            <ShareButton resortName={resort.name} />
            <div className="detail-banner__body">
              <div className="detail-kicker">Live-Daten</div>
              <h1 className="detail-title">
                {resort.name ?? "Unbekanntes Gebiet"}
                {resort.state ? <span className="detail-title__location">, {resort.state}</span> : null}
              </h1>
              <div className="detail-conditions-row">
                <WeatherIcon variant={currentIcon} label={resort.weather_description ?? "Wetter"} />
                <p className="detail-lede">{resort.weather_description ?? "Keine Wetterdaten verfügbar"}</p>
              </div>
              <div className="detail-stats-grid detail-stats-grid--inline">
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
                  <div className="stat-label">Bedingungen</div>
                  <div className="stat-value stat-value--pill">
                    <span
                      className={`pill pill--rating pill--rating-${weatherRatingClassSuffix(weatherRating)}`}
                      aria-label="Aktuelle Bedingungen"
                    >
                      {formatWeatherRating(resort.weather_rating)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="detail-banner__footer">
                <span className="detail-banner__footer-text">
                  Letztes Update: {formatDate(resort.last_update)}
                </span>
              </div>
            </div>
            <div className="detail-media">
              <div className="detail-image-wrapper">
                <WebcamModal imageSrc={heroImage} resortName={resort.name} />
              </div>
              {heroIntel.length > 0 ? (
                <div className="detail-intelligence">
                  <div className="detail-intelligence__label">SkiRadar Intelligence</div>
                  <ul className="detail-intelligence__list">
                    {heroIntel.map((tip) => (
                      <li key={tip.title}>
                        <strong>{tip.title}:</strong> {tip.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="detail-card detail-forecast">
            <div className="detail-card__header">
              <div>
                <div className="detail-card__title">7-Tage Vorhersage</div>
              </div>
            </div>
            <div className="forecast-scroll-hint" aria-hidden="true">
              ← Wischen oder scrollen, um alle Tage zu sehen →
            </div>
            <div className="forecast-grid">
              {forecast.length === 0 ? (
                <p className="detail-card__meta">Keine Vorhersage verfügbar.</p>
              ) : (
                forecast.map((day, index) => (
                  <div key={day.id} className="forecast-tile">
                    <div className="forecast-header">
                      <div className="forecast-date">
                        {index === 0 ? "Heute" : index === 1 ? "Morgen" : formatForecastDate(day.forecast_date)}
                      </div>
                      <WeatherIcon
                        variant={resolveWeatherIcon(day)}
                        label={day.weather_description ?? "Wetter"}
                      />
                      <div className="forecast-description">{day.weather_description ?? "Keine Beschreibung"}</div>
                      <div className="forecast-rating-chip">
                        <span
                          className={`pill pill--rating pill--rating-${weatherRatingClassSuffix(day.weather_rating)}`}
                        >
                          Bedingungen: <strong>{formatWeatherRating(day.weather_rating)}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="forecast-metrics">
                      <div>
                        <span className="label">Min</span>
                        <strong>{day.temp_min_c ?? "?"}°C</strong>
                      </div>
                      <div>
                        <span className="label">Max</span>
                        <strong>{day.temp_max_c ?? "?"}°C</strong>
                      </div>
                      <div>
                        <span className="label">Wind</span>
                        <strong>{day.wind_kmh ?? "?"} km/h</strong>
                      </div>
                      <div>
                        <span className="label">Schnee</span>
                        <strong>{day.snow_forecast_cm ?? "?"} cm</strong>
                      </div>
                      <div>
                        <span className="label">Regen</span>
                        <strong>{day.precipitation_mm ?? "?"} mm</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <section className="detail-map-section" aria-label="Interaktive Wetterkarte">
            <WeatherOverlayMap lat={resort.lat} lon={resort.lon} resortName={resort.name} />
          </section>

          <details className="detail-seo" aria-label={`Suchbegriffe zu ${displayName}`}>
            <summary>
              <span>Mehr über Wetter &amp; Webcams für {displayName}</span>
              <span className="detail-seo__chevron" aria-hidden="true">⌃</span>
            </summary>
            <div className="detail-seo__body">
              <p>
                {seoParagraph} Zusätzlich liefern wir Kontext zu Sichtfenstern, Lawinenlage und Powder-Fenstern in {locationDisplay} – perfekt,
                wenn du gezielt nach Tourenwetter oder Liftstatus suchst.
              </p>
              <div className="detail-seo__keywords">
                {keywordChips.map((phrase) => (
                  <span key={phrase}>{phrase}</span>
                ))}
              </div>
            </div>
          </details>

        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resortSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
