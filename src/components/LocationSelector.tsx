/**
 * Hierarchical location selector with search and type filtering.
 * 
 * Features:
 * - Text search with Fuse.js fuzzy matching
 * - Location type filters with visual toggle buttons
 * - Hierarchical grouping of locations by type
 * - Multiple location selection with checkboxes
 * - WCAG AAA compliant (labels, focus states, keyboard navigation)
 * 
 * @module components/LocationSelector
 */

"use client";

import { useState, useEffect } from "react";
import { Location, LocationType } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import Fuse from "fuse.js";

interface LocationSelectorProps {
  selectedLocations: string[];
  onChange: (locationIds: string[]) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

// Map location types to human-readable labels and color schemes
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

export default function LocationSelector({
  selectedLocations = [],
  onChange,
  label = "Select Locations",
  required = false,
  disabled = false,
}: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<LocationType>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("label");
        
      if (error) {
        setError(error.message);
      } else if (data) {
        setLocations(data);
        setFilteredLocations(data);
      }
      setIsLoading(false);
    }
    
    fetchLocations();
  }, []);

  // Search and filter locations when query or type filters change
  useEffect(() => {
    if (locations.length === 0) return;
    
    let filtered = [...locations];
    
    // Apply type filter if any selected
    if (selectedTypes.size > 0) {
      filtered = filtered.filter(loc => 
        selectedTypes.has(loc.location_type as LocationType)
      );
    }
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ["label", "description", "search_keywords"],
        threshold: 0.3,
        ignoreLocation: true,
      });
      
      const results = fuse.search(searchQuery);
      filtered = results.map(result => result.item);
    }
    
    setFilteredLocations(filtered);
  }, [searchQuery, selectedTypes, locations]);
  
  // Toggle a location type filter
  const toggleType = (type: LocationType) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };
  
  // Toggle selection of a location
  const handleCheckboxChange = (id: string) => {
    if (disabled) return;
    
    const newSelected = selectedLocations.includes(id)
      ? selectedLocations.filter(i => i !== id)
      : [...selectedLocations, id];
    
    onChange(newSelected);
  };
  
  // Get unique location types present in filtered locations
  const availableTypes = Array.from(
    new Set(filteredLocations.map(loc => loc.location_type as LocationType))
  ).filter(Boolean);
  
  // Group locations by type
  const locationsByType = filteredLocations.reduce((acc, loc) => {
    const type = loc.location_type as LocationType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(loc);
    return acc;
  }, {} as Record<LocationType, Location[]>);

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
            placeholder="Search locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={disabled || isLoading}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 pr-carbon-10 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 disabled:opacity-60"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-carbon-sm text-foreground-secondary">
          Loading locations...
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="rounded border border-status-error/30 bg-status-error/10 p-carbon-3 text-carbon-sm text-status-error">
          Error loading locations: {error}
        </div>
      )}
      
      {/* Type filters */}
      {!isLoading && !error && availableTypes.length > 0 && (
        <div>
          <p className="mb-carbon-2 text-carbon-xs font-medium text-foreground-secondary">
            Filter by type:
          </p>
          <div className="flex flex-wrap gap-carbon-2">
            {availableTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleType(type);
                  // Prevent any focus-related jumps
                  e.currentTarget.blur();
                }}
                disabled={disabled}
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
      {!isLoading && !error && filteredLocations.length === 0 && (
        <div className="rounded bg-background-subtle p-carbon-4 text-center text-carbon-sm text-foreground-secondary">
          {searchQuery || selectedTypes.size > 0 
            ? "No locations match your search or filters." 
            : "No locations available."}
        </div>
      )}
      
      {/* Location checkboxes grouped by type */}
      {!isLoading && !error && filteredLocations.length > 0 && (
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
                {locs.map(loc => (
                  <label
                    key={loc.id}
                    className={`flex cursor-pointer items-start gap-carbon-2 rounded p-carbon-2 text-carbon-sm transition-colors hover:bg-background-subtle ${
                      selectedLocations.includes(loc.id) ? "bg-background-subtle" : ""
                    } ${disabled ? "opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc.id)}
                      onChange={() => handleCheckboxChange(loc.id)}
                      disabled={disabled}
                      className="mt-0.5 h-4 w-4 rounded border-border text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-carbon-2">
                        <span>{loc.label}</span>
                        {/* Campus availability badges */}
                        {loc.campus_availability && loc.campus_availability.length > 0 && (
                          <div className="flex gap-carbon-1">
                            {loc.campus_availability.map(campus => (
                              <span
                                key={campus}
                                className={`inline-block rounded px-carbon-1 py-0.5 text-carbon-2xs font-medium ${
                                  campus === 'uk' 
                                    ? 'bg-carbon-blue-20/20 text-carbon-blue-60' 
                                    : campus === 'malaysia'
                                    ? 'bg-carbon-green-20/20 text-carbon-green-60'
                                    : 'bg-carbon-red-20/20 text-carbon-red-60' // china
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
                        <div className="mt-carbon-1 text-carbon-xs text-foreground-secondary">
                          {new URL(loc.root_url).hostname}
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
