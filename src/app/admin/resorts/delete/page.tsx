'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { checkAdminSession, deleteResort, fetchResorts } from "@/lib/api";
import { SkiResort } from "@/types/resort";

export default function DeleteResortPage() {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [idInput, setIdInput] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function load() {
      try {
        await checkAdminSession();
        setAuthorized(true);
        const data = await fetchResorts();
        setResorts(data);
      } catch (error) {
        console.error(error);
        setAuthorized(false);
        setAlert({ type: "error", text: "Bitte zuerst einloggen." });
      }
    }
    load();
  }, []);

  async function performDelete(id: number, label?: string) {
    const confirmed = confirm(`Skigebiet "${label ?? id}" wirklich löschen?`);
    if (!confirmed) return;

    setLoading(true);
    setAlert(null);
    try {
      const deleted = await deleteResort(id);
      const deletedId = deleted?.id ?? id;
      const deletedName = deleted?.name ?? label ?? `ID ${id}`;

      setResorts((prev) => prev.filter((r) => r.id !== deletedId));
      setAlert({ type: "success", text: `"${deletedName}" wurde gelöscht.` });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", text: (error as Error).message || "Löschen fehlgeschlagen" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(idInput);
    if (Number.isNaN(parsed)) {
      setAlert({ type: "error", text: "Die ID muss eine Zahl sein." });
      return;
    }

    await performDelete(parsed);
    setIdInput("");
  }

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Admin · Skigebiet löschen" backHref="/admin" />
      <div className="page">
        <div className="container">
          <Link href="/admin" className="nav-link">
            ← Zurück zum Menü
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="header-form">
              <h1>Skigebiet löschen</h1>
              <p className="subtitle">Nach ID löschen – oder direkt aus der Liste unten.</p>
            </div>

            {alert ? <div className={`alert ${alert.type}`}>{alert.text}</div> : null}

            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                id="id"
                type="number"
                placeholder="z. B. 3"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                required
              />
            </div>

            <button className="btn" type="submit" disabled={loading || !authorized}>
              {loading ? "Lösche..." : "Skigebiet per ID löschen"}
            </button>
          </form>

          <div className="list-header">Vorhandene Skigebiete</div>
          <div className="resort-list">
            {resorts.length === 0 ? (
              <div className="empty">Noch keine Skigebiete vorhanden.</div>
            ) : (
              resorts.map((resort) => (
                <div key={resort.id} className="resort-row">
                  <div className="resort-meta">
                    <span className="resort-name">{resort.name}</span>
                    <span className="resort-id">ID: {resort.id}</span>
                  </div>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={loading || !authorized}
                    onClick={() => performDelete(resort.id, resort.name)}
                  >
                    Löschen
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
