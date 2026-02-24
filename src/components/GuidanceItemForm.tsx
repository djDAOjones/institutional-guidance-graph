/**
 * GuidanceItemForm — reusable form for creating and editing guidance items.
 *
 * Design principles:
 * - Carbon: spacing, type scale, colour tokens
 * - WCAG AAA: labelled inputs, fieldsets, error messages, keyboard navigation
 * - Nielsen #1 (System status): pending state on submit
 * - Nielsen #5 (Error prevention): required fields, sensible defaults
 * - Nielsen #7 (Flexibility): checkbox groups for multi-select relationships
 *
 * @module components/GuidanceItemForm
 */
"use client";

import {
  DOC_TYPE_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import LocationSelector from "@/components/LocationSelector";
import SearchableCheckboxGroup from "@/components/SearchableCheckboxGroup";
import AudienceSelector from "@/components/AudienceSelector";
import TaskTopicSelector from "@/components/TaskTopicSelector";
import { useState } from "react";
import type {
  GuidanceItem,
  Service,
  TechnicalService,
  Audience,
  Task,
  Topic,
  Owner,
  Location,
} from "@/types/database";

interface TaskDefaultTopic {
  task_id: string;
  topic_id: string;
}

interface Lookups {
  services: Service[];
  technicalServices: TechnicalService[];
  audiences: Audience[];
  tasks: Task[];
  topics: Topic[];
  owners: Owner[];
  locations: Location[];
  guidanceItems?: GuidanceItem[]; // For parent collection selection
  taskDefaults?: TaskDefaultTopic[]; // Default topics for each task
}

interface GuidanceItemFormProps {
  /** Server action to call on submit */
  action: (formData: FormData) => Promise<void>;
  /** Existing item data for editing (null for create) */
  item?: GuidanceItem | null;
  /** Pre-selected relationship IDs for editing */
  selectedRelations?: {
    service_ids: string[];
    technical_service_ids: string[];
    audience_ids: string[];
    task_ids: string[];
    topic_ids: string[];
    owner_ids: string[];
    maintainer_ids: string[];
    location_ids: string[];
  };
  /** All lookup data for select/checkbox fields */
  lookups: Lookups;
}

export default function GuidanceItemForm({
  action,
  item,
  selectedRelations,
  lookups,
}: GuidanceItemFormProps) {
  const isEditing = !!item;
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(selectedRelations?.location_ids ?? []);

  // Simple/Advanced mode toggle
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // URL-based location suggestion
  const [suggestedLocationIds, setSuggestedLocationIds] = useState<string[]>([]);

  // Auto-suggest locations based on URL domain
  const handleUrlChange = (url: string) => {
    if (!url || !lookups.locations) return;
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      const suggestions = lookups.locations.filter(location => {
        if (!location.root_url) return false;
        
        try {
          const locationDomain = new URL(location.root_url).hostname.toLowerCase();
          // Match exact domain or subdomain
          return domain.includes(locationDomain) || locationDomain.includes(domain);
        } catch {
          return false;
        }
      }).map(loc => loc.id);
      
      setSuggestedLocationIds(suggestions);
      
      // Auto-select first suggestion if not already selected
      if (suggestions.length > 0 && suggestions[0] && !selectedLocationIds.includes(suggestions[0])) {
        const newSelected = [...selectedLocationIds, suggestions[0]];
        setSelectedLocationIds(newSelected);
      }
    } catch {
      // Invalid URL, clear suggestions
      setSuggestedLocationIds([]);
    }
  };

  return (
    <form action={action} className="space-y-carbon-7">
      {/* ── Editing Mode Toggle ── */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle p-carbon-4">
        <div>
          <h2 className="text-carbon-base font-semibold text-foreground">
            {isAdvancedMode ? "Advanced" : "Simple"} Editing Mode
          </h2>
          <p className="text-carbon-sm text-foreground-secondary">
            {isAdvancedMode 
              ? "Full control with all fields and options" 
              : "Streamlined view with essential fields only"
            }
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 ${
            isAdvancedMode ? 'bg-interactive' : 'bg-carbon-gray-40'
          }`}
          role="switch"
          aria-checked={isAdvancedMode}
          aria-labelledby="advanced-mode-label"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isAdvancedMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ── Core fields ── */}
      <fieldset className="space-y-carbon-5 rounded-lg border border-border p-carbon-6">
        <legend className="px-carbon-2 text-carbon-lg font-semibold text-foreground">
          Item Details
        </legend>

        {/* Title */}
        <div className="space-y-carbon-2">
          <label
            htmlFor="title"
            className="block text-carbon-sm font-medium text-foreground"
          >
            Title <span className="text-status-error">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={item?.title ?? ""}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
        </div>

        {/* URL */}
        <div className="space-y-carbon-2">
          <label
            htmlFor="url"
            className="block text-carbon-sm font-medium text-foreground"
          >
            URL <span className="text-status-error">*</span>
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            defaultValue={item?.url ?? ""}
            placeholder="https://..."
            onChange={(e) => handleUrlChange(e.target.value)}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
          {/* URL-based location suggestions */}
          {suggestedLocationIds.length > 0 && (
            <div className="mt-carbon-2 rounded bg-carbon-green-10 border border-carbon-green-30 p-carbon-3">
              <div className="flex items-center gap-carbon-2">
                <svg className="h-4 w-4 text-carbon-green-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-carbon-sm font-medium text-carbon-green-70">
                  Smart suggestion: Hosted location auto-detected from URL
                </span>
              </div>
              <p className="mt-carbon-1 text-carbon-xs text-carbon-green-60">
                We've automatically selected the most relevant hosted location based on your URL. You can adjust this in the "Hosted Location" section below.
              </p>
            </div>
          )}
        </div>

        {/* Summary - Advanced mode only */}
        {isAdvancedMode && (
          <div className="space-y-carbon-2">
            <label
              htmlFor="summary"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              required
              defaultValue={item?.summary ?? ""}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            />
          </div>
        )}

        {/* Hidden summary for simple mode */}
        {!isAdvancedMode && (
          <input
            type="hidden"
            name="summary"
            value={item?.summary ?? "Auto-generated summary"}
          />
        )}

        {/* Enum selects row */}
        <div className="grid grid-cols-1 gap-carbon-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Doc Type */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="doc_type"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Document Type
            </label>
            <select
              id="doc_type"
              name="doc_type"
              defaultValue={item?.doc_type ?? "how_to"}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            >
              {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="status"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={item?.status ?? "intended"}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Access Level - Simple Checkbox */}
          <div className="space-y-carbon-2">
            <label className="flex items-center gap-carbon-3">
              <input
                type="checkbox"
                name="access"
                value="public"
                defaultChecked={item?.access === "public"}
                className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
              <span className="text-carbon-sm font-medium text-foreground">
                Public Access
              </span>
            </label>
            <p className="text-carbon-xs text-foreground-secondary">
              Tick for public access, untick for private (staff only)
            </p>
          </div>

          {/* Campus Scope - Default to All */}
          <div className="space-y-carbon-2">
            <p className="text-carbon-sm font-medium text-foreground">
              Campus Relevance
            </p>
            <p className="text-carbon-sm text-foreground">
              All Campuses (UK, Malaysia, China)
            </p>
            <input
              type="hidden"
              name="campus_scope"
              value="all"
            />
            <p className="text-carbon-xs text-foreground-secondary">
              Guidance is relevant to all campuses by default. Individual campus selection available in advanced mode.
            </p>
          </div>
        </div>

        {/* Review fields row - Advanced mode only */}
        {isAdvancedMode && (
          <div className="grid grid-cols-1 gap-carbon-5 sm:grid-cols-2">
            <div className="space-y-carbon-2">
              <label
                htmlFor="last_reviewed"
                className="block text-carbon-sm font-medium text-foreground"
              >
                Last Reviewed
              </label>
              <input
                id="last_reviewed"
                name="last_reviewed"
                type="date"
                defaultValue={item?.last_reviewed?.split("T")[0] ?? ""}
                className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
            </div>

            <div className="space-y-carbon-2">
              <label
                htmlFor="review_cycle_months"
                className="block text-carbon-sm font-medium text-foreground"
              >
                Review Cycle (months)
              </label>
              <input
                id="review_cycle_months"
                name="review_cycle_months"
                type="number"
                min={1}
                max={60}
                defaultValue={item?.review_cycle_months ?? 12}
                className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
            </div>
          </div>
        )}

        {/* Hidden review fields for simple mode */}
        {!isAdvancedMode && (
          <>
            <input
              type="hidden"
              name="last_reviewed"
              value={item?.last_reviewed ?? ""}
            />
            <input
              type="hidden"
              name="review_cycle_months"
              value={item?.review_cycle_months ?? 12}
            />
          </>
        )}

        {/* Collection Fields - Available in both modes */}
        <fieldset className="space-y-carbon-4 rounded-lg border border-border p-carbon-5">
          <legend className="px-carbon-2 text-carbon-base font-semibold text-foreground">
            Collection Structure
          </legend>
          
          <div className="grid grid-cols-1 gap-carbon-5 sm:grid-cols-2">
            <div className="space-y-carbon-2">
              <label
                htmlFor="parent_id"
                className="block text-carbon-sm font-medium text-foreground"
              >
                Parent Collection (optional)
              </label>
              <select
                id="parent_id"
                name="parent_id"
                defaultValue={item?.parent_id ?? ""}
                className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              >
                <option value="">-- Not part of a collection --</option>
                {lookups.guidanceItems?.filter(gi => gi.id !== item?.id).map((guidanceItem) => (
                  <option key={guidanceItem.id} value={guidanceItem.id}>
                    {guidanceItem.collection_title || guidanceItem.title}
                  </option>
                ))}
              </select>
              <p className="text-carbon-xs text-foreground-secondary">
                Select a parent item if this is part of a larger collection
              </p>
            </div>

            <div className="space-y-carbon-2">
              <label
                htmlFor="collection_title"
                className="block text-carbon-sm font-medium text-foreground"
              >
                Collection Title (if parent)
              </label>
              <input
                id="collection_title"
                name="collection_title"
                type="text"
                defaultValue={item?.collection_title ?? ""}
                placeholder="e.g., Complete Moodle Guide"
                className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
              <p className="text-carbon-xs text-foreground-secondary">
                Title for this collection (only if this item is a collection parent)
              </p>
            </div>
          </div>

          {/* Collection Default Maintainers Hint */}
          <div className="rounded bg-background-subtle p-carbon-3">
            <p className="text-carbon-sm font-medium text-foreground mb-carbon-2">
              💡 Collection Tip
            </p>
            <p className="text-carbon-xs text-foreground-secondary">
              When you specify a <strong>Collection Title</strong>, this item becomes a parent collection. 
              Child items in this collection will automatically inherit maintainers from the main "Owners" section below, 
              reducing repetitive data entry for large guides.
            </p>
          </div>
        </fieldset>

        {/* Tags */}
        <div className="space-y-carbon-2">
          <label
            htmlFor="tags"
            className="block text-carbon-sm font-medium text-foreground"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={item?.tags?.join(", ") ?? ""}
            placeholder="Comma-separated tags"
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
          <p className="text-carbon-xs text-foreground-secondary">
            Separate tags with commas
          </p>
        </div>

        {/* Internal Notes - Hidden field */}
        <input
          type="hidden"
          name="notes_internal"
          defaultValue={item?.notes_internal ?? ""}
        />
      </fieldset>

      {/* ── Relationship fields ── */}
      <fieldset className="space-y-carbon-5 rounded-lg border border-border p-carbon-6">
        <legend className="px-carbon-2 text-carbon-lg font-semibold text-foreground">
          Relationships
        </legend>

        {/* Services */}
        <SearchableCheckboxGroup
          name="service_ids"
          label="Services"
          items={lookups.services}
          selectedIds={selectedRelations?.service_ids ?? []}
          placeholder="Search services..."
        />

        {/* Audiences — with shortcuts */}
        <AudienceSelector
          name="audience_ids"
          audiences={lookups.audiences}
          selectedIds={selectedRelations?.audience_ids ?? []}
        />

        {/* Tasks & Topics - with smart defaults */}
        <TaskTopicSelector
          tasks={lookups.tasks}
          topics={lookups.topics}
          taskDefaults={lookups.taskDefaults}
          selectedTaskIds={selectedRelations?.task_ids ?? []}
          selectedTopicIds={selectedRelations?.topic_ids ?? []}
          taskName="task_ids"
          topicName="topic_ids"
        />

        {/* Owners (strategic) */}
        <SearchableCheckboxGroup
          name="owner_ids"
          label="Owners (Strategic)"
          items={lookups.owners}
          selectedIds={selectedRelations?.owner_ids ?? []}
          placeholder="Search owners..."
        />

        {/* Maintainers (day-to-day) */}
        <SearchableCheckboxGroup
          name="maintainer_ids"
          label="Maintainers (Day-to-Day)"
          items={lookups.owners}
          selectedIds={selectedRelations?.maintainer_ids ?? []}
          placeholder="Search maintainers..."
        />

        {/* Locations - using hierarchical location selector */}
        <div>
          <LocationSelector
            label="Hosted Locations"
            selectedLocations={selectedLocationIds}
            onChange={(ids) => {
              setSelectedLocationIds(ids);
            }}
          />
          {/* Hidden inputs to submit the selected location IDs */}
          {selectedLocationIds.map((id) => (
            <input
              key={id}
              type="hidden"
              name="location_ids"
              value={id}
            />
          ))}
        </div>
      </fieldset>

      {/* ── Submit ── */}
      <div className="flex items-center gap-carbon-4">
        <button
          type="submit"
          className="rounded bg-interactive px-carbon-6 py-carbon-3 text-carbon-base font-medium text-foreground-inverse transition-colors hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 active:bg-interactive-active"
        >
          {isEditing ? "Update Item" : "Create Item"}
        </button>
        <a
          href="/graph"
          className="rounded border border-border px-carbon-6 py-carbon-3 text-carbon-base font-medium text-foreground transition-colors hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

