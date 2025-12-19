import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-title">SkiRadar</div>
          <p className="footer-desc">Live-Daten zu Schnee, Wetter und Webcams.</p>
          <span className="footer-meta">© {year} SkiRadar</span>
          <a
            className="hosttech"
            href="https://www.hosttech.at/?promocode=62198340"
            target="_blank"
            rel="noreferrer"
            title="Powered by hosttech"
          >
            <img
              src="https://hosttech.eu/affiliate/logos/powered-by/powered-by-120x40px-inverted-bg.svg"
              alt="Powered by hosttech"
              width={120}
              height={40}
            />
          </a>
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
