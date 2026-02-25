/**
 * SearchableCheckboxGroup — searchable multi-select checkbox component for relationships.
 *
 * Design principles:
 * - Carbon: spacing, type scale, colour tokens, and interaction patterns
 * - WCAG AAA: labelled inputs, fieldsets, keyboard navigation, 7:1 contrast
 * - Nielsen #1 (System status): search results feedback, selection count
 * - Nielsen #5 (Error prevention): clear search affordances
 * - Computational Efficiency: debounced search input (300ms), memoised filtering
 * - Inline vocabulary CRUD: add, edit, delete items without leaving the form
 *
 * @module components/SearchableCheckboxGroup
 */

"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { DEBOUNCE_MS } from "@/lib/constants";
import {
  createVocabularyItem,
  updateVocabularyItem,
  deleteVocabularyItem,
} from "@/lib/actions/vocabulary";
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
  /** Database table name for CRUD operations (e.g. "services", "tasks") */
  vocabTable?: string;
  /** Callback when items change (add/edit/delete) so parent can refresh */
  onItemsChange?: (items: SearchableItem[]) => void;
}

export default function SearchableCheckboxGroup({
  name,
  label,
  items: initialItems,
  selectedIds,
  disabled = false,
  required = false,
  placeholder = "Search...",
  maxHeight = "max-h-64",
  vocabTable,
  onItemsChange,
}: SearchableCheckboxGroupProps) {
  const [items, setItems] = useState<SearchableItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Inline CRUD state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Sync items when props change
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Debounce search query for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoised Fuse instance — only recreated when items change
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["label", "slug", "description"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [items],
  );

  // Memoised filtered items using the stable Fuse instance
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    const results = fuse.search(debouncedQuery);
    return results.map(result => result.item);
  }, [items, debouncedQuery, fuse]);

  const selectedCount = selectedIds.length;
  const totalItems = items.length;
  const showingCount = filteredItems.length;

  /** Handle creating a new vocabulary item */
  const handleAdd = useCallback(() => {
    if (!vocabTable || !formLabel.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const newItem = await createVocabularyItem(vocabTable, {
          label: formLabel.trim(),
          description: formDescription.trim() || undefined,
        });
        const updated = [...items, newItem as SearchableItem].sort((a, b) =>
          a.label.localeCompare(b.label),
        );
        setItems(updated);
        onItemsChange?.(updated);
        setFormLabel("");
        setFormDescription("");
        setShowAddForm(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create item");
      }
    });
  }, [vocabTable, formLabel, formDescription, items, onItemsChange]);

  /** Handle updating an existing vocabulary item */
  const handleEdit = useCallback(() => {
    if (!vocabTable || !editingId || !formLabel.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const updatedItem = await updateVocabularyItem(vocabTable, editingId, {
          label: formLabel.trim(),
          description: formDescription.trim() || undefined,
        });
        const updated = items
          .map((i) => (i.id === editingId ? (updatedItem as SearchableItem) : i))
          .sort((a, b) => a.label.localeCompare(b.label));
        setItems(updated);
        onItemsChange?.(updated);
        setEditingId(null);
        setFormLabel("");
        setFormDescription("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update item");
      }
    });
  }, [vocabTable, editingId, formLabel, formDescription, items, onItemsChange]);

  /** Handle deleting a vocabulary item */
  const handleDelete = useCallback(
    (id: string, itemLabel: string) => {
      if (!vocabTable) return;
      if (!window.confirm(`Delete "${itemLabel}"? This may affect existing guidance items.`)) return;
      setError(null);
      startTransition(async () => {
        try {
          await deleteVocabularyItem(vocabTable, id);
          const updated = items.filter((i) => i.id !== id);
          setItems(updated);
          onItemsChange?.(updated);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to delete item");
        }
      });
    },
    [vocabTable, items, onItemsChange],
  );

  /** Start editing an item */
  const startEditing = useCallback((item: SearchableItem) => {
    setEditingId(item.id);
    setFormLabel(item.label);
    setFormDescription(item.description ?? "");
    setShowAddForm(false);
    setError(null);
  }, []);

  /** Cancel add/edit mode */
  const cancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditingId(null);
    setFormLabel("");
    setFormDescription("");
    setError(null);
  }, []);

  /** Whether we can perform CRUD (vocabTable is provided) */
  const canManage = !!vocabTable && !disabled;

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

        <div className="flex items-center gap-carbon-2">
          {/* Add new item button */}
          {canManage && !showAddForm && !editingId && (
            <button
              type="button"
              onClick={() => { setShowAddForm(true); setError(null); }}
              className="flex items-center gap-carbon-1 rounded border border-border px-carbon-2 py-carbon-1 text-carbon-xs font-medium text-foreground-secondary transition-colors hover:bg-background-subtle hover:text-foreground focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
              aria-label={`Add new ${label.toLowerCase().replace(/\s*\(.*\)/, "")}`}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add
            </button>
          )}

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
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline add/edit form */}
      {(showAddForm || editingId) && canManage && (
        <div className="rounded border border-interactive/40 bg-background p-carbon-3 space-y-carbon-2">
          <p className="text-carbon-xs font-medium text-interactive">
            {editingId ? "Edit Item" : "Add New Item"}
          </p>
          <input
            type="text"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            placeholder="Label *"
            className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
            aria-label="Item label"
            autoFocus
          />
          <input
            type="text"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Description (optional)"
            className="block w-full rounded border border-border bg-background px-carbon-3 py-carbon-2 text-carbon-sm text-foreground placeholder:text-foreground-secondary focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
            aria-label="Item description"
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
      {searchQuery && (
        <div aria-live="polite" aria-atomic="true" className="text-carbon-xs text-foreground-secondary">
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
              <div
                key={item.id}
                className="group flex items-start gap-carbon-2 rounded p-carbon-2 text-carbon-sm transition-colors hover:bg-background-subtle"
              >
                <label className="flex flex-1 cursor-pointer items-start gap-carbon-2">
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

                {/* Edit / Delete actions — visible on hover */}
                {canManage && (
                  <div className="flex flex-shrink-0 items-center gap-carbon-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="rounded p-1 text-foreground-secondary hover:text-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-1"
                      aria-label={`Edit ${item.label}`}
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.label)}
                      className="rounded p-1 text-foreground-secondary hover:text-status-error focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-1"
                      aria-label={`Delete ${item.label}`}
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
        )}
      </div>
    </fieldset>
  );
}
