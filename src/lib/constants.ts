/**
 * Application-wide constants and enum maps.
 *
 * Centralises all magic strings and configuration values.
 * Import from here rather than hardcoding strings in components.
 *
 * @module lib/constants
 */

/** Human-readable labels for document types (Diátaxis framework) */
export const DOC_TYPE_LABELS = {
  tutorial: "Tutorial",
  how_to: "How-To Guide",
  reference: "Reference",
  explanation: "Explanation",
} as const;

/** Human-readable labels for item status */
export const STATUS_LABELS = {
  draft: "Draft",
  canonical: "Canonical",
  duplicate: "Duplicate",
  obsolete: "Obsolete",
} as const;

/** Human-readable labels for access levels */
export const ACCESS_LABELS = {
  public: "Public",
  staff: "Staff Only",
  restricted: "Restricted",
} as const;

/** Human-readable labels for campus scope */
export const CAMPUS_LABELS = {
  uk: "UK",
  malaysia: "Malaysia",
  china: "China",
  all: "All Campuses",
} as const;

/** Human-readable labels for user roles */
export const ROLE_LABELS = {
  viewer: "Viewer",
  editor: "Editor",
  admin: "Admin",
} as const;

/** Human-readable labels for guidance link types */
export const LINK_TYPE_LABELS = {
  duplicate_of: "Duplicate Of",
  supersedes: "Supersedes",
  related_to: "Related To",
} as const;

/**
 * Fuse.js search configuration.
 *
 * Performance: threshold of 0.35 balances relevance vs typo tolerance.
 * Keys are weighted: title > tags > summary for intuitive ranking.
 */
export const FUSE_CONFIG = {
  keys: [
    { name: "title", weight: 2 },
    { name: "tags", weight: 1.5 },
    { name: "summary", weight: 1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true,
} as const;

/** Debounce delay for search and filter inputs (ms) */
export const DEBOUNCE_MS = 300;

/** Default review cycle in months if not specified per item */
export const DEFAULT_REVIEW_CYCLE_MONTHS = 12;

/** Application metadata */
export const APP_NAME = "Institutional Guidance Graph";
export const APP_DESCRIPTION =
  "A structured register mapping institutional guidance documents for the University of Nottingham.";
