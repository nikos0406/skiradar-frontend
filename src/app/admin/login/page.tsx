'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await adminLogin(username, password);
      setMessage("Login erfolgreich. Weiterleitung …");
      setTimeout(() => router.push("/admin"), 400);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader title="SkiRadar" subtitle="Admin Login" backHref="/" />
      <div className="page">
        <div className="container container--narrow">
          <div className="nav-link">
            <Link href="/">← Zurück zur Übersicht</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="header-form">
              <h1>Admin Login</h1>
              <p className="subtitle">Cookie wird automatisch gesetzt.</p>
            </div>

            {message ? <div className="alert success">{message}</div> : null}
            {error ? <div className="alert error">{error}</div> : null}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Passwort</label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logge ein..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
