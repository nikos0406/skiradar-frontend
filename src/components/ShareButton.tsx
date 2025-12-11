"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  resortName?: string | null;
};

const SHARE_SUCCESS_MSG = "Link kopiert";
const SHARE_ERROR_MSG = "Teilen nicht möglich";

export function ShareButton({ resortName }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const showFeedback = useCallback(
    (message: string) => {
      clearTimer();
      setFeedback(message);
      timerRef.current = setTimeout(() => {
        setFeedback(null);
      }, 2500);
    },
    [clearTimer],
  );

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = resortName ? `${resortName} · SkiRadar` : "SkiRadar";
    const text = "Live Daten & Forecast über SkiRadar";

    try {
      if (navigator.share && url) {
        await navigator.share({ title, text, url });
        showFeedback(SHARE_SUCCESS_MSG);
        return;
      }

      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
        showFeedback(SHARE_SUCCESS_MSG);
        return;
      }

      showFeedback(SHARE_ERROR_MSG);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      showFeedback(SHARE_ERROR_MSG);
    }
  }, [resortName, showFeedback]);

  return (
    <div className="detail-banner__share" aria-live="polite">
      <button type="button" className="detail-banner__share-button" onClick={handleShare} aria-label="SkiRadar Link teilen">
        Teilen
      </button>
      {feedback ? <span className="detail-banner__share-feedback">{feedback}</span> : null}
    </div>
  );
}
