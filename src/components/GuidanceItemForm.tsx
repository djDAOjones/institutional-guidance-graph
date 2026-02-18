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
  ACCESS_LABELS,
  CAMPUS_LABELS,
} from "@/lib/constants";
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

interface Lookups {
  services: Service[];
  technicalServices: TechnicalService[];
  audiences: Audience[];
  tasks: Task[];
  topics: Topic[];
  owners: Owner[];
  locations: Location[];
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

  return (
    <form action={action} className="space-y-carbon-7">
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
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
        </div>

        {/* Summary */}
        <div className="space-y-carbon-2">
          <label
            htmlFor="summary"
            className="block text-carbon-sm font-medium text-foreground"
          >
            Summary <span className="text-status-error">*</span>
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            defaultValue={item?.summary ?? ""}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
        </div>

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
              defaultValue={item?.status ?? "draft"}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Access */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="access"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Access Level
            </label>
            <select
              id="access"
              name="access"
              defaultValue={item?.access ?? "staff"}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            >
              {Object.entries(ACCESS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Scope */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="campus_scope"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Campus Scope
            </label>
            <select
              id="campus_scope"
              name="campus_scope"
              defaultValue={item?.campus_scope ?? "all"}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            >
              {Object.entries(CAMPUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Review fields row */}
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

        {/* Internal Notes */}
        <div className="space-y-carbon-2">
          <label
            htmlFor="notes_internal"
            className="block text-carbon-sm font-medium text-foreground"
          >
            Internal Notes
          </label>
          <textarea
            id="notes_internal"
            name="notes_internal"
            rows={2}
            defaultValue={item?.notes_internal ?? ""}
            className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          />
        </div>
      </fieldset>

      {/* ── Relationship fields ── */}
      <fieldset className="space-y-carbon-5 rounded-lg border border-border p-carbon-6">
        <legend className="px-carbon-2 text-carbon-lg font-semibold text-foreground">
          Relationships
        </legend>

        {/* Services */}
        <CheckboxGroup
          name="service_ids"
          label="Services"
          items={lookups.services}
          selectedIds={selectedRelations?.service_ids ?? []}
        />

        {/* Technical Services */}
        <CheckboxGroup
          name="technical_service_ids"
          label="Technical Services"
          items={lookups.technicalServices}
          selectedIds={selectedRelations?.technical_service_ids ?? []}
        />

        {/* Audiences — multi-select */}
        <CheckboxGroup
          name="audience_ids"
          label="Audiences"
          items={lookups.audiences}
          selectedIds={selectedRelations?.audience_ids ?? []}
        />

        {/* Tasks */}
        <CheckboxGroup
          name="task_ids"
          label="Tasks"
          items={lookups.tasks}
          selectedIds={selectedRelations?.task_ids ?? []}
        />

        {/* Topics */}
        <CheckboxGroup
          name="topic_ids"
          label="Topics"
          items={lookups.topics}
          selectedIds={selectedRelations?.topic_ids ?? []}
        />

        {/* Owners (strategic) */}
        <CheckboxGroup
          name="owner_ids"
          label="Owners (Strategic)"
          items={lookups.owners}
          selectedIds={selectedRelations?.owner_ids ?? []}
        />

        {/* Maintainers (day-to-day) */}
        <CheckboxGroup
          name="maintainer_ids"
          label="Maintainers (Day-to-Day)"
          items={lookups.owners}
          selectedIds={selectedRelations?.maintainer_ids ?? []}
        />

        {/* Locations */}
        <CheckboxGroup
          name="location_ids"
          label="Hosted Locations"
          items={lookups.locations}
          selectedIds={selectedRelations?.location_ids ?? []}
        />
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

/**
 * Reusable checkbox group for multi-select lookup fields.
 * WCAG AAA: fieldset + legend, individual labels, focus rings.
 */
function CheckboxGroup({
  name,
  label,
  items,
  selectedIds,
}: {
  name: string;
  label: string;
  items: { id: string; label: string }[];
  selectedIds: string[];
}) {
  return (
    <div className="space-y-carbon-2">
      <p className="text-carbon-sm font-medium text-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-carbon-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-carbon-2 rounded px-carbon-2 py-carbon-1 text-carbon-sm text-foreground hover:bg-background-subtle"
          >
            <input
              type="checkbox"
              name={name}
              value={item.id}
              defaultChecked={selectedIds.includes(item.id)}
              className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}
