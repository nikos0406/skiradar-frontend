import { SkiResort } from "@/types/resort";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

type ApiError = Error & { status?: number };

const defaultInit: RequestInit = {
  cache: "no-store",
  credentials: "include",
};

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const error = new Error(body?.detail || body?.message || response.statusText) as ApiError;
    error.status = response.status;
    throw error;
  }

  return body as T;
}

export async function fetchResorts(resortId?: number) {
  const query = resortId ? `?resort_id=${resortId}` : "";
  const response = await fetch(buildUrl(`/api/resorts/list${query}`), defaultInit);
  return parseResponse<SkiResort[]>(response);
}

export async function adminLogin(username: string, password: string) {
  const response = await fetch(buildUrl("/api/admin/login"), {
    ...defaultInit,
    method: "POST",
    body: new URLSearchParams({ username, password }),
  });

  return parseResponse<{ message: string }>(response);
}

export async function adminLogout() {
  const response = await fetch(buildUrl("/api/admin/logout"), {
    ...defaultInit,
    method: "POST",
  });

  return parseResponse<{ message: string }>(response);
}

export async function checkAdminSession() {
  const response = await fetch(buildUrl("/api/admin/session"), defaultInit);
  return parseResponse<{ username: string }>(response);
}

export function normalizeWebcamUrl(url?: string | null) {
  if (!url) return "";
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.endsWith(".jpg") ? trimmed : `${trimmed}/current/720.jpg`;
}

export async function createResort(payload: { name: string; image_url?: string }) {
  const response = await fetch(buildUrl("/api/resorts/add"), {
    ...defaultInit,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<SkiResort>(response);
}

export async function updateResort(
  id: number,
  payload: Partial<Pick<SkiResort, "name" | "lat" | "lon" | "image_url">>,
) {
  const response = await fetch(buildUrl(`/api/resorts/${id}`), {
    ...defaultInit,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<SkiResort>(response);
}

export async function deleteResort(id: number) {
  const response = await fetch(buildUrl(`/api/resorts/${id}`), {
    ...defaultInit,
    method: "DELETE",
  });

  return parseResponse<SkiResort>(response);
}
