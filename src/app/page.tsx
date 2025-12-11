import { SiteHeader } from "@/components/SiteHeader";
import { ResortList } from "@/components/ResortList";
import { fetchResorts } from "@/lib/api";

async function loadResorts() {
  try {
    return await fetchResorts();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function HomePage() {
  const resorts = await loadResorts();

  return (
    <>
      <SiteHeader
        title="SkiRadar"
        subtitle="Schnee, Wetter & Skigebiete im Überblick"
        action={
          <div className="chip-live">
            <span className="chip-dot" />
            Live
          </div>
        }
      />

      <div className="page">
        <section className="intro-card">
          <h1 className="intro-title">Skigebiete & Bedingungen</h1>
          <p className="intro-subtitle">
            Temperatur, Schneehöhen, Neuschnee &amp; Wind – automatisch aktualisiert
          </p>
        </section>

        {!resorts ? (
          <div className="empty">Fehler beim Laden der Skigebiete.</div>
        ) : resorts.length === 0 ? (
          <div className="empty">Noch keine Skigebiete hinzugefügt.</div>
        ) : (
          <ResortList resorts={resorts} />
        )}
      </div>
    </>
  );
}
