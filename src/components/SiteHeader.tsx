'use client';

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
};

export function SiteHeader({ title, subtitle, backHref, action }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      const pastThreshold = currentY > 40;
      setCollapsed(scrollingDown && pastThreshold);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${collapsed ? "header--collapsed" : ""}`}>
      <div className="header-inner">
        <Link href="/landing" className="header-brand" aria-label="Zur Landingpage">
          <div className="header-logo">
            <Image src="/images/logo.svg" alt="SkiRadar Logo" width={40} height={40} priority />
          </div>
          <div>
            <div className="header-text-main">{title}</div>
            {subtitle ? <div className="header-text-sub">{subtitle}</div> : null}
          </div>
        </Link>

        <div className="header-right">
          {action}
        </div>
      </div>
    </header>
  );
}
