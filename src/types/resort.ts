export type SkiResort = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  state: string;
  country: string;
  image_url?: string | null;
  weather_description?: string | null;
  temp_c?: number | null;
  wind_kmh?: number | null;
  snow_depth_cm?: number | null;
  snow_depth_yesterday_cm?: number | null;
  snow_new_cm?: number | null;
  snow_ref_date?: string | null;
  last_update?: string | null;
};
