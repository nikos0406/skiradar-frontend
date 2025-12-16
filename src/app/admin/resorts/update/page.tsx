'use client';

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { checkAdminSession, fetchAllResorts, normalizeWebcamUrl, updateResort } from "@/lib/api";
import { SkiResort } from "@/types/resort";

export default function UpdateResortPage() {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [selected, setSelected] = useState<SkiResort | null>(null);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function load() {
      try {
        await checkAdminSession();
        setAuthorized(true);
        const data = await fetchAllResorts();
        setResorts(data);
      } catch (error) {
        console.error(error);
        setAuthorized(false);
        setAlert({ type: "error", text: "Bitte zuerst einloggen." });
      }
    }
    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setAlert({ type: "error", text: "Bitte zuerst ein Skigebiet auswählen." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const latRaw = String(formData.get("lat") || "").trim();
    const lonRaw = String(formData.get("lon") || "").trim();
    const imageUrl = normalizeWebcamUrl(String(formData.get("image_url") || "").trim());

    const payload: Record<string, any> = {};
    if (name) payload.name = name;

    if (latRaw) {
      const lat = Number(latRaw.replace(",", "."));
      if (Number.isNaN(lat)) {
        setAlert({ type: "error", text: "Breitengrad muss eine Zahl sein." });
        return;
      }
      payload.lat = lat;
    }

    if (lonRaw) {
      const lon = Number(lonRaw.replace(",", "."));
      if (Number.isNaN(lon)) {
        setAlert({ type: "error", text: "Längengrad muss eine Zahl sein." });
        return;
      }
      payload.lon = lon;
    }

    if (imageUrl) payload.image_url = imageUrl;

    if (Object.keys(payload).length === 0) {
      setAlert({ type: "error", text: "Bitte mindestens einen Wert ändern." });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const updated = await updateResort(selected.id, payload);
      setSelected(updated);
      const nextResorts = resorts.map((r) => (r.id === updated.id ? updated : r));
      setResorts(nextResorts);
      setAlert({ type: "success", text: `Skigebiet ${updated.name} aktualisiert.` });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", text: (error as Error).message || "Update fehlgeschlagen" });
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return resorts;
    return resorts.filter((resort) => resort.name.toLowerCase().includes(term));
  }, [resorts, search]);

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Admin · Skigebiete bearbeiten" backHref="/admin" />
      <div className="page">
        <div className="container">
          <Link href="/admin" className="nav-link">
            ← Zurück zum Menü
          </Link>

          <form onSubmit={handleSubmit} key={selected?.id ?? "none"}>
            <div className="header-form">
              <h1>Skigebiet bearbeiten</h1>
              <p className="subtitle">
                Wähle ein Skigebiet aus der Liste und passe Name, Koordinaten oder Bild-URL an.
              </p>
            </div>

            {alert ? <div className={`alert ${alert.type}`}>{alert.text}</div> : null}

            <div className="form-group">
              <label htmlFor="id">Ausgewählte ID</label>
              <input id="id" type="text" value={selected?.id ?? ""} readOnly placeholder="Bitte Skigebiet wählen" />
            </div>

            <div className="form-group">
              <label htmlFor="name">Neuer Name (optional)</label>
              <input id="name" type="text" name="name" defaultValue={selected?.name ?? ""} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lat">Breitengrad (optional)</label>
                <input id="lat" type="text" name="lat" defaultValue={selected?.lat ?? ""} />
              </div>
              <div className="form-group">
                <label htmlFor="lon">Längengrad (optional)</label>
                <input id="lon" type="text" name="lon" defaultValue={selected?.lon ?? ""} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image_url">Bild / Webcam URL (optional)</label>
              <input id="image_url" type="text" name="image_url" defaultValue={selected?.image_url ?? ""} />
            </div>

            <button className="btn" type="submit" disabled={loading || !authorized}>
              {loading ? "Speichere..." : "Skigebiet aktualisieren"}
            </button>
          </form>

          <div className="list-header">Vorhandene Skigebiete</div>
          <div className="form-group">
            <label htmlFor="resortSearch">Suche nach Name</label>
            <input
              id="resortSearch"
              type="text"
              placeholder="z. B. Ischgl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="resort-list">
            {filtered.length === 0 ? (
              <div className="empty">Keine Skigebiete gefunden.</div>
            ) : (
              filtered.map((resort) => (
                <div key={resort.id} className="resort-row">
                  <div className="resort-meta">
                    <span className="resort-name">{resort.name}</span>
                    <span className="resort-id">ID: {resort.id}</span>
                    <span className="resort-id">
                      Lat: {resort.lat ?? "–"}, Lon: {resort.lon ?? "–"}
                    </span>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={() => setSelected(resort)}>
                    In Formular übernehmen
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
