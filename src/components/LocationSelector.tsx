/**
 * Hierarchical location selector with search and type filtering.
 *
 * Features:
 * - Text search with Fuse.js fuzzy matching (debounced, memoised)
 * - Location type filters with visual toggle buttons
 * - Hierarchical grouping of locations by type
 * - Multiple location selection with checkboxes
 * - WCAG AAA compliant (labels, focus states, keyboard navigation, aria-live)
 * - Accepts locations via props (no client-side fetch)
 *
 * @module components/LocationSelector
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Location, LocationType } from "@/types/database";
import { DEBOUNCE_MS } from "@/lib/constants";
import Fuse from "fuse.js";

interface LocationSelectorProps {
  /** All available locations (passed from server-side fetch) */
  locations: Location[];
  selectedLocations: string[];
  onChange: (locationIds: string[]) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Map location types to human-readable labels and colour schemes */
const locationTypeMap: Record<
  LocationType,
  { label: string; bgClass: string; textClass: string }
> = {
  sharepoint_site: {
    label: "SharePoint",
    bgClass: "bg-carbon-blue-20/20",
    textClass: "text-carbon-blue-60",
  },
  xerte_collection: {
    label: "Xerte",
    bgClass: "bg-carbon-purple-20/20",
    textClass: "text-carbon-purple-60",
  },
  atlassian_space: {
    label: "Atlassian",
    bgClass: "bg-carbon-teal-20/20",
    textClass: "text-carbon-teal-60",
  },
  website_area: {
    label: "Website",
    bgClass: "bg-carbon-green-20/20",
    textClass: "text-carbon-green-60",
  },
  external_website: {
    label: "External",
    bgClass: "bg-carbon-gray-20/20",
    textClass: "text-carbon-gray-70",
  },
};

/** Safely extract hostname from a URL string */
function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export default function LocationSelector({
  locations,
  selectedLocations = [],
  onChange,
  label = "Select Locations",
  required = false,
  disabled = false,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<LocationType>>(new Set());

  // Debounce search query for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoised Fuse instance — only recreated when locations change
  const fuse = useMemo(
    () =>
      new Fuse(locations, {
        keys: ["label", "description", "search_keywords"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [locations],
  );

  // Filtered locations — memoised to avoid recomputation
  const filteredLocations = useMemo(() => {
    let filtered = [...locations];

    // Apply type filter
    if (selectedTypes.size > 0) {
      filtered = filtered.filter((loc) =>
        selectedTypes.has(loc.location_type as LocationType),
      );
    }

    // Apply search filter
    if (debouncedQuery.trim()) {
      // When type-filtering + searching, create a scoped Fuse instance
      const searchSource = selectedTypes.size > 0 ? new Fuse(filtered, {
        keys: ["label", "description", "search_keywords"],
        threshold: 0.3,
        ignoreLocation: true,
      }) : fuse;
      const results = searchSource.search(debouncedQuery);
      filtered = results.map((result) => result.item);
    }

    return filtered;
  }, [locations, debouncedQuery, selectedTypes, fuse]);

  // Available types — computed from ALL locations, not filtered ones
  const availableTypes = useMemo(
    () =>
      Array.from(
        new Set(locations.map((loc) => loc.location_type as LocationType)),
      ).filter(Boolean),
    [locations],
  );

  // Group filtered locations by type
  const locationsByType = useMemo(
    () =>
      filteredLocations.reduce(
        (acc, loc) => {
          const type = loc.location_type as LocationType;
          if (!acc[type]) acc[type] = [];
          acc[type].push(loc);
          return acc;
        },
        {} as Record<LocationType, Location[]>,
      ),
    [filteredLocations],
  );

  // Stable callbacks
  const toggleType = useCallback((type: LocationType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleCheckboxChange = useCallback(
    (id: string) => {
      if (disabled) return;
      const newSelected = selectedLocations.includes(id)
        ? selectedLocations.filter((i) => i !== id)
        : [...selectedLocations, id];
      onChange(newSelected);
    },
    [disabled, selectedLocations, onChange],
  );

  return (
    <div className="space-y-carbon-5">
      <div>
        <label
          htmlFor="location-search"
          className="mb-carbon-2 block text-carbon-sm font-medium text-foreground"
        >
          {label} {required && <span className="text-status-error">*</span>}
        </label>

        {/* Search input */}
        <div className="relative">
          <input
            id="location-search"
            type="text"
            role="searchbox"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            aria-label={`Search ${label.toLowerCase()}`}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 pr-carbon-10 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 disabled:opacity-60"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-foreground-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Search results summary (live region for screen readers) */}
      <div aria-live="polite" aria-atomic="true" className="text-carbon-xs text-foreground-secondary">
        {debouncedQuery
          ? filteredLocations.length === 0
            ? `No locations match "${debouncedQuery}"`
            : `Showing ${filteredLocations.length} of ${locations.length} locations`
          : selectedTypes.size > 0
            ? `Showing ${filteredLocations.length} of ${locations.length} locations`
            : ""}
      </div>

      {/* Type filters */}
      {availableTypes.length > 0 && (
        <div>
          <p className="mb-carbon-2 text-carbon-xs font-medium text-foreground-secondary">
            Filter by type:
          </p>
          <div className="flex flex-wrap gap-carbon-2" role="group" aria-label="Location type filters">
            {availableTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleType(type);
                  e.currentTarget.blur();
                }}
                disabled={disabled}
                aria-pressed={selectedTypes.has(type)}
                className={`rounded px-carbon-3 py-carbon-1 text-carbon-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1 ${
                  selectedTypes.has(type)
                    ? `${locationTypeMap[type]?.bgClass} ${locationTypeMap[type]?.textClass} border-none`
                    : "bg-background-subtle text-foreground-secondary border border-border hover:bg-background-hover"
                } disabled:opacity-50`}
                style={{ scrollMargin: 0 }}
              >
                {locationTypeMap[type]?.label || type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredLocations.length === 0 && (
        <div className="rounded bg-background-subtle p-carbon-4 text-center text-carbon-sm text-foreground-secondary">
          {debouncedQuery || selectedTypes.size > 0
            ? "No locations match your search or filters."
            : "No locations available."}
        </div>
      )}

      {/* Location checkboxes grouped by type */}
      {filteredLocations.length > 0 && (
        <div className="space-y-carbon-6 rounded border border-border p-carbon-4">
          {Object.entries(locationsByType).map(([type, locs]) => (
            <div key={type} className="space-y-carbon-2">
              <h3 className={`font-medium ${locationTypeMap[type as LocationType]?.textClass || ""}`}>
                {locationTypeMap[type as LocationType]?.label || type}
                <span className="ml-carbon-2 text-carbon-xs text-foreground-secondary">
                  ({locs.length})
                </span>
              </h3>

              <div className="grid grid-cols-1 gap-carbon-2 sm:grid-cols-2 lg:grid-cols-3">
                {locs.map((loc) => (
                  <label
                    key={loc.id}
                    className={`flex cursor-pointer items-start gap-carbon-2 rounded p-carbon-2 text-carbon-sm transition-colors hover:bg-background-subtle ${
                      selectedLocations.includes(loc.id) ? "bg-background-subtle" : ""
                    } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc.id)}
                      onChange={() => handleCheckboxChange(loc.id)}
                      disabled={disabled}
                      className="mt-0.5 h-4 w-4 rounded border-border text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-carbon-2">
                        <span className="truncate">{loc.label}</span>
                        {/* Campus availability badges */}
                        {loc.campus_availability && loc.campus_availability.length > 0 && (
                          <div className="flex flex-shrink-0 gap-carbon-1">
                            {loc.campus_availability.map((campus) => (
                              <span
                                key={campus}
                                className={`inline-block rounded px-carbon-1 py-0.5 text-carbon-2xs font-medium ${
                                  campus === "uk"
                                    ? "bg-carbon-blue-20/20 text-carbon-blue-60"
                                    : campus === "malaysia"
                                      ? "bg-carbon-green-20/20 text-carbon-green-60"
                                      : "bg-carbon-red-20/20 text-carbon-red-60"
                                }`}
                                title={`Available in ${campus.toUpperCase()}`}
                              >
                                {campus.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {loc.root_url && (
                        <div className="mt-carbon-1 text-carbon-xs text-foreground-secondary truncate">
                          {safeHostname(loc.root_url) ?? loc.root_url}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected count */}
      {selectedLocations.length > 0 && (
        <div className="text-right text-carbon-xs text-foreground-secondary">
          {selectedLocations.length} location{selectedLocations.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </div>
  );
}
