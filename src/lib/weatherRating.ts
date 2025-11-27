export const WEATHER_RATING_LABELS = {
  EXCELLENT: "Sehr gut",
  GOOD: "Gut",
  MODERATE: "Mittel",
  POOR: "Schlecht",
} as const;

export type WeatherRatingKey = keyof typeof WEATHER_RATING_LABELS;

export const WEATHER_RATING_KEYS = Object.keys(WEATHER_RATING_LABELS) as WeatherRatingKey[];

const WEATHER_RATING_LABEL_FROM_TEXT: Record<string, WeatherRatingKey> = Object.entries(
  WEATHER_RATING_LABELS,
).reduce((acc, [rating, label]) => {
  acc[label.toLowerCase()] = rating as WeatherRatingKey;
  return acc;
}, {} as Record<string, WeatherRatingKey>);

export const WEATHER_RATING_ORDER: Record<WeatherRatingKey, number> = {
  EXCELLENT: 3,
  GOOD: 2,
  MODERATE: 1,
  POOR: 0,
};

export function normalizeWeatherRating(
  value?: WeatherRatingKey | string | null,
): WeatherRatingKey | null {
  if (!value) return null;
  const normalized = String(value).trim();
  const byCode = normalized.toUpperCase() as WeatherRatingKey;
  if (byCode in WEATHER_RATING_LABELS) return byCode;
  const byLabel = WEATHER_RATING_LABEL_FROM_TEXT[normalized.toLowerCase()];
  return byLabel ?? null;
}

export function formatWeatherRating(value?: WeatherRatingKey | string | null, fallback = "—") {
  const normalized = normalizeWeatherRating(value);
  if (normalized) return WEATHER_RATING_LABELS[normalized];
  return value ?? fallback;
}

export function weatherRatingScore(value?: WeatherRatingKey | string | null): number {
  const normalized = normalizeWeatherRating(value);
  return normalized ? WEATHER_RATING_ORDER[normalized] : -Infinity;
}

export function weatherRatingClassSuffix(value?: WeatherRatingKey | string | null) {
  const normalized = normalizeWeatherRating(value);
  return normalized ? normalized.toLowerCase() : "muted";
}
