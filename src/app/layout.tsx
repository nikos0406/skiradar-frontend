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
      <body>{children}</body>
    </html>
  );
}
