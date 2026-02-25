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

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { Location, LocationType } from "@/types/database";
import { DEBOUNCE_MS } from "@/lib/constants";
import {
  createVocabularyItem,
  updateVocabularyItem,
  deleteVocabularyItem,
} from "@/lib/actions/vocabulary";
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
  locations: initialLocations,
  selectedLocations = [],
  onChange,
  label = "Select Locations",
  required = false,
  disabled = false,
}: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<LocationType>>(new Set());

  // Inline CRUD state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formType, setFormType] = useState<LocationType>("website_area");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Sync locations when props change
  useEffect(() => {
    setLocations(initialLocations);
  }, [initialLocations]);

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

  /** Handle creating a new location */
  const handleAdd = useCallback(() => {
    if (!formLabel.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const newItem = await createVocabularyItem("locations", {
          label: formLabel.trim(),
          description: formDescription.trim() || undefined,
          root_url: formUrl.trim() || undefined,
          location_type: formType,
          campus_availability: ["uk", "malaysia", "china"],
        });
        const updated = [...locations, newItem as unknown as Location].sort((a, b) =>
          a.label.localeCompare(b.label),
        );
        setLocations(updated);
        setFormLabel("");
        setFormDescription("");
        setFormUrl("");
        setFormType("website_area");
        setShowAddForm(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create location");
      }
    });
  }, [formLabel, formDescription, formUrl, formType, locations]);

  /** Handle updating an existing location */
  const handleEdit = useCallback(() => {
    if (!editingId || !formLabel.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const updatedItem = await updateVocabularyItem("locations", editingId, {
          label: formLabel.trim(),
          description: formDescription.trim() || undefined,
          root_url: formUrl.trim() || undefined,
          location_type: formType,
        });
        const updated = locations
          .map((loc) => (loc.id === editingId ? (updatedItem as unknown as Location) : loc))
          .sort((a, b) => a.label.localeCompare(b.label));
        setLocations(updated);
        setEditingId(null);
        setFormLabel("");
        setFormDescription("");
        setFormUrl("");
        setFormType("website_area");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update location");
      }
    });
  }, [editingId, formLabel, formDescription, formUrl, formType, locations]);

  /** Handle deleting a location */
  const handleDelete = useCallback(
    (id: string, locLabel: string) => {
      if (!window.confirm(`Delete "${locLabel}"? This may affect existing guidance items.`)) return;
      setError(null);
      startTransition(async () => {
        try {
          await deleteVocabularyItem("locations", id);
          setLocations((prev) => prev.filter((loc) => loc.id !== id));
          onChange(selectedLocations.filter((sid) => sid !== id));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to delete location");
        }
      });
    },
    [selectedLocations, onChange],
  );

  /** Start editing a location */
  const startEditing = useCallback((loc: Location) => {
    setEditingId(loc.id);
    setFormLabel(loc.label);
    setFormDescription(loc.description ?? "");
    setFormUrl(loc.root_url ?? "");
    setFormType(loc.location_type);
    setShowAddForm(false);
    setError(null);
  }, []);

  /** Cancel add/edit mode */
  const cancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditingId(null);
    setFormLabel("");
    setFormDescription("");
    setFormUrl("");
    setFormType("website_area");
    setError(null);
  }, []);

  const canManage = !disabled;

  return (
    <div className="space-y-carbon-5">
      <div>
        <label
          htmlFor="location-search"
          className="mb-carbon-2 block text-carbon-sm font-medium text-foreground"
        >
          {label} {required && <span className="text-status-error">*</span>}
        </label>

        <div className="flex items-center gap-carbon-2">
          {/* Add new location button */}
          {canManage && !showAddForm && !editingId && (
            <button
              type="button"
              onClick={() => { setShowAddForm(true); setError(null); }}
              className="flex items-center gap-carbon-1 rounded border border-border px-carbon-2 py-carbon-1 text-carbon-xs font-medium text-foreground-secondary transition-colors hover:bg-background-subtle hover:text-foreground focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
              aria-label="Add new location"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add
            </button>
          )}

          {/* Search input */}
          <div className="relative flex-1">
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
      </div>

      {/* Inline add/edit form for locations */}
      {(showAddForm || editingId) && canManage && (
        <div className="rounded border border-interactive/40 bg-background p-carbon-3 space-y-carbon-2">
          <p className="text-carbon-xs font-medium text-interactive">
            {editingId ? "Edit Location" : "Add New Location"}
          </p>
          <div className="grid grid-cols-1 gap-carbon-2 sm:grid-cols-2">
            <input
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="Label *"
              className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
              aria-label="Location label"
              autoFocus
            />
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as LocationType)}
              className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
              aria-label="Location type"
            >
              {Object.entries(locationTypeMap).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <input
            type="url"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            placeholder="Root URL (optional)"
            className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
            aria-label="Location URL"
          />
          <input
            type="text"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Description (optional)"
            className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
            aria-label="Location description"
          />
          {error && (
            <p className="text-carbon-xs text-status-error" role="alert">{error}</p>
          )}
          <div className="flex items-center gap-carbon-2">
            <button
              type="button"
              onClick={editingId ? handleEdit : handleAdd}
              disabled={isPending || !formLabel.trim()}
              className="rounded bg-interactive px-carbon-3 py-carbon-1 text-carbon-xs font-medium text-foreground-inverse transition-colors hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1 disabled:opacity-50"
            >
              {isPending ? "Saving..." : editingId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded border border-border px-carbon-3 py-carbon-1 text-carbon-xs font-medium text-foreground-secondary transition-colors hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                  <div
                    key={loc.id}
                    className={`group flex items-start gap-carbon-2 rounded p-carbon-2 text-carbon-sm transition-colors hover:bg-background-subtle ${
                      selectedLocations.includes(loc.id) ? "bg-background-subtle" : ""
                    } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <label className="flex flex-1 cursor-pointer items-start gap-carbon-2">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(loc.id)}
                        onChange={() => handleCheckboxChange(loc.id)}
                        disabled={disabled}
                        className="mt-0.5 h-4 w-4 rounded border-border text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-carbon-1">
                          <span className="truncate">{loc.label}</span>
                          {/* Campus availability badges - on separate line */}
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
                          <a
                            href={loc.root_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-carbon-1 block text-carbon-xs text-interactive truncate hover:underline focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1 rounded"
                            title={loc.root_url}
                          >
                            {safeHostname(loc.root_url) ?? loc.root_url}
                          </a>
                        )}
                      </div>
                    </label>

                    {/* Edit / Delete actions — visible on hover */}
                    {canManage && (
                      <div className="flex flex-shrink-0 items-center gap-carbon-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <button
                          type="button"
                          onClick={() => startEditing(loc)}
                          className="rounded p-1 text-foreground-secondary hover:text-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
                          aria-label={`Edit ${loc.label}`}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(loc.id, loc.label)}
                          className="rounded p-1 text-foreground-secondary hover:text-status-error focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-1"
                          aria-label={`Delete ${loc.label}`}
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
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
