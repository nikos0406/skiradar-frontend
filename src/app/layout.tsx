import type { Metadata } from "next";
import "./globals.css";

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
          src="http://localhost:8081/js/script.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
