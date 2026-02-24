# Institutional Guidance Graph — Development Plan

> **Reference**: This plan implements the architecture defined in `Spec.md`. All design and development must follow the guiding principles listed below at every step.

---

## Guiding Principles (apply to every task)

Every prompt, commit, and code review must honour these five principles:

1. **IBM Carbon Design System** — Use Carbon's grid, type scale, spacing tokens, colour palette, and interaction patterns. All UI components must align with Carbon's design language.
2. **WCAG 2.1 AAA Compliance** — 7:1 contrast for normal text, 4.5:1 for large text. Keyboard-navigable. Screen-reader tested. No time limits. Multiple navigation paths.
3. **Nielsen's 10 Usability Heuristics** — System status visibility, real-world language, user control, consistency, error prevention, recognition over recall, flexibility, minimalist design, error recovery, contextual help.
4. **Computational Efficiency** — Debounced inputs, memoised calculations, virtualised lists, lazy-loaded routes, Web Workers for heavy graph layouts. Performance budgets: initial load < 2 s, interactions < 100 ms.
5. **Documentation & Modularity** — Every file commented. TypeScript interfaces for all data. Feature-based directory structure. Single responsibility. Pure functions. Adapter pattern for external services.

---

## Project Information

| Item | Value |
| --- | --- |
| GitHub repo | `https://github.com/djDAOjones/institutional-guidance-graph.git` |
| Vercel project | `https://institutional-guidance-graph.vercel.app/` |
| Supabase project | `https://figtiyversvulkqcvkdd.supabase.co` |
| Supabase region | Europe |
| Auth method | Email + password (Supabase Auth) |
| Package manager | npm (default) |

---

## Directory Structure

```text
institutional-guidance-graph/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions: lint, type-check, test
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── graph/
│   │   │   │   └── page.tsx        # Main graph explorer
│   │   │   ├── items/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Item detail / edit
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Create new item
│   │   │   │   └── page.tsx        # Items list
│   │   │   ├── admin/
│   │   │   │   ├── vocabularies/
│   │   │   │   │   └── page.tsx    # Manage lookups
│   │   │   │   └── users/
│   │   │   │       └── page.tsx    # Manage users/roles
│   │   │   ├── reports/
│   │   │   │   └── page.tsx        # Reporting dashboard
│   │   │   └── layout.tsx          # Authenticated layout shell
│   │   ├── api/
│   │   │   ├── graph/
│   │   │   │   └── route.ts        # GET: filtered graph data
│   │   │   ├── reports/
│   │   │   │   ├── overdue/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── duplicates/
│   │   │   │   │   └── route.ts
│   │   │   │   └── gaps/
│   │   │   │       └── route.ts
│   │   │   └── admin/
│   │   │       └── vocabularies/
│   │   │           └── route.ts
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Redirect to /graph or /login
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (Carbon-themed)
│   │   ├── graph/
│   │   │   ├── GraphCanvas.tsx     # Cytoscape.js wrapper
│   │   │   ├── GraphControls.tsx   # Zoom, reset, layout controls
│   │   │   ├── GraphFilters.tsx    # Left panel filter UI
│   │   │   └── GraphDetails.tsx    # Right panel detail view
│   │   ├── forms/
│   │   │   ├── GuidanceItemForm.tsx
│   │   │   ├── RelationshipEditor.tsx
│   │   │   └── VocabularyForm.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Top bar + side panels + canvas
│   │   │   ├── TopBar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── shared/
│   │       ├── SearchInput.tsx     # Fuse.js fuzzy search bar
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── AccessibleTable.tsx # Table alternative to graph
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGuidanceItems.ts
│   │   ├── useGraph.ts
│   │   ├── useFuzzySearch.ts
│   │   ├── useVocabularies.ts
│   │   └── useFilters.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server-side Supabase client
│   │   │   ├── middleware.ts       # Auth middleware
│   │   │   └── types.ts            # Generated DB types
│   │   ├── graph/
│   │   │   ├── transform.ts        # DB rows → Cytoscape elements
│   │   │   ├── layout.ts           # Layout algorithms
│   │   │   └── filters.ts          # Filter logic
│   │   ├── search/
│   │   │   └── fuse-config.ts      # Fuse.js index setup
│   │   ├── utils/
│   │   │   ├── url-normalize.ts    # URL normalization
│   │   │   ├── review-due.ts       # Review date calculations
│   │   │   └── format.ts           # Display helpers
│   │   └── constants.ts            # Enums, defaults
│   ├── types/
│   │   ├── database.ts             # Supabase-generated types
│   │   ├── graph.ts                # Cytoscape element types
│   │   └── filters.ts              # Filter state types
│   └── styles/
│       └── carbon-overrides.css    # Carbon design token overrides
├── supabase/
│   ├── migrations/
│   │   ├── 00001_enums.sql
│   │   ├── 00002_lookup_tables.sql
│   │   ├── 00003_guidance_items.sql
│   │   ├── 00004_relationship_tables.sql
│   │   ├── 00005_auth_roles.sql
│   │   ├── 00006_rls_policies.sql
│   │   ├── 00007_triggers.sql
│   │   └── 00008_indexes.sql
│   └── seed.sql                    # Initial vocabulary data
├── tests/
│   ├── unit/
│   │   ├── url-normalize.test.ts
│   │   ├── review-due.test.ts
│   │   └── graph-transform.test.ts
│   ├── component/
│   │   ├── GuidanceItemForm.test.tsx
│   │   ├── GraphFilters.test.tsx
│   │   └── SearchInput.test.tsx
│   ├── integration/
│   │   ├── api-graph.test.ts
│   │   └── api-reports.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── create-item.spec.ts
│       ├── graph-explore.spec.ts
│       └── filter-search.spec.ts
├── .env.local                      # Local env vars (gitignored)
├── .env.example                    # Template for env vars
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Completed Phases

### ✅ Phase 0 — Project Scaffolding and Database Schema *(COMPLETED)*

**Goal**: Working repo, deployed skeleton, seeded database.

**Status**: All database migrations applied, Supabase configured, Next.js app deployed to Vercel.

### ✅ Phase 1 — MVP Features *(COMPLETED)*

**Goal**: Auth, CRUD, hierarchical data management — all working end-to-end.

**Core Features Completed**:
- ✅ Authentication flow with Supabase Auth
- ✅ Dashboard layout with navigation 
- ✅ Full CRUD for guidance items with comprehensive form
- ✅ **Hierarchical location structure** with parent/child relationships
- ✅ **Searchable relationship categories** with inline fuzzy search (Fuse.js)
- ✅ Multi-select audiences and all relationship types
- ✅ Technical services staff as audience type
- ✅ Location type filtering with proper UX (no page reloads)
- ✅ Carbon Design System styling throughout
- ✅ WCAG AAA compliance (7:1 contrast, keyboard navigation)
- ✅ Debounced inputs and memoised calculations for performance

### ✅ Phase 1.5 — UX Enhancements *(COMPLETED)*

**Goal**: Streamlined user experience based on real usage patterns.

**UX Improvements Completed**:

- ✅ **Pure Diátaxis framework** - removed service_manual, back to tutorial/how-to/reference/explanation
- ✅ **"Intended" status** as first option and default for new items
- ✅ **Content Title** label (more generic than "Title")
- ✅ **Simplified campus scope** - defaults to all campuses (relevance not availability)
- ✅ **Simple access checkbox** - public/private only (no more 3-way dropdown)
- ✅ **Hidden internal notes** - preserved as hidden field to reduce form clutter
- ✅ **Audience shortcuts** - "All Staff" and "All Students" with expandable detailed selection
- ✅ **Collection relationships** - parent/child structure for monolithic guides (HAS_PART/IS_PART_OF)
- ✅ **Smart task/topic selection** - tasks auto-populate default topics, expandable for additional ones
- ✅ **Task default topics database** - reduces repetitive data entry
- ✅ **Collection default maintainers** - inherit maintainers from parent collections
- ✅ **Simple/Advanced editing modes** - toggle between streamlined and full control

### ✅ Phase 1.6 — UX Polish & Refinements *(COMPLETED)*

**Goal**: Address user feedback and polish existing features for optimal experience.

**Refinements Completed**:
- ✅ **Collection fields in both modes** - parent/child relationships available in simple & advanced
- ✅ **Improved topic button text** - changed "add additional topics" to "show topics"
- ✅ **Fixed location filter jumps** - buttons now stay in position when filtering
- ✅ **Campus availability for locations** - visual badges showing UK/Malaysia/China availability
- ✅ **Database schema evolution** - added location campus_availability with constraints
- ✅ **URL-based location auto-population** - smart domain matching with visual feedback
- ✅ **Navigation document type** - added fifth option beyond pure Diátaxis framework

### ✅ Phase 1.7 — Final Polish *(COMPLETED)*

**Goal**: Complete remaining refinements and prepare for code review.

**Final Enhancements**:
- ✅ **Smart URL auto-population** - automatically suggests hosted locations based on domain matching
- ✅ **Enhanced document types** - added "Navigation" for wayfinding content beyond Diátaxis
- ✅ **Documentation updates** - reorganized to_add.md to reflect true completion status

**Enhanced Components Built**:
- `GuidanceItemForm.tsx` — Streamlined form with smart defaults, simple/advanced toggle, and URL auto-population
- `LocationSelector.tsx` — Enhanced with campus availability badges and no-jump filtering  
- `SearchableCheckboxGroup.tsx` — Reusable fuzzy search for relationships
- `AudienceSelector.tsx` — All staff/all students shortcuts with expandable details
- `TaskTopicSelector.tsx` — Smart task selection with improved button text
- Data table with pure Diátaxis + Navigation document type badges

---

### ✅ Phase 2.0 — Code Review Implementation *(COMPLETED)*

**Goal**: Implement code review recommendations for accessibility, performance, and maintainability.

**Changes Implemented**:

- ✅ **Shared CSS utility** — Extracted repeated class strings into `src/lib/styles.ts` (inputClasses, labelClasses, helperClasses, checkboxClasses, primaryButtonClasses, secondaryButtonClasses, dangerButtonClasses)
- ✅ **WCAG-compliant delete dialog** — Replaced `window.confirm()` with `ConfirmDialog` + `DeleteItemButton` using native `<dialog>`, focus trap, Escape key, aria-modal
- ✅ **Memoized Fuse instance** — `SearchableCheckboxGroup` now creates the Fuse index once per items change, separate from filtered results
- ✅ **Shared DEBOUNCE_MS** — All debounced inputs use the constant from `@/lib/constants`
- ✅ **aria-live search results** — Screen readers announce search result counts in `SearchableCheckboxGroup`
- ✅ **aria-hidden SVGs** — Decorative icons marked with `aria-hidden="true"`
- ✅ **fetchLookups caching** — Wrapped in `unstable_cache` with 5-minute TTL and "lookups" tag
- ✅ **Database type preparation** — `TableDef` helper with Row/Insert/Update/Relationships; documented path to auto-generated types via `npx supabase gen types`

**New Components**:

- `src/lib/styles.ts` — Shared CSS class constants
- `src/components/ConfirmDialog.tsx` — WCAG-compliant modal dialog
- `src/components/DeleteItemButton.tsx` — Delete button with confirmation

---

### ✅ Phase 2.1 — Database Vocabulary Updates *(COMPLETED)*

**Goal**: Update database vocabularies to reflect current organizational structure and user requirements.

**Changes Implemented**:

- ✅ **Tasks vocabulary updates** — Added 6 new tasks (Digital Accessibility, Productivity Tools, Presentation Tools, Lecture Capture, AI, Module Design), removed 3 outdated tasks (manage users, report/analyse, set up), renamed 3 existing tasks (Give Feedback → Student Feedback, Mark/Assess → Assessment, Submit Work → Assignment Submission)
- ✅ **Owners vocabulary updates** — Added 7 new owners (5 faculties + Libraries + Registrar), removed 4 outdated owners (Academic Services, Digital Education Service - Learning Content Team, Planning and Performance, Quality and Standards), renamed 2 existing owners (Centre for Teaching and Learning → Educational Excellence, Communications → External Relations)
- ✅ **Maintainers structure cleanup** — Removed maintainer relationships for 17 inappropriate owners, added 2 new maintainer-specific entries (Faculty and School Support, Learning Content Team), updated existing relationships
- ✅ **UI improvements** — Fixed campus availability display in LocationSelector to show badges on separate line for better title visibility
- ✅ **Seed data updates** — Updated seed data to reflect all new vocabulary structures for fresh deployments

**Database Migrations Applied**:
- Migration 00009: update_tasks_vocabulary
- Migration 00010: update_owners_vocabulary  
- Migration 00011: update_maintainers_structure

---

## Current Phase

### 🎯 Phase 3.0 — Graph Visualisation *(NEXT)*

**Goal**: Build the interactive graph explorer with Cytoscape.js.

**Remaining Low-Priority Items**:

- [ ] **Dynamic relationship management** — Allow users to add new relationship categories
- [ ] **Vocabulary management UI** — Admin interface for tasks, topics, default topics
- [ ] **Auto-generate Supabase types** — `npx supabase gen types typescript` for full type-safe queries

---

## Phase 0 — Project Scaffolding and Database Schema *(REFERENCE)*

**Goal**: Working repo, deployed skeleton, seeded database.

### Task 0.1: Initialise Next.js Project

- **Action**: Clone repo, run `npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint`
- **Dependencies**: None
- **Acceptance**: `npm run dev` serves blank page at `localhost:3000`
- **Guiding principles**: Set up ESLint + Prettier with strict rules from day one (documentation). Configure `tsconfig.json` with `strict: true` (modularity).

### Task 0.2: Install Core Dependencies

- **Action**: Install all project dependencies

```bash
# UI and styling
npm install @carbon/react @carbon/icons-react
npm install tailwindcss @tailwindcss/forms

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Data fetching and state
npm install @tanstack/react-query

# Graph
npm install cytoscape
npm install -D @types/cytoscape

# Search
npm install fuse.js

# Dev / testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D playwright @playwright/test
npm install -D msw
```

- **Acceptance**: `npm run build` succeeds with no errors

### Task 0.3: Configure shadcn/ui with Carbon Theme

- **Action**: Initialise shadcn/ui, then override design tokens to match IBM Carbon palette
- **Details**:
  - Use Carbon's Gray 100 (`#161616`) for primary backgrounds
  - Use Carbon's Blue 60 (`#0f62fe`) for interactive elements
  - Apply Carbon type scale via Tailwind config
  - Set contrast ratios to meet WCAG AAA (7:1 minimum)
- **Acceptance**: Button, Input, Select components render with Carbon styling

### Task 0.4: Create Supabase Database Schema

- **Action**: Write and apply SQL migrations in order

**Migration 00001_enums.sql:**

```sql
-- Document types (Diátaxis framework)
CREATE TYPE doc_type AS ENUM ('tutorial', 'how_to', 'reference', 'explanation');

-- Guidance item status
CREATE TYPE item_status AS ENUM ('draft', 'canonical', 'duplicate', 'obsolete');

-- Access level
CREATE TYPE access_level AS ENUM ('public', 'staff', 'restricted');

-- Campus scope
CREATE TYPE campus_scope AS ENUM ('uk', 'malaysia', 'china', 'all');

-- User roles
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin');

-- Guidance link types (self-referencing edges)
CREATE TYPE link_type AS ENUM ('duplicate_of', 'supersedes', 'related_to');
```

**Migration 00002_lookup_tables.sql:**

```sql
-- Service areas (top-level domains)
CREATE TABLE service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Services (linked to service_areas)
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  service_area_id uuid REFERENCES service_areas(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Audiences (hierarchical via parent_id)
CREATE TABLE audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  parent_id uuid REFERENCES audiences(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Topics
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Owners
CREATE TABLE owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Locations
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
```

**Migration 00003_guidance_items.sql:**

```sql
CREATE TABLE guidance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  summary text NOT NULL,
  doc_type doc_type NOT NULL,
  status item_status NOT NULL DEFAULT 'draft',
  access access_level NOT NULL DEFAULT 'staff',
  campus_scope campus_scope NOT NULL DEFAULT 'all',
  last_reviewed date,
  review_cycle_months int,
  notes_internal text,
  is_archived boolean NOT NULL DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON guidance_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Migration 00004_relationship_tables.sql:**

```sql
-- GuidanceItem → Service (ABOUT_SERVICE)
CREATE TABLE guidance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, service_id)
);

-- GuidanceItem → Task (GUIDANCE_FOR)
CREATE TABLE guidance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, task_id)
);

-- GuidanceItem → Topic (HAS_TOPIC)
CREATE TABLE guidance_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, topic_id)
);

-- GuidanceItem → Audience (FOR_AUDIENCE)
CREATE TABLE guidance_audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  audience_id uuid NOT NULL REFERENCES audiences(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, audience_id)
);

-- GuidanceItem → Owner (OWNED_BY — strategic owner)
CREATE TABLE guidance_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, owner_id)
);

-- GuidanceItem → Owner (MAINTAINED_BY — day-to-day updater)
CREATE TABLE guidance_maintainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, owner_id)
);

-- GuidanceItem → Location (HOSTED_AT)
CREATE TABLE guidance_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, location_id)
);

-- GuidanceItem ↔ GuidanceItem (self-referencing links)
CREATE TABLE guidance_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  link_type link_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_id, target_id, link_type),
  CHECK (source_id != target_id)
);
```

**Migration 00005_auth_roles.sql:**

```sql
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz DEFAULT now()
);
```

**Migration 00006_rls_policies.sql:**

```sql
-- Enable RLS on all tables
ALTER TABLE guidance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_maintainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM user_roles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Guidance items: all authenticated users can read, editors+ can write
CREATE POLICY "Anyone can read guidance items"
  ON guidance_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors can insert guidance items"
  ON guidance_items FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));

CREATE POLICY "Editors can update guidance items"
  ON guidance_items FOR UPDATE
  TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- Lookup tables: all authenticated read, admin-only write
-- (Repeat pattern for each lookup table)
CREATE POLICY "Anyone can read service_areas"
  ON service_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage service_areas"
  ON service_areas FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Relationship tables: same as guidance_items (editors+ can write)
-- (Repeat pattern for each join table)
CREATE POLICY "Anyone can read guidance_services"
  ON guidance_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can manage guidance_services"
  ON guidance_services FOR ALL TO authenticated
  USING (get_user_role() IN ('editor', 'admin'))
  WITH CHECK (get_user_role() IN ('editor', 'admin'));

-- User roles: only admins can read/write
CREATE POLICY "Admins can manage user roles"
  ON user_roles FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
```

**Migration 00008_indexes.sql:**

```sql
-- Performance indexes for common query patterns
CREATE INDEX idx_guidance_items_status ON guidance_items(status);
CREATE INDEX idx_guidance_items_campus ON guidance_items(campus_scope);
CREATE INDEX idx_guidance_items_archived ON guidance_items(is_archived);
CREATE INDEX idx_guidance_items_doc_type ON guidance_items(doc_type);
CREATE INDEX idx_guidance_items_last_reviewed ON guidance_items(last_reviewed);
CREATE INDEX idx_services_area ON services(service_area_id);
CREATE INDEX idx_audiences_parent ON audiences(parent_id);
CREATE INDEX idx_guidance_services_item ON guidance_services(guidance_item_id);
CREATE INDEX idx_guidance_services_service ON guidance_services(service_id);
CREATE INDEX idx_guidance_tasks_item ON guidance_tasks(guidance_item_id);
CREATE INDEX idx_guidance_topics_item ON guidance_topics(guidance_item_id);
CREATE INDEX idx_guidance_audiences_item ON guidance_audiences(guidance_item_id);
CREATE INDEX idx_guidance_owners_item ON guidance_owners(guidance_item_id);
CREATE INDEX idx_guidance_maintainers_item ON guidance_maintainers(guidance_item_id);
CREATE INDEX idx_guidance_locations_item ON guidance_locations(guidance_item_id);
CREATE INDEX idx_guidance_links_source ON guidance_links(source_id);
CREATE INDEX idx_guidance_links_target ON guidance_links(target_id);
```

### Task 0.5: Seed Vocabulary Data

- **Action**: Create `supabase/seed.sql` with all initial vocabulary values
- **Data to seed**:
  - 9 service_areas (assessment, teaching, media_production, etc.)
  - 12 services mapped to their service_areas
  - 10 audiences with parent hierarchy (6 top-level, 6 sub-categories)
  - 16 owners
  - 10 locations
  - Initial topics (TBD — start with 5–10 common ones)
  - Initial tasks (TBD — start with 5–10 common ones)
- **Acceptance**: All lookup tables populated, services linked to correct service_areas, audience hierarchy correct

### Task 0.6: Configure Supabase Client

- **Action**: Create `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`
- **Details**:
  - Browser client uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Server client uses `SUPABASE_SERVICE_ROLE_KEY` for elevated access
  - Generate TypeScript types from Supabase schema
- **Acceptance**: Can query data from both client and server contexts

### Task 0.7: Set Up CI/CD

- **Action**: Create `.github/workflows/ci.yml`
- **Steps**:
  - On push/PR: `npm run lint`, `npm run type-check`, `npm run test`
  - Vercel auto-deploys on push to `main` (already configured)
- **Acceptance**: GitHub Actions pipeline passes on push

### Task 0.8: Deploy Skeleton

- **Action**: Push to `main`, confirm Vercel deployment
- **Acceptance**: `https://institutional-guidance-graph.vercel.app/` shows the skeleton app

---

## Phase 1 — MVP Features

**Goal**: Auth, CRUD, graph visualisation, fuzzy search — all working end-to-end.

### Task 1.1: Authentication Flow

- **Action**: Build login page and auth middleware
- **Components**:
  - `src/app/(auth)/login/page.tsx` — email + password form
  - `src/lib/supabase/middleware.ts` — redirect unauthenticated users
  - `src/hooks/useAuth.ts` — session state, role, sign-out
- **UX (Nielsen)**:
  - **#1 System status**: Show loading spinner during auth
  - **#5 Error prevention**: Validate email format before submit
  - **#9 Error recovery**: Clear message on wrong credentials with retry
- **Accessibility**: All form inputs labelled, keyboard-navigable, 7:1 contrast
- **Acceptance**: User can log in, see their role, log out. Unauthenticated users redirected to `/login`.

### Task 1.2: App Shell Layout

- **Action**: Build the three-panel layout
- **Components**:
  - `AppShell.tsx` — responsive layout: left panel (filters), centre (graph), right panel (details)
  - `TopBar.tsx` — fuzzy search input, user menu, current view indicator
  - `Sidebar.tsx` — collapsible filter panels
- **Carbon**: Use Carbon's Grid, Column, and Layer components for layout
- **Accessibility**: Skip-to-content link, landmark regions (`<nav>`, `<main>`, `<aside>`), focus management on panel open/close
- **Performance**: Lazy-load right panel content; panels are resizable but default widths prevent reflow
- **Acceptance**: Three-panel layout renders on 1440×810+. Panels collapse gracefully at 1024px.

### Task 1.3: Vocabulary Management (Admin)

- **Action**: Build admin UI for managing all lookup tables
- **Components**:
  - `src/app/(dashboard)/admin/vocabularies/page.tsx`
  - `VocabularyForm.tsx` — reusable create/edit form for any lookup table
- **Tables managed**: service_areas, services, tasks, topics, audiences, owners, locations
- **Features**:
  - Tabbed interface — one tab per vocabulary type
  - Create, edit, soft-delete entries
  - Services: select parent service_area
  - Audiences: select parent audience (for hierarchy)
- **UX (Nielsen)**:
  - **#3 User control**: Undo/confirm before delete
  - **#4 Consistency**: Same form pattern for all vocabulary types
  - **#6 Recognition**: Dropdown selectors for parent relationships
- **Acceptance**: Admin can CRUD all vocabulary types. Non-admins cannot access.

### Task 1.4: Guidance Item CRUD

- **Action**: Build create, edit, and archive forms for guidance items
- **Components**:
  - `src/app/(dashboard)/items/new/page.tsx` — create form
  - `src/app/(dashboard)/items/[id]/page.tsx` — view/edit
  - `src/app/(dashboard)/items/page.tsx` — list view with filters
  - `GuidanceItemForm.tsx` — shared form component
- **Form fields**:
  - `title` (text input, required)
  - `url` (text input, required, auto-normalized)
  - `summary` (textarea, required)
  - `doc_type` (select: tutorial/how_to/reference/explanation)
  - `status` (select: draft/canonical/duplicate/obsolete)
  - `access` (select: public/staff/restricted)
  - `campus_scope` (select: uk/malaysia/china/all)
  - `last_reviewed` (date picker)
  - `review_cycle_months` (number input)
  - `tags` (tag input with autocomplete)
  - `notes_internal` (textarea)
- **Relationship selectors** (multi-select for each):
  - Services (grouped by service_area)
  - Tasks
  - Topics
  - Audiences (showing hierarchy)
  - Owners (OWNED_BY)
  - Maintainers (MAINTAINED_BY)
  - Locations (HOSTED_AT)
- **Validation**:
  - Required fields enforced
  - Canonical gate: cannot set status to `canonical` unless title, url, summary, doc_type, access, ≥1 service, ≥1 owner populated
  - URL normalized on save
- **UX (Nielsen)**:
  - **#5 Error prevention**: Inline validation, confirm before archive
  - **#7 Flexibility**: Keyboard shortcuts for save (Ctrl+S)
  - **#2 Real world**: Labels use language familiar to guidance authors
- **Acceptance**: Full CRUD cycle works. Canonical gate enforced. URL normalization applied.

### Task 1.5: Relationship Editor

- **Action**: Build UI for linking guidance items to each other
- **Components**:
  - `RelationshipEditor.tsx` — within item detail page
- **Link types**: `duplicate_of`, `supersedes`, `related_to`
- **UX**: Search for target item by title (fuzzy), select link type, confirm
- **Acceptance**: Can create/delete links between items. Links appear on both items.

### Task 1.6: Graph Visualisation

- **Action**: Build the main graph explorer page
- **Components**:
  - `GraphCanvas.tsx` — Cytoscape.js wrapper
  - `GraphControls.tsx` — zoom, fit, reset, layout toggle
  - `GraphFilters.tsx` — left panel faceted filters
  - `GraphDetails.tsx` — right panel showing selected node/edge details
- **Data flow**:
  1. `/api/graph` route fetches filtered data with joins
  2. `src/lib/graph/transform.ts` converts DB rows → Cytoscape elements
  3. `GraphCanvas` renders elements
- **Graph features**:
  - Nodes: guidance_items (central), services, owners, audiences, topics, locations
  - Edges: all relationship types with distinct colours/styles
  - Click node → highlight 1-hop neighbourhood, show details
  - Double-click → focus mode (N-hop subgraph)
  - Shift-click → multi-select
  - Reset view button
- **Performance**:
  - Render only filtered subgraph
  - Layout computed in Web Worker if > 500 nodes
  - Debounce filter inputs (300 ms)
  - Memoize Cytoscape element transforms
- **Accessibility**:
  - `AccessibleTable.tsx` — table alternative to graph
  - Keyboard navigation between nodes
  - ARIA labels on all controls
  - Colour + icon/shape to distinguish node types (never colour alone)
- **Acceptance**: Graph renders with seeded data. Filters update graph in < 100 ms. Accessible table available.

### Task 1.7: Fuzzy Search

- **Action**: Implement Fuse.js client-side search
- **Components**:
  - `src/lib/search/fuse-config.ts` — index configuration
  - `src/hooks/useFuzzySearch.ts` — hook wrapping Fuse instance
  - `SearchInput.tsx` — top bar search with results dropdown
- **Configuration**:
  - Keys: `title` (weight 2), `summary` (weight 1), `tags` (weight 1.5)
  - Threshold: 0.35
  - Min match char length: 2
- **Behaviour**: Results filter graph in real-time. Clicking a result focuses that node.
- **Performance**: Index rebuilt on data change via TanStack Query invalidation
- **Acceptance**: Fuzzy search returns relevant results with typos. < 5 ms search time.

### Task 1.8: Admin User Management

- **Action**: Build admin page for creating accounts and assigning roles
- **Components**:
  - `src/app/(dashboard)/admin/users/page.tsx`
- **Features**:
  - List all users with their roles
  - Create new user (email + temporary password)
  - Change user role (viewer/editor/admin)
- **Acceptance**: Admin can create users and assign roles. New users can log in.

### Task 1.9: Core Tests

- **Action**: Write tests for critical paths
- **Unit tests**:
  - URL normalization
  - Review-due date calculation
  - Graph data transforms (DB rows → Cytoscape elements)
  - Fuse.js search accuracy
- **Component tests**:
  - GuidanceItemForm validation
  - GraphFilters state management
  - SearchInput rendering
- **E2E tests** (Playwright):
  - Login → create item → verify on graph → filter → archive
  - Search for item with typo → find it
- **Acceptance**: All tests pass in CI. Coverage > 60% for `src/lib/`.

---

## Phase 2 — Governance and Polish

**Goal**: Review workflows, duplicate management, saved views, reporting.

### Task 2.1: Review Cycle Dashboard

- **Reports**: Items overdue for review, items due within 30 days
- **API**: `/api/reports/overdue` — `last_reviewed + review_cycle_months < today`
- **UI**: Table with sort/filter, bulk action to update `last_reviewed`

### Task 2.2: Duplicate/Supersede Workflow

- **Action**: One-click "Mark as duplicate of…" / "Superseded by…"
- **UI**: Search for target, create link, optionally update status to `duplicate`/`obsolete`

### Task 2.3: Saved Filter Views

- **Phase 2a**: Save to `localStorage`
- **Phase 2b**: Save to database (new `saved_views` table)
- **UI**: "Save current view" button in top bar, dropdown to load saved views

### Task 2.4: Shareable URLs

- **Action**: Encode filter state in URL query params
- **Behaviour**: Sharing URL restores exact filter state for recipient

### Task 2.5: Coverage Map Report

- **Action**: Services × Tasks matrix showing which cells have guidance
- **UI**: Heatmap-style table, click cell to see matching items
- **API**: `/api/reports/gaps` — cells with no guidance items

### Task 2.6: Service Area Drill-Down

- **Action**: Click a service_area to see all services and their guidance items
- **UI**: Nested tree/accordion view grouped by service_area → service → items

---

## Phase 3 — Advanced Features (As Needed)

### Task 3.1: CSV Import/Export

- Import guidance items from CSV with column mapping
- Export current filtered view as CSV

### Task 3.2: Audit Log

- `change_log` table populated by PostgreSQL trigger
- UI to browse change history per item

### Task 3.3: Duplicate Detection Hints

- Background analysis: items sharing ≥2 of (service, task, audience) with similar titles
- Surface as suggestions in the UI

### Task 3.4: Task Prerequisites

- `task_prerequisites` join table
- Only enabled once task vocabulary is mature
- Visual prerequisite chain in graph view

### Task 3.5: Cross-Campus Comparison

- Filter/compare guidance across UK, Malaysia, China campuses
- Identify gaps where guidance exists for one campus but not others

---

## Development Conventions

### Git Workflow

- `main` — production, auto-deploys to Vercel
- `feature/*` — feature branches, create PR to merge
- Commit messages: `type(scope): description` (e.g. `feat(graph): add focus mode`)
- All PRs must pass CI (lint + type-check + test)

### Code Style

- **TypeScript strict mode** — no `any`, no implicit returns
- **Functional components** — no class components
- **Named exports** — no default exports (except pages)
- **Barrel files** — `index.ts` per directory for clean imports
- **Comments**: JSDoc for public functions, inline for complex logic
- **Max file size**: 200 lines (split if larger)

### Testing

- Write tests alongside features, not after
- Unit tests for all `src/lib/` utilities
- Component tests for forms and interactive UI
- E2E tests for critical user journeys
- Run `npm run test` before every commit

### Performance Checklist (per feature)

- [ ] Debounced user inputs?
- [ ] Memoised expensive calculations?
- [ ] Virtualised long lists?
- [ ] Lazy-loaded non-critical components?
- [ ] Tested with 1,000+ items dataset?

### Accessibility Checklist (per feature)

- [ ] Keyboard-navigable?
- [ ] Screen reader tested?
- [ ] ARIA labels on interactive elements?
- [ ] 7:1 contrast ratio for text?
- [ ] No colour-only indicators?
- [ ] Focus management on state changes?
