'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { checkAdminSession, createResort, normalizeWebcamUrl } from "@/lib/api";

export default function AddResortPage() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        await checkAdminSession();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
        setAlert({ type: "error", text: "Bitte zuerst einloggen." });
      }
    }
    verify();
  }, []);

  useEffect(() => {
    const normalized = normalizeWebcamUrl(imageUrl);
    setPreview(normalized.length > 4 ? normalized : null);
  }, [imageUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      await createResort({ name: name.trim(), image_url: normalizeWebcamUrl(imageUrl) });
      setAlert({ type: "success", text: "Skigebiet wurde angelegt." });
      setName("");
      setImageUrl("");
      setPreview(null);
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", text: (error as Error).message || "Fehler beim Anlegen" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Admin · Skigebiet hinzufügen" backHref="/admin" />
      <div className="page">
        <div className="container">
          <Link href="/admin" className="nav-link">
            ← Zurück zum Menü
          </Link>
          <div className="header-form">
            <h1>Skigebiet hinzufügen</h1>
            <p className="subtitle">Name &amp; Bild/Webcam-URL speichern.</p>
          </div>

          {alert ? <div className={`alert ${alert.type}`}>{alert.text}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Skigebiet Name *</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. St. Anton"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Bild / Webcam URL</label>
              <input
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
              />
              <div className="subtitle">
                Wird automatisch zu&nbsp;
                <code>{normalizeWebcamUrl(imageUrl) || "https://…/current/720.jpg"}</code>
              </div>
              <div className="preview" style={{ display: preview ? "block" : "none" }}>
                {preview ? <img src={preview} alt="Vorschau" /> : null}
              </div>
            </div>

            <button className="btn" type="submit" disabled={loading || !authorized}>
              {loading ? "Speichere..." : "Skigebiet hinzufügen"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
