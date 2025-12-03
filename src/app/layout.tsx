import type { Metadata } from "next";
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
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "SkiRadar",
  description: "Live Daten zu Skigebieten, Schnee und Wetter.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
      <script
        defer
        data-domain="192.168.0.10"
        src="http://192.168.0.10:8081/js/script.js"
      ></script>
      </head>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
