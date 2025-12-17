import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Produktübersicht & Features",
  description: `${SITE_NAME} liefert ${SITE_TAGLINE} mit Filtern für Länder und Bundesländer sowie klaren Live-Dashboards.`,
  alternates: {
    canonical: absoluteUrl("/landing"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/landing"),
    title: `${SITE_NAME} – Produktübersicht`,
    description: `${SITE_NAME} macht Schneeberichte, Wetter, Wind und Webcams in einem Interface sichtbar.`,
  },
};

export default function LandingPage() {
  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Schnee & Wetter auf einen Blick" />
      <div className="landing">
        <section className="landing-hero">
          <div className="landing-hero__content">
            <div className="landing-badge">SkiRadar</div>
            <h1>Plane jeden Skitag mit SkiRadar</h1>
            <p>
              Unsere KI analysiert Schneeberichte, Wetterdaten und Webcams live und fasst alles im
              Conditions Calculator zusammen. Kein Rätselraten mehr – nur klare Powder-Entscheidungen.
            </p>
            <div className="landing-cta">
              <Link className="btn-primary" href="/">
                Zu den Live-Daten
              </Link>
            </div>
            <div className="landing-meta">
              <span>SkiRadar Intelligence™</span>
              <span>Conditions Calculator</span>
              <span>Webcams + Wetter Radar</span>
            </div>
          </div>
          <div className="landing-hero__card">
            <div className="landing-card__header">
              <div>
                <div className="eyebrow">So funktioniert&apos;s</div>
                <h3>In drei Schritten startklar</h3>
              </div>
              <span className="pill">Live</span>
            </div>
            <ul className="landing-card__list">
              <li>
                <div>
                  <div className="item-label">1. Live-Ansicht öffnen</div>
                  <div className="item-value">Alle Gebiete in einem HQ</div>
                </div>
                <span className="item-badge">Sofort</span>
              </li>
              <li>
                <div>
                  <div className="item-label">2. Conditions prüfen</div>
                  <div className="item-value">AI scoret Powder, Wind & Sicht</div>
                </div>
                <span className="item-badge muted">Automatisch</span>
              </li>
              <li>
                <div>
                  <div className="item-label">3. Filtern & teilen</div>
                  <div className="item-value">Gebiete filtern & per Link teilen</div>
                </div>
                <span className="item-badge">Ready</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="features" className="landing-features">
          <div className="landing-feature__intro">
            <div className="eyebrow">Features</div>
            <h2>SkiRadar deckt alle Datenpunkte für deinen Powder-Plan ab</h2>
            <p>
              Von Schneehöhen über Windrichtung bis zur gefühlten Temperatur: Wir kombinieren
              Sensoren, Stationsdaten und Webcams, damit du in Sekunden entscheiden kannst.
            </p>
          </div>
          <div className="landing-grid">
            <div className="landing-tile">
              <div className="eyebrow">Conditions Stack</div>
              <h3>AI + Calculator</h3>
              <p>
                SkiRadar Intelligence™ gewichtet Powder, Touring und Family Days, der Conditions
                Calculator liefert einen klaren Score.
              </p>
            </div>
            <div className="landing-tile">
              <div className="eyebrow">Wetter & Schnee</div>
              <h3>Alle Sensoren in Echtzeit</h3>
              <p>Wind, Temperatur, Schneehöhen und Neuschnee werden kontinuierlich synchronisiert.</p>
            </div>
            <div className="landing-tile">
              <div className="eyebrow">Webcams & Sharing</div>
              <h3>Visuelle Checks & Teamlinks</h3>
              <p>Original-Cams plus gespeicherte Filter lassen sich direkt teilen – mobil und Desktop.</p>
            </div>
          </div>
        </section>

        <section className="landing-seo" aria-labelledby="landing-seo-title">
          <details className="detail-seo" aria-labelledby="landing-seo-title">
            <summary>
              <span id="landing-seo-title">Mehr Infos</span>
              <span className="detail-seo__chevron" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="detail-seo__body">
              <p>
                SkiRadar liefert präzise Schneeberichte für Österreich, Deutschland, die Schweiz und
                Südtirol – inklusive Skigebiet-Wettervorhersage, Schneeradar und Temperaturtrends. So
                bedienen wir Suchanfragen wie &ldquo;Schneebericht heute&rdquo;,
                &ldquo;Skiwetter Tirol&rdquo; oder &ldquo;bestes Skigebiet bei Neuschnee&rdquo; mit
                echten Nutzersignalen.
              </p>
              <ul className="landing-seo__list">
                <li>
                  <strong>Beliebte Keywords:</strong> Schneeprognose Alpen, Skigebiet Wetter, Powder
                  Forecast, Webcams Live.
                </li>
                <li>
                  <strong>Content-Fokus:</strong> Schneehöhen, Pistenbedingungen, Temperaturverlauf,
                  Windrichtung, fühlbare Kälte.
                </li>
                <li>
                  <strong>Use Cases:</strong> Weekend Warriors, Bergbahnen, Reiseveranstalter,
                  Snowboarding Crews.
                </li>
              </ul>
              <p>
                Automatische Updates, On-Demand-Webcams und der Conditions Calculator liefern allen
                Suchenden nach &ldquo;Skiurlaub Wetter&rdquo; oder &ldquo;Schnee Lagebericht&rdquo;
                genau die Insights, die sie erwarten – kompakt, teilbar und messbar.
              </p>
            </div>
          </details>
        </section>
      </div>
    </>
  );
}
