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
        <span className="detail-banner__share-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation" focusable="false">
            <path d="M18 8a3 3 0 1 0-2.82-4 3 3 0 0 0 .06.59L8.91 8.36a3 3 0 1 0 0 3.28l6.33 3.76a3 3 0 1 0 .91-1.4l-6.32-3.76a3.16 3.16 0 0 0 0-.72l6.33-3.76A3 3 0 0 0 18 8Z" />
          </svg>
        </span>
        Teilen
      </button>
      {feedback ? <span className="detail-banner__share-feedback">{feedback}</span> : null}
    </div>
  );
}
