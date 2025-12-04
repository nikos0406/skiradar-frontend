export type WeatherForecast = {
    id: number
    ski_resort_id: number
    forecast_date: string
    temp_min_c?: number,
    temp_max_c?: number,
    precipitation_mm?: number,
    wind_kmh?: number,
    snow_forecast_cm?: number,
    weather_description?: string,
    weather_code?: number,
    weather_rating?: string | null,
    forecast_run: string
}
