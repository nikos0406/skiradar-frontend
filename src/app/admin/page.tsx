'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { adminLogout, checkAdminSession } from "@/lib/api";

export default function AdminHub() {
  const [status, setStatus] = useState<"checking" | "ok" | "unauthenticated">("checking");
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const session = await checkAdminSession();
        setUsername(session.username);
        setStatus("ok");
      } catch {
        setStatus("unauthenticated");
      }
    }
    load();
  }, []);

  async function handleLogout() {
    try {
      await adminLogout();
      setUsername(null);
      setMessage("Abgemeldet");
      setStatus("unauthenticated");
    } catch (error) {
      console.error(error);
      setMessage("Logout fehlgeschlagen.");
    }
  }

  return (
    <div className="layout-admin">
      <SiteHeader
        title="SkiRadar"
        subtitle="Admin · Menü"
      />

      <div className="page">
        <div className="container">
          <Link href="/" className="nav-link">
            ← Zurück zur Übersicht
          </Link>
          <div className="header-form">
            <h1>Admin Hub</h1>
            <p className="subtitle">Wähle eine Aktion für deine Skigebiete.</p>
          </div>

          {message ? <div className="alert success">{message}</div> : null}
          {status === "unauthenticated" ? (
            <div className="alert error">
              Nicht eingeloggt – bitte über <Link href="/admin/login">Login</Link> anmelden.
            </div>
          ) : null}
          {status === "ok" ? (
            <div className="alert success">Eingeloggt als <strong>{username}</strong>.</div>
          ) : null}

          <div className="hub-actions">
            <Link href="/admin/resorts/add" className="hub-card add">
              <div>
                <div className="hub-card-icon">＋</div>
                <div className="hub-card-title">Skigebiet hinzufügen</div>
                <div className="hub-card-desc">
                  Neues Skigebiet mit Namen und Bild-/Webcam-URL anlegen und sofort im System verfügbar machen.
                </div>
              </div>
            </Link>

            <Link href="/admin/resorts/update" className="hub-card update">
              <div>
                <div className="hub-card-icon">🔄</div>
                <div className="hub-card-title">Skigebiet bearbeiten</div>
                <div className="hub-card-desc">
                  Ein bestehendes Skigebiet aus der Übersicht bearbeiten.
                </div>
              </div>
            </Link>

            <Link href="/admin/resorts/delete" className="hub-card delete">
              <div>
                <div className="hub-card-icon">🗑️</div>
                <div className="hub-card-title">Skigebiet löschen</div>
                <div className="hub-card-desc">
                  Ein bestehendes Skigebiet aus der Übersicht entfernen.
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
