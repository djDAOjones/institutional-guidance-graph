/**
 * SearchableCheckboxGroup — searchable multi-select checkbox component for relationships.
 *
 * Design principles:
 * - Carbon: spacing, type scale, colour tokens, and interaction patterns
 * - WCAG AAA: labelled inputs, fieldsets, keyboard navigation, 7:1 contrast
 * - Nielsen #1 (System status): search results feedback, selection count
 * - Nielsen #5 (Error prevention): clear search affordances
 * - Computational Efficiency: debounced search input (300ms), memoised filtering
 *
 * @module components/SearchableCheckboxGroup
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

interface SearchableItem {
  id: string;
  label: string;
  slug?: string;
  description?: string | null;
}

interface SearchableCheckboxGroupProps {
  name: string;
  label: string;
  items: SearchableItem[];
  selectedIds: string[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  maxHeight?: string;
}

export default function SearchableCheckboxGroup({
  name,
  label,
  items,
  selectedIds,
  disabled = false,
  required = false,
  placeholder = "Search...",
  maxHeight = "max-h-64",
}: SearchableCheckboxGroupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoised filtered items using Fuse.js for fuzzy search
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;

    const fuse = new Fuse(items, {
      keys: ["label", "slug", "description"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    const results = fuse.search(debouncedQuery);
    return results.map(result => result.item);
  }, [items, debouncedQuery]);

  const selectedCount = selectedIds.length;
  const totalItems = items.length;
  const showingCount = filteredItems.length;

  return (
    <fieldset className="space-y-carbon-3" disabled={disabled}>
      <div className="flex items-center justify-between gap-carbon-4">
        <legend className="text-carbon-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
          {selectedCount > 0 && (
            <span className="ml-carbon-2 text-carbon-xs font-normal text-foreground-secondary">
              ({selectedCount} selected)
            </span>
          )}
        </legend>
        
        {/* Inline search bar */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 pr-carbon-8 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1 disabled:opacity-60"
            aria-label={`Search ${label.toLowerCase()}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1 rounded"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search results summary */}
      {searchQuery && (
        <div className="text-carbon-xs text-foreground-secondary">
          {showingCount === 0 
            ? `No ${label.toLowerCase()} match "${searchQuery}"`
            : `Showing ${showingCount} of ${totalItems} ${label.toLowerCase()}`
          }
        </div>
      )}

      {/* Scrollable checkbox list */}
      <div className={`${maxHeight} overflow-y-auto rounded border border-border bg-background-subtle/50 p-carbon-3`}>
        {filteredItems.length === 0 ? (
          <div className="text-center py-carbon-4 text-carbon-sm text-foreground-secondary">
            {searchQuery ? `No ${label.toLowerCase()} match your search` : `No ${label.toLowerCase()} available`}
          </div>
        ) : (
          <div className="space-y-carbon-2">
            {filteredItems.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-start gap-carbon-2 rounded p-carbon-2 text-carbon-sm transition-colors hover:bg-background-subtle focus-within:bg-background-subtle focus-within:ring-2 focus-within:ring-interactive focus-within:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <input
                  type="checkbox"
                  name={name}
                  value={item.id}
                  defaultChecked={selectedIds.includes(item.id)}
                  disabled={disabled}
                  className="mt-0.5 h-4 w-4 rounded border-border text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-1 disabled:cursor-not-allowed"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="mt-carbon-1 text-carbon-xs text-foreground-secondary line-clamp-2">
                      {item.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </fieldset>
  );
}
