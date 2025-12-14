"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "skiradar-cookie-ack";

export function CookieDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setIsOpen(!stored);
  }, []);

  const acknowledgeCookies = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsOpen(false);
  };

  const denyCookies = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie Hinweis">
      <div className="cookie-banner__content">
        <h2 className="cookie-banner__title">Cookies & Analytics</h2>
        <p className="cookie-banner__text">
          Essenzielle Cookies halten SkiRadar am Laufen, anonymisierte Analytics helfen uns, das Erlebnis kontinuierlich zu
          verbessern.
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__button cookie-banner__button--ghost" onClick={denyCookies}>
          Ablehnen
        </button>
        <button type="button" className="cookie-banner__button cookie-banner__button--primary" onClick={acknowledgeCookies}>
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
