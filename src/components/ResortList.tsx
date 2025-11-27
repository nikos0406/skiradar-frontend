'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { SkiResort, WeatherRating } from "@/types/resort";
import { fallbackImage, isFresh } from "@/lib/format";
import {
  WEATHER_RATING_KEYS,
  WEATHER_RATING_LABELS,
  formatWeatherRating,
  normalizeWeatherRating,
  weatherRatingClassSuffix,
  weatherRatingScore,
} from "@/lib/weatherRating";

type Props = { resorts: SkiResort[] };

function ResortCard({ resort }: { resort: SkiResort }) {
  const fresh = isFresh(resort.last_update);
  const targetUrl = resort.id != null ? `/resort/${resort.id}` : "/resort";
  const rating = normalizeWeatherRating(resort.weather_rating);

  return (
    <Link href={targetUrl} className="card" prefetch>
      <div className="image-wrapper">
        <img className="image" src={fallbackImage(resort.image_url)} alt={resort.name} />
        <div className="image-gradient" />
        <div className={`image-label ${fresh ? "" : "image-label--stale"}`}>
          <span className="image-label-dot" />
          {fresh ? "Aktuell · < 1h" : "Daten älter als 1h"}
        </div>
      </div>
      <div className="content">
        <div className="title-row">
          <h2 className="title">{resort.name}</h2>
          <span className="state">{resort.state}</span>
        </div>
        <div className="rows">
          <div className="row">
            <span className="row-label">Wetter</span>
            <span className="row-value">{resort.weather_description ?? "—"}</span>
          </div>
          <div className="row">
            <span className="row-label">Temperatur</span>
            <span className="row-value">
              {resort.temp_c ?? "—"}<span className="units">°C</span>
            </span>
          </div>
          <div className="row">
            <span className="row-label">Wind</span>
            <span className="row-value">
              {resort.wind_kmh ?? "—"}<span className="units">km/h</span>
            </span>
          </div>
          <div className="row">
            <span className="row-label">Schneehöhe</span>
            <span className={`row-value ${resort.snow_depth_cm == null ? "row-value-muted" : ""}`}>
              {resort.snow_depth_cm ?? "—"}<span className="units">cm</span>
            </span>
          </div>
          <div className="row">
            <span className="row-label">Neuschnee (24h)</span>
            <span className={`row-value ${resort.snow_new_cm == null ? "row-value-muted" : ""}`}>
              {resort.snow_new_cm ?? "—"}<span className="units">cm</span>
            </span>
          </div>
          <div className="row">
            <span className="row-label">Bedingungen</span>
            <span className="row-value">
              {rating ? (
                <span className={`pill pill--rating pill--rating-${weatherRatingClassSuffix(rating)}`}>
                  {formatWeatherRating(resort.weather_rating)}
                </span>
              ) : (
                <span className="row-value-muted">—</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ResortList({ resorts }: Props) {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [weatherRatingFilter, setWeatherRatingFilter] = useState<WeatherRating | "">("");
  const [sortBy, setSortBy] = useState<"name" | "temp" | "wind" | "rating">("name");
  const [showFilters, setShowFilters] = useState(false);

  const states = useMemo(
    () =>
      Array.from(new Set(resorts.map((r) => r.state).filter(Boolean))).sort((a, b) =>
        (a || "").localeCompare(b || ""),
      ),
    [resorts],
  );

  const countries = useMemo(
    () =>
      Array.from(new Set(resorts.map((r) => r.country).filter(Boolean))).sort((a, b) =>
        (a || "").localeCompare(b || ""),
      ),
    [resorts],
  );

  const weatherRatings = useMemo(() => {
    const set = new Set<WeatherRating>();
    resorts.forEach((resort) => {
      const rating = normalizeWeatherRating(resort.weather_rating);
      if (rating) set.add(rating);
    });
    return WEATHER_RATING_KEYS.filter((rating) => set.has(rating));
  }, [resorts]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const base = resorts.filter((resort) => {
      const matchesName = term ? resort.name.toLowerCase().includes(term) : true;
      const matchesState = stateFilter ? resort.state === stateFilter : true;
      const matchesCountry = countryFilter ? resort.country === countryFilter : true;
      const normalizedRating = normalizeWeatherRating(resort.weather_rating);
      const matchesRating = weatherRatingFilter ? normalizedRating === weatherRatingFilter : true;
      return matchesName && matchesState && matchesCountry && matchesRating;
    });

    return [...base].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "temp") return (b.temp_c ?? -Infinity) - (a.temp_c ?? -Infinity);
      if (sortBy === "wind") return (b.wind_kmh ?? -Infinity) - (a.wind_kmh ?? -Infinity);
      if (sortBy === "rating") {
        return weatherRatingScore(b.weather_rating) - weatherRatingScore(a.weather_rating);
      }
      return 0;
    });
  }, [resorts, query, stateFilter, countryFilter, weatherRatingFilter, sortBy]);

  const hasFilterOptions = states.length > 0 || countries.length > 0 || weatherRatings.length > 0;

  return (
    <>
      <div className="filters-card">
        <div className="filters-row">
          <div className="filters-combo">
            <div className="search-input">
              <span className="search-icon" aria-hidden>
                🔎
              </span>
              <input
                id="search"
                placeholder="Skigebiet suchen..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="filters-divider" aria-hidden />
            <div className="sort-select">
              <label htmlFor="sort">Sortieren</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="name">Name</option>
                <option value="temp">Temperatur</option>
                <option value="wind">Wind</option>
                <option value="rating">Bedingungen</option>
              </select>
            </div>
          </div>

          {hasFilterOptions ? (
            <button
              type="button"
              className="filters-toggle-button"
              onClick={() => setShowFilters((open) => !open)}
              aria-expanded={showFilters}
              aria-controls="filter-options"
            >
              <span>{showFilters ? "Filter ausblenden" : "Filter anzeigen"}</span>
              <span className={`filters-toggle-icon ${showFilters ? "open" : ""}`} aria-hidden>
                ▾
              </span>
            </button>
          ) : null}
        </div>

        {hasFilterOptions && showFilters ? (
          <div className="filters-chips" id="filter-options">
                        {countries.length > 0 ? (
              <div className="chip-group">
                <div className="chip-group-label">Land</div>
                <div className="chip-row">
                  <button
                    className={`chip ${!countryFilter ? "chip-active" : ""}`}
                    type="button"
                    onClick={() => setCountryFilter("")}
                  >
                    Alle Länder
                  </button>
                  {countries.map((country) => (
                    <button
                      key={country}
                      className={`chip ${countryFilter === country ? "chip-active" : ""}`}
                      type="button"
                      onClick={() => setCountryFilter(country)}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            
            {states.length > 0 ? (
              <div className="chip-group">
                <div className="chip-group-label">Bundesland/Kanton</div>
                <div className="chip-row">
                  <button
                    className={`chip ${!stateFilter ? "chip-active" : ""}`}
                    type="button"
                    onClick={() => setStateFilter("")}
                  >
                    Alle
                  </button>
                  {states.map((state) => (
                    <button
                      key={state}
                      className={`chip ${stateFilter === state ? "chip-active" : ""}`}
                      type="button"
                      onClick={() => setStateFilter(state)}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {weatherRatings.length > 0 ? (
              <div className="chip-group">
                <div className="chip-group-label">Bedingungen</div>
                <div className="chip-row">
                  <button
                    className={`chip ${!weatherRatingFilter ? "chip-active" : ""}`}
                    type="button"
                    onClick={() => setWeatherRatingFilter("")}
                  >
                    Alle
                  </button>
                  {weatherRatings.map((rating) => (
                    <button
                      key={rating}
                      className={`chip ${weatherRatingFilter === rating ? "chip-active" : ""}`}
                      type="button"
                      onClick={() => setWeatherRatingFilter(rating)}
                    >
                      {WEATHER_RATING_LABELS[rating]}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <main id="resorts">
        {filtered.length === 0 ? (
          <div className="empty" style={{ marginTop: 12 }}>
            Keine Skigebiete gefunden.
          </div>
        ) : (
          filtered.map((resort) => <ResortCard key={resort.id} resort={resort} />)
        )}
      </main>
    </>
  );
}
