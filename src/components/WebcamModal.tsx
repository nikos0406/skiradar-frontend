'use client';

import { useState } from "react";

type Props = {
  imageSrc: string;
  resortName?: string | null;
};

export function WebcamModal({ imageSrc, resortName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const title = resortName ? `Webcam Vollbild – ${resortName}` : "Webcam Vollbild";

  return (
    <>
      <button
        type="button"
        className="detail-image-link"
        onClick={() => setIsOpen(true)}
        aria-label="Webcam in groß anzeigen"
      >
        <img className="detail-banner__image" src={imageSrc} alt={title} />
      </button>

      <div
        className={`image-modal ${isOpen ? "image-modal--visible" : ""}`}
        aria-hidden={isOpen ? "false" : "true"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button type="button" className="image-modal__backdrop" aria-label="Schließen" onClick={() => setIsOpen(false)} />
        <div className="image-modal__dialog">
          <img src={imageSrc} alt={title} />
          <button
            type="button"
            className="image-modal__close"
            aria-label="Schließen"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
