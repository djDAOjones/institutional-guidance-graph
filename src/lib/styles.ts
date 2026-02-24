/**
 * Shared CSS class strings for consistent Carbon Design System styling.
 *
 * Eliminates duplication across form components. All classes follow
 * Carbon's spacing tokens, type scale, and colour palette.
 *
 * Usage:
 *   import { inputClasses, labelClasses } from "@/lib/styles";
 *   <input className={inputClasses} />
 *
 * @module lib/styles
 */

/** Standard text input / select / date / number field */
export const inputClasses =
  "block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed" as const;

/** Standard <label> above a form field */
export const labelClasses =
  "block text-carbon-sm font-medium text-foreground" as const;

/** Helper / description text beneath a form field */
export const helperClasses =
  "text-carbon-xs text-foreground-secondary" as const;

/** Standard checkbox input */
export const checkboxClasses =
  "h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2 disabled:cursor-not-allowed" as const;

/** Primary action button (submit, create) */
export const primaryButtonClasses =
  "rounded bg-interactive px-carbon-6 py-carbon-3 text-carbon-base font-medium text-foreground-inverse transition-colors hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 active:bg-interactive-active" as const;

/** Secondary / ghost button (cancel, toggle) */
export const secondaryButtonClasses =
  "rounded border border-border px-carbon-6 py-carbon-3 text-carbon-base font-medium text-foreground transition-colors hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2" as const;

/** Danger button (delete) */
export const dangerButtonClasses =
  "rounded bg-status-error px-carbon-4 py-carbon-2 text-carbon-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-2" as const;
