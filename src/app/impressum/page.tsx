import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und gesetzliche Pflichtangaben für ${SITE_NAME}.`,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ImpressumPage() {
  return (
    <>
      <SiteHeader title={SITE_NAME} subtitle="Impressum" />

      <div className="page">
        <div className="container">
          <Image
            src="/impressum.png"
            alt="Impressum"
            width={1070}
            height={1384}
            priority
            draggable={false}
            className="w-full max-w-[1070px] select-none rounded-xl"
          />
        </div>
      </div>
    </>
  );
}