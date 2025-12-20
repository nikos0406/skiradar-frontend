import type { Metadata, Viewport } from "next";
import "./styles/base.css";
import "./styles/global-reset-base.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/typografie.css";
import "./styles/forms.css";
import "./styles/buttons.css";
import "./styles/alerts.css";
import "./styles/startseite-intro-karten.css";
import "./styles/admin-hub.css";
import "./styles/bild-preview.css";
import "./styles/delete-seite-resort-liste.css";
import "./styles/loading-states.css";
import "./styles/utility-classes.css";
import "./styles/print-styles.css";
import "./styles/responsive.css";
import "./styles/footer.css";
import "./styles/landing-page.css";
import "./styles/weather-icons.css";
import "./styles/cookie-banner.css";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieDisclaimer } from "@/components/CookieDisclaimer";
import {
  ORGANIZATION_JSON_LD,
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  WEBSITE_JSON_LD,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  generator: SITE_NAME,
  category: "travel",
  icons: { icon: "/icon.svg" },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/images/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: SITE_TAGLINE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/images/placeholder.jpg"],
    creator: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#2778c0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <meta name="geo.region" content="DE" />
        <script
          defer
          data-domain="skiradar.at"
          src="http://localhost:8081/js/script.js"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </head>
      <body>
        {children}
        <SiteFooter />
        <CookieDisclaimer />
      </body>
    </html>
  );
}
