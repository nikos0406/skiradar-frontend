import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function LandingPage() {
  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Schnee & Wetter auf einen Blick" />
      <div className="landing">
        <section className="landing-hero">
          <div className="landing-hero__content">
            <div className="landing-badge">Live</div>
            <h1>Die schlanke Übersicht für deine Skitage</h1>
            <p>
              Temperatur, Neuschnee, Wind und Webcams – automatisch aktualisiert für deine
              favorisierten Skigebiete. Du siehst live, was wirklich zählt.
            </p>
            <div className="landing-cta">
              <Link className="btn-primary" href="/">
                Zu den Live-Daten
              </Link>
            </div>
            <div className="landing-meta">
              <span>Automatische Updates</span>
              <span>Desktop & Mobil</span>
              <span>Wetter + Webcams</span>
            </div>
          </div>

          <div className="landing-hero__card">
            <div className="landing-card__header">
              <div>
                <div className="eyebrow">So funktioniert&apos;s</div>
                <h3>In drei Schritten startklar</h3>
              </div>
              <span className="pill">Schnell</span>
            </div>
            <ul className="landing-card__list">
              <li>
                <div>
                  <div className="item-label">Live-Daten öffnen</div>
                  <div className="item-value">Alles auf einer Seite</div>
                </div>
                <span className="item-badge">Sofort</span>
              </li>
              <li>
                <div>
                  <div className="item-label">Live-Daten abrufen</div>
                  <div className="item-value">Temperatur, Wind, Schnee</div>
                </div>
                <span className="item-badge muted">Automatisch</span>
              </li>
              <li>
                <div>
                  <div className="item-label">Filtern & sortieren</div>
                  <div className="item-value">Favoriten im Blick (Coming soon)</div>
                </div>
                <span className="item-badge">Klar</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="landing-grid">
          <div className="landing-tile">
            <div className="eyebrow">Wetter + Schnee</div>
            <h3>Was zählt, auf einen Blick</h3>
            <p>Schneehöhe, Neuschnee, Wind und Temperatur – klar gewichtet und sofort erfassbar.</p>
          </div>
          <div className="landing-tile">
            <div className="eyebrow">Webcams</div>
            <h3>Direkt aus dem Gebiet</h3>
            <p>Aktuelle Bilder aus deinen Spots, ohne sich durch Webseiten zu klicken.</p>
          </div>
          <div className="landing-tile">
            <div className="eyebrow">Filter & Sortierung</div>
            <h3>Finde deine Favoriten</h3>
            <p>Filtere nach Land oder Bundesland und sortiere nach Wind oder Temperatur.</p>
          </div>
        </section>
      </div>
    </>
  );
}
