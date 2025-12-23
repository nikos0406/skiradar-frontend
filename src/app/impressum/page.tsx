import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und gesetzliche Pflichtangaben für ${SITE_NAME}.`,
  alternates: {
    canonical: absoluteUrl("/impressum"),
  },
};

export default function ImpressumPage() {
  return (
    <>
      <SiteHeader title={SITE_NAME} subtitle="Impressum" />

      <div className="page">
        <div className="container">
          <div className="header-form">
            <h1>Impressum</h1>
            <p className="subtitle">
              Pflichtangaben nach Mediengesetz, ECG und UGB.
            </p>
          </div>

          <section>
            <h2>Medieninhaber und Herausgeber</h2>
            <p><strong>Nikos Kounakas</strong></p>
            <p>Singerberggasse 21, 9020, Österreich</p>
            <p>Unternehmensgegenstand: Betrieb der Plattform SkiRadar</p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p><strong>E-Mail: </strong>support@skiradar.at</p>
          </section>

          <section>
            <h2>Rechtsform</h2>
            <p>Privatperson (nicht eingetragenes Unternehmen)</p>
          </section>

          <section>
            <h2>Blattlinie</h2>
            <p>
              Information über Schneeverhältnisse, Wetterdaten und Skigebiete mit dem Ziel,
              Nutzerinnen und Nutzern eine bessere Planung von Skitagen zu ermöglichen.
            </p>
          </section>

          <section>
            <h2>Haftung für Inhalte</h2>
            <p>
              Die Inhalte dieser Website werden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
          </section>

          <section>
            <h2>Haftung für Links</h2>
            <p>
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
