# Todo List

## ✅ Completed - Core Features

1. Add technical services
2. Check multiple audiences can be selected
3. Add hierarchical location structure
4. Add granularity field to guidance items (replaced with service_manual doc type → reverted to pure Diátaxis)
5. Create searchable location selector with type filtering
6. Ensure technical services can be selected as audience types
7. Fix location filter buttons causing page reload and scroll jump
8. Remove technical services relationship category, add services: Moodle, Turnitin Originality, Turnitin Feedback Studio
9. Add search for all relationship categories with inline search bars
10. Merge faculty/subdomain location types into website area category
11. Visual distinction for service manuals in data table (reverted with Diátaxis)
12. Content Title label (more generic than "Title")
13. Add "intended" status as first/default option
14. Campus scope defaults to all campuses (relevance not availability)
15. Remove service_manual, back to pure Diátaxis framework
16. Simple access level checkbox (public/private)
17. Hide internal notes field
18. Audience shortcuts: "all staff" and "all students" with expandable details
19. Collection parent/child relationship fields (HAS_PART/IS_PART_OF)
20. Task default topics database structure

## ✅ Completed - UX Enhancements & Recent Work

1. Default topics for tasks with expandable topic editor
2. Default maintainers for collections
3. Simple/advanced editing modes with toggle
4. URL-based location auto-population (investigate + implement)
5. Campus scope description about relevance not availability - advanced option for individual campuses
6. Give hosted location the attribute of campus availability
7. In simple view change "add additional topics" to "show topics"
8. Hosted location button filter page jump fixed - buttons remain in position
9. Parent/child relationship fields (HAS_PART/IS_PART_OF) in both simple and advanced editing modes
10. Add "Navigation" to the document types

## ✅ Completed - Code Review Recommendations

1. Extract repeated CSS class strings into shared utility (`src/lib/styles.ts`)
2. Replace `window.confirm()` with WCAG-compliant modal dialog (`ConfirmDialog` + `DeleteItemButton`)
3. Memoize Fuse.js instance in `SearchableCheckboxGroup` (separate from filtered results)
4. Use shared `DEBOUNCE_MS` constant across all debounced inputs
5. Add `aria-live` region for search result announcements
6. Add `aria-hidden="true"` on decorative SVG icons
7. Cache `fetchLookups` with `unstable_cache` (5-min TTL, "lookups" tag)
8. Prepare `Database` type with `TableDef` helper for future Supabase auto-gen type safety
9. Document path to full type-safe Supabase client via `npx supabase gen types`

## 🔄 Remaining

1. Give users the ability to add new relationship categories
2. Vocabulary management UI for tasks, topics, and default topics (admin interface)