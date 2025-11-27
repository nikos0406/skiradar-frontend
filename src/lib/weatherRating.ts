import { WeatherRating } from "@/types/resort";

export const WEATHER_RATING_LABELS: Record<WeatherRating, string> = {
  EXCELLENT: "Sehr gut",
  GOOD: "Gut",
  MODERATE: "Mittel",
  POOR: "Schlecht",
};

export const WEATHER_RATING_KEYS = Object.keys(WEATHER_RATING_LABELS) as WeatherRating[];

const WEATHER_RATING_LABEL_FROM_TEXT: Record<string, WeatherRating> = Object.entries(
  WEATHER_RATING_LABELS,
).reduce((acc, [rating, label]) => {
  acc[label.toLowerCase()] = rating as WeatherRating;
  return acc;
}, {} as Record<string, WeatherRating>);

export const WEATHER_RATING_ORDER: Record<WeatherRating, number> = {
  EXCELLENT: 3,
  GOOD: 2,
  MODERATE: 1,
  POOR: 0,
};

export function normalizeWeatherRating(value?: WeatherRating | string | null): WeatherRating | null {
  if (!value) return null;
  const normalized = String(value).trim();
  const byCode = normalized.toUpperCase() as WeatherRating;
  if (byCode in WEATHER_RATING_LABELS) return byCode;
  const byLabel = WEATHER_RATING_LABEL_FROM_TEXT[normalized.toLowerCase()];
  return byLabel ?? null;
}

export function formatWeatherRating(value?: WeatherRating | string | null, fallback = "—") {
  const normalized = normalizeWeatherRating(value);
  if (normalized) return WEATHER_RATING_LABELS[normalized];
  return value ?? fallback;
}

export function weatherRatingScore(value?: WeatherRating | string | null): number {
  const normalized = normalizeWeatherRating(value);
  return normalized ? WEATHER_RATING_ORDER[normalized] : -Infinity;
}

export function weatherRatingClassSuffix(value?: WeatherRating | string | null) {
  const normalized = normalizeWeatherRating(value);
  return normalized ? normalized.toLowerCase() : "muted";
}
