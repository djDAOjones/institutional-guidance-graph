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

## ✅ Completed - Database & Organizational Structure

1. Update DTS team names to reflect new organizational structure
   - Digital Education Service (formerly Learning Technology)
   - Digital Education Service - Learning Content Team (formerly Media Production)
   - IT Service Desk team and Smart Bar (formerly Service Desk)
   - Cloud Infrastructure (formerly Infrastructure)
   - Added 6 additional DTS teams (Cyber Security, Application Support, IT Operations, Digital Campus Services, Customer Service, Service Management)
2. Update seed data with new team structure for fresh deployments
3. Apply database migration to update existing records

## ✅ Completed - Database Vocabulary Updates (Phase 2.1)

1. **DB updates** - Comprehensive vocabulary restructuring implemented:
   - ✅ Tasks: Added 6 new tasks (Digital Accessibility, Productivity Tools, Presentation Tools, Lecture Capture, AI, Module Design)
   - ✅ Tasks: Removed 3 outdated tasks (manage users, Report/Analyse, Set Up)
   - ✅ Tasks: Updated 3 existing tasks (Give Feedback → Student Feedback, Mark/Assess → Assessment, Submit Work → Assignment Submission)
   - ✅ Owners: Added 7 new owners (Faculty of Art, Faculty of Engineering, Faculty of Medicine and Health Sciences, Faculty of Science, Faculty of Social Sciences, Libraries, Registrar)
   - ✅ Owners: Removed 4 outdated owners (Academic Services, Digital Education Service - Learning Content Team, Planning and Performance, Quality and Standards)
   - ✅ Owners: Updated 2 existing owners (Centre for Teaching and Learning → Educational Excellence, Communications → External Relations)
   - ✅ Maintainers: Cleaned up inappropriate maintainer relationships (removed 17 owners from maintainer roles)
   - ✅ Maintainers: Added 2 new maintainer-specific entries (Faculty and School Support, Learning Content Team)
   - ✅ Maintainers: Updated existing relationships (Digital Education Service → Faculty and School Support, Digital Education Service - Learning Content Team → Learning Content Team)
2. **UI improvements**: Campus availability badges now display on separate line for better title visibility in LocationSelector

## ✅ Completed - Phase 2.2: Vocabulary Management & Location Cleanup

1. **Inline vocabulary CRUD** — Add/edit/delete for Services, Tasks, Topics, Owners, Maintainers via enhanced `SearchableCheckboxGroup` with `vocabTable` prop
2. **Inline location CRUD** — Add/edit/delete for Hosted Locations (not categories) via enhanced `LocationSelector` with inline form (label, type, URL, description)
3. **Clickable location URLs** — Storage location URLs now render as clickable links opening in new tabs
4. **Location cleanup migration** (`00012_cleanup_locations.sql`) — Deletes all locations except: DES Blog, Brand Resources, Video in Teaching and Learning, Brickfield Help, Microsoft Help, all Faculty locations, Libraries
5. **Preserved location categories** — All location_type enum values (SharePoint, Xerte, Atlassian, Website, External) remain intact
6. **SharePoint UK-only** — All SharePoint sites set to `campus_availability = '{uk}'`
7. **Type integrity cleanup** — Removes any SharePoint/Xerte/external sites not in their correct location_type category
8. **Server actions** — New `src/lib/actions/vocabulary.ts` with `createVocabularyItem`, `updateVocabularyItem`, `deleteVocabularyItem`
9. **Seed data updated** — `supabase/seed.sql` reflects cleaned-up location set with proper hierarchical fields

## 🔄 Remaining

- ⏳ Apply migration `00012_cleanup_locations.sql` to Supabase (requires Supabase Dashboard SQL Editor or CLI)
- Visualization features (deferred)
