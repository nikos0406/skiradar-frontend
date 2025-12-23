const FALLBACK_SITE_URL = "https://www.skiradar.app";

function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL);
export const SITE_NAME = "SkiRadar";
export const SITE_TAGLINE = "Live Skiwetter, Schneeberichte & Panorama-Webcams";
export const SITE_DESCRIPTION =
  "SkiRadar vereint Live-Skiwetter, Neuschnee, Wind und HD-Webcams aus beliebten Skigebieten. Hol dir die relevanten Schneebedingungen in einer einzigen Oberfläche.";

export const SEO_KEYWORDS = [
  "Ski Wetter",
  "Schneebericht",
  "Ski Webcams",
  "Neuschnee Vorhersage",
  "Skigebiet Wetter",
  "Alpen Wetter Radar",
  "Alpen Wetter Live",
  "Lawinenlage",
];

export const PRIMARY_NAV_LINKS = [
  { href: "/#skiwetter", label: "Live Skiwetter" },
  { href: "/#webcams", label: "Webcams" },
  { href: "/landing", label: "Produkt" },
  { href: "/#faq", label: "FAQ" },
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "de-DE",
  potentialAction: [
    {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  ],
};

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: absoluteUrl("/images/logo-small.svg"),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@skiradar.app",
      areaServed: "DE,AT,CH,IT,FR",
      availableLanguage: ["de", "en"],
    },
  ],
};
