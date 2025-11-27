import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-title">SkiRadar</div>
          <p className="footer-desc">
            Live-Daten zu Schnee, Wetter und Webcams aus deinen favorisierten Skigebieten.
          </p>
          <span className="footer-meta">© {year} SkiRadar</span>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <Link href="/landing">Überblick</Link>
            <Link href="/">Live-Daten</Link>
          </div>
          <div className="footer-col">
            <a href="mailto:support@skiradar.app">Kontakt</a>
            <a href="mailto:feedback@skiradar.app">Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
