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
  const page = await loadResorts();

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

        {!page ? (
          <div className="empty">Fehler beim Laden der Skigebiete.</div>
        ) : page.items.length === 0 ? (
          <div className="empty">Noch keine Skigebiete hinzugefügt.</div>
        ) : (
          <ResortList initialPage={page} />
        )}
      </div>
    </>
  );
}
