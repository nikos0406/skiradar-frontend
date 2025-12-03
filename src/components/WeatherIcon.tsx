type WeatherIconVariant =
  | "sunny"
  | "partlycloudy"
  | "mostlycloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "tstorms"
  | "sleet"
  | "flurries"
  | "snow";

type Props = {
  variant: WeatherIconVariant;
  label?: string | null;
};

const variantClassMap: Record<WeatherIconVariant, string> = {
  sunny: "sunny",
  partlycloudy: "partlycloudy",
  mostlycloudy: "mostlycloudy",
  cloudy: "cloudy",
  fog: "fog",
  rain: "rain",
  tstorms: "tstorms",
  sleet: "sleet",
  flurries: "flurries",
  snow: "snow",
};

export function WeatherIcon({ variant, label }: Props) {
  const iconClass = variantClassMap[variant] ?? "cloudy";

  return (
    <div className="weatherIcon forecast-icon" role="img" aria-label={label ?? variant}>
      <div className={iconClass}>
        <div className="inner" />
      </div>
    </div>
  );
}

export type { WeatherIconVariant };
