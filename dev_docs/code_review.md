# Code Review — 24 Feb 2026

**Reviewer**: Cascade (Claude Opus 4.6 Thinking)  
**Scope**: Full codebase review  
**Principles**: IBM Carbon Design, WCAG 2.1 AAA, Nielsen's 10 Heuristics, Computational Efficiency, Documentation & Modularity

---

## Critical Bugs Fixed

### 1. Server Actions: `parent_id` and `collection_title` Never Persisted

**Severity**: CRITICAL — Collection structure fields in the form were completely non-functional.

**Root Cause**: `parseFormData()` in `src/lib/actions/guidance.ts` did not extract `parent_id` or `collection_title` from `FormData`. Neither `createGuidanceItem()` nor `updateGuidanceItem()` included these fields in their Supabase insert/update payloads.

**Fix**: Added `parent_id` and `collection_title` to `GuidanceFormData` interface, `parseFormData()`, and both mutation functions.

### 2. Access Level Checkbox Parsing Bug

**Severity**: CRITICAL — Would cause null/undefined access level on every form submission.

**Root Cause**: The form uses a checkbox with `value="public"`. When unchecked, HTML checkboxes submit **nothing** — so `formData.get("access")` returns `null`, which was unsafely cast to `AccessLevel`.

**Fix**: Explicit logic: `accessValue === "public" ? "public" : "staff"`.

### 3. GraphPage `DocTypeBadge` References Removed `service_manual` Type

**Severity**: HIGH — Would cause TypeScript error if strict checking caught it, or incorrect rendering.

**Root Cause**: `service_manual` was removed from the `DocType` enum but the badge component still checked for it with special SVG icon rendering.

**Fix**: Replaced with a clean colour-coded badge for all five current types (tutorial, how_to, reference, explanation, navigation).

### 4. `StatusBadge` Missing `intended` Status

**Severity**: HIGH — Items with "intended" status would render with no colour styling.

**Root Cause**: The `colours` Record in `StatusBadge` did not include the `intended` status that was added to the enum.

**Fix**: Added `intended: "bg-carbon-blue-20/20 text-carbon-blue-60"` to the colour map.

---

## Architectural Improvements

### 5. LocationSelector: Eliminated Redundant Client-Side Fetch

**Severity**: MAJOR — Anti-pattern causing unnecessary network requests and data inconsistency.

**Before**: `LocationSelector` created its own Supabase client (`createClient()`) and fetched locations in a `useEffect`. The parent `GuidanceItemForm` already had `lookups.locations` from the server-side `fetchLookups()`.

**After**: `LocationSelector` now accepts a `locations: Location[]` prop. Removed:
- `createClient` import and usage
- `isLoading` / `error` state
- `useEffect` fetch call
- Loading and error UI states

**Impact**: Eliminates one redundant Supabase query per form load, removes client-side Supabase dependency from this component, and ensures data consistency with the server-rendered page.

---

## Computational Efficiency

### 6. LocationSelector: Added Debounced Search

**Before**: Search triggered filtering on every keystroke (no debounce).

**After**: Uses `DEBOUNCE_MS` (300ms) constant from `lib/constants.ts`, matching `SearchableCheckboxGroup`'s pattern.

### 7. LocationSelector: Memoised Fuse Instance

**Before**: `new Fuse()` was created inside a `useEffect` on every filter change.

**After**: Fuse instance created via `useMemo` — only recreated when the `locations` prop changes.

### 8. LocationSelector: Memoised Derived Data

**Before**: `filteredLocations`, `availableTypes`, and `locationsByType` were recomputed on every render.

**After**: All three wrapped in `useMemo` with correct dependency arrays.

### 9. LocationSelector: `availableTypes` Computed from Correct Source

**Before**: Computed from `filteredLocations` — filtering by type would remove the type buttons themselves.

**After**: Computed from `locations` (all locations), so type filter buttons always remain visible.

### 10. Stable Callbacks with `useCallback`

- `LocationSelector.toggleType` — uses functional state update, no dependencies
- `LocationSelector.handleCheckboxChange` — depends on `disabled`, `selectedLocations`, `onChange`
- `GuidanceItemForm.handleUrlChange` — uses functional `setSelectedLocationIds` to avoid stale closure

---

## WCAG 2.1 AAA Compliance

### 11. Fixed `aria-labelledby` Reference

**Before**: Toggle switch had `aria-labelledby="advanced-mode-label"` but no element had `id="advanced-mode-label"`.

**After**: Added `id="advanced-mode-label"` to the heading element.

### 12. Added `aria-live` Region for Search Results

LocationSelector now has `<div aria-live="polite" aria-atomic="true">` that announces search result counts to screen readers.

### 13. Added `aria-pressed` to Toggle Filter Buttons

Type filter buttons now use `aria-pressed={selectedTypes.has(type)}` — correct ARIA pattern for toggle buttons.

### 14. Added `role="group"` with Label for Filter Button Set

Filter buttons wrapped in `role="group" aria-label="Location type filters"`.

### 15. Added `role="searchbox"` to Location Search

Location search input now has `role="searchbox"` and explicit `aria-label`.

### 16. Added `aria-hidden="true"` to Decorative SVGs

Clear-search button SVGs now marked as decorative.

### 17. Safe URL Parsing

Added `safeHostname()` utility function with try/catch — prevents runtime errors from malformed `root_url` values. Previously, `new URL(loc.root_url).hostname` would throw on invalid URLs.

---

## Documentation & Modularity

### 18. Extracted Shared `TaskDefaultTopic` Interface

**Before**: Duplicated in both `GuidanceItemForm.tsx` and `TaskTopicSelector.tsx`.

**After**: Single definition in `src/types/database.ts`, imported by both components.

### 19. Text Overflow Protection

Added `truncate` and `min-w-0` classes to location labels and hostnames to prevent layout overflow.

### 20. Cursor State for Disabled Labels

Added `cursor-not-allowed` to disabled location labels (was only `opacity-60`).

---

## Files Modified

| File | Changes |
|------|---------|
| `src/lib/actions/guidance.ts` | Added `parent_id`, `collection_title` to form data + persistence; fixed access checkbox parsing |
| `src/app/(dashboard)/graph/page.tsx` | Replaced stale `DocTypeBadge`; added `intended` to `StatusBadge` |
| `src/components/LocationSelector.tsx` | Major refactor: props-based, debounced, memoised, WCAG-enhanced |
| `src/components/GuidanceItemForm.tsx` | Pass locations prop; fix stale closure; add `useCallback`; fix `aria-labelledby` |
| `src/components/TaskTopicSelector.tsx` | Import shared `TaskDefaultTopic` type |
| `src/types/database.ts` | Added shared `TaskDefaultTopic` interface |

---

## Remaining Recommendations (Not Implemented)

These are lower-priority items worth considering in future iterations:

1. **Extract repeated CSS class strings** — Input field classes are repeated ~15 times across the form. Consider a shared utility or CSS variable.
2. **Form validation feedback** — No client-side validation messages or error boundaries. Consider adding `aria-describedby` for field-level errors.
3. **Delete confirmation** — Currently uses `window.confirm()` which is not WCAG compliant. Consider a modal dialog component.
4. **Virtualised lists** — If location/owner counts grow significantly (>100), consider `react-window` for checkbox lists.
5. **`fetchLookups` caching** — Consider TanStack Query or Next.js `unstable_cache` for lookup data that rarely changes.
6. **Type-safe Supabase client** — The `Database` type in `database.ts` is defined but not passed to `createClient<Database>()`. This would enable full type inference on queries.
