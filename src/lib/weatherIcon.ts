import { WeatherIconVariant } from "@/components/WeatherIcon";

export function resolveWeatherIconVariant(
  code?: number | null,
  descriptionRaw?: string | null,
): WeatherIconVariant {
  if (typeof code === "number") {
    if (code === 0) return "sunny";
    if (code === 1 || code === 2) return "partlycloudy";
    if (code === 3) return "mostlycloudy";
    if (code === 45 || code === 48) return "fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "rain";
    if ([61, 63, 65, 80, 81, 82].includes(code)) return "rain";
    if ([66, 67].includes(code)) return "sleet";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "tstorms";
  }

  const description = (descriptionRaw ?? "").toLowerCase();
  if (description.includes("thunder") || description.includes("gewit")) return "tstorms";
  if (description.includes("sleet") || description.includes("eisregen")) return "sleet";
  if (description.includes("flurries")) return "flurries";
  if (description.includes("snow") || description.includes("schnee")) return "snow";
  if (description.includes("rain") || description.includes("regen") || description.includes("shower"))
    return "rain";
  if (description.includes("fog") || description.includes("nebel") || description.includes("haze"))
    return "fog";
  if (description.includes("cloud") || description.includes("bewölkt") || description.includes("overcast"))
    return "mostlycloudy";
  if (description.includes("sun") || description.includes("klar") || description.includes("clear"))
    return "sunny";

  return "partlycloudy";
}
