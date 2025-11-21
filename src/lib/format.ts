export function isFresh(dateString?: string | null) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= 1;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "unbekannt";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function fallbackImage(url?: string | null) {
  return url && url.trim().length > 0 ? url : "/images/placeholder.jpg";
}
