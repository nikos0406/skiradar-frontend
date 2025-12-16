'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchResorts, fetchResortFilters } from "@/lib/api";
import { PaginatedSkiResortList, ResortFilters, SkiResort } from "@/types/resort";
import { fallbackImage, isFresh } from "@/lib/format";
import {
  WEATHER_RATING_KEYS,
  WEATHER_RATING_LABELS,
  formatWeatherRating,
  normalizeWeatherRating,
  weatherRatingClassSuffix,
  weatherRatingScore,
} from "@/lib/weatherRating";

type FilterOptions = {
  states: string[];
  countries: string[];
  weatherRatings: (typeof WEATHER_RATING_KEYS)[number][];
};

function sortStrings(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function buildFilterOptionsFromResorts(items: SkiResort[]): FilterOptions {
  const stateSet = new Set<string>();
  const countrySet = new Set<string>();
  const ratingSet = new Set<(typeof WEATHER_RATING_KEYS)[number]>();

  items.forEach((resort) => {
    if (resort.state) stateSet.add(resort.state);
    if (resort.country) countrySet.add(resort.country);
    const rating = normalizeWeatherRating(resort.weather_rating);
    if (rating) ratingSet.add(rating);
  });

  return {
    states: sortStrings(Array.from(stateSet)),
    countries: sortStrings(Array.from(countrySet)),
    weatherRatings: WEATHER_RATING_KEYS.filter((rating) => ratingSet.has(rating)),
  };
}

function buildFilterOptionsFromStatic(filters?: ResortFilters | null): FilterOptions {
  if (!filters) {
    return { states: [], countries: [], weatherRatings: [] };
  }

  const ratingSet = new Set<(typeof WEATHER_RATING_KEYS)[number]>();
  filters.conditions.forEach((condition) => {
    const normalized = normalizeWeatherRating(condition);
    if (normalized) ratingSet.add(normalized);
  });

  return {
    states: sortStrings(filters.states ?? []),
    countries: sortStrings(filters.countries ?? []),
    weatherRatings: WEATHER_RATING_KEYS.filter((rating) => ratingSet.has(rating)),
  };
}

type Props = { initialPage: PaginatedSkiResortList; initialFilters?: ResortFilters | null };

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

export function ResortList({ initialPage, initialFilters }: Props) {
  const defaultLimit = initialPage.limit || 12;
  const [resorts, setResorts] = useState<SkiResort[]>(initialPage.items);
  const [total, setTotal] = useState(initialPage.total);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() =>
    initialFilters ? buildFilterOptionsFromStatic(initialFilters) : buildFilterOptionsFromResorts(initialPage.items),
  );
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [weatherRatingFilter, setWeatherRatingFilter] = useState<(typeof WEATHER_RATING_KEYS)[number] | "">("");
  const [sortBy, setSortBy] = useState<"name" | "temp" | "wind" | "rating">("name");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    if (initialFilters) {
      setFilterOptions(buildFilterOptionsFromStatic(initialFilters));
      return;
    }

    let cancelled = false;

    async function loadStaticFilters() {
      try {
        const filters = await fetchResortFilters();
        if (cancelled) return;
        setFilterOptions(buildFilterOptionsFromStatic(filters));
      } catch (error) {
        console.error(error);
      }
    }

    loadStaticFilters();

    return () => {
      cancelled = true;
    };
  }, [initialFilters]);

  const filters = useMemo(() => {
    const weatherRatingLabel = weatherRatingFilter
      ? WEATHER_RATING_LABELS[weatherRatingFilter]
      : undefined;

    return {
      search: debouncedQuery || undefined,
      state: stateFilter || undefined,
      country: countryFilter || undefined,
      weather_rating: weatherRatingLabel,
    };
  }, [debouncedQuery, stateFilter, countryFilter, weatherRatingFilter]);

  const initialFetch = useRef(true);
  useEffect(() => {
    if (initialFetch.current) {
      initialFetch.current = false;
      return;
    }
    let cancelled = false;

    async function refreshList() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchResorts({ ...filters, limit: defaultLimit, offset: 0 });
        if (cancelled) return;
        setResorts(response.items);
        setTotal(response.total);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message || "Fehler beim Laden der Skigebiete.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshList();

    return () => {
      cancelled = true;
    };
  }, [filters, defaultLimit]);

  const sortedResorts = useMemo(() => {
    const list = [...resorts];
    return list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "temp") return (b.temp_c ?? -Infinity) - (a.temp_c ?? -Infinity);
      if (sortBy === "wind") return (b.wind_kmh ?? -Infinity) - (a.wind_kmh ?? -Infinity);
      if (sortBy === "rating") {
        return weatherRatingScore(b.weather_rating) - weatherRatingScore(a.weather_rating);
      }
      return 0;
    });
  }, [resorts, sortBy]);

  const { states, countries, weatherRatings } = filterOptions;
  const hasFilterOptions = states.length > 0 || countries.length > 0 || weatherRatings.length > 0;
  const hasMore = resorts.length < total;

  async function handleLoadMore() {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const next = await fetchResorts({ ...filters, limit: defaultLimit, offset: resorts.length });
      setResorts((prev) => [...prev, ...next.items]);
      setTotal(next.total);
    } catch (err) {
      setError((err as Error).message || "Konnte weitere Skigebiete nicht laden.");
    } finally {
      setLoadingMore(false);
    }
  }

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

      {error ? (
        <div className="empty" style={{ marginTop: 12 }}>
          {error}
        </div>
      ) : null}

      {loading && resorts.length > 0 ? (
        <div style={{ marginTop: 12, textAlign: "center", color: "#6b7280" }}>Aktualisiere Liste…</div>
      ) : null}

      <main id="resorts">
        {loading && sortedResorts.length === 0 ? (
          <div className="empty" style={{ marginTop: 12 }}>
            Lade Skigebiete...
          </div>
        ) : sortedResorts.length === 0 ? (
          <div className="empty" style={{ marginTop: 12 }}>
            Keine Skigebiete gefunden.
          </div>
        ) : (
          <>
            {sortedResorts.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
            {hasMore ? (
              <div className="resorts-load-more">
                <button
                  className="btn"
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore || loading}
                >
                  {loadingMore ? "Lade weitere..." : "Mehr laden"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
