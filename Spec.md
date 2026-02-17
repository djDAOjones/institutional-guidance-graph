# Institutional Guidance Graph - Product Spec

## 1) Purpose

Create a single, structured register of institutional guidance so DTS teams can discover what exists, where it lives, who owns it, what it covers, and how it relates to other guidance.

This is not a content migration project. Content stays in its existing platforms; this app indexes and maps it.

## 2) Problem Statement

Operational support (helpdesk) is centralized, but practical guidance is fragmented across many owners and platforms (SharePoint, intranet, vendor docs, project spaces, etc.).

Risks today:
- Duplicate or competing guidance
- Out-of-date guidance surfacing because it ranks well in search
- Teams reinventing work that already exists
- Unclear ownership and maintenance cycles

## 3) Outcomes and Success Criteria

Primary outcomes:
- A findable and filterable map of guidance across DTS domains
- Clear ownership and review metadata for each guidance item
- Visibility of duplication, superseded content, and coverage gaps

Success criteria (MVP):
- 1,000+ guidance items can be stored and queried
- Graph interactions remain usable at ~8,000 edges on 1440×810+
- Records can be created and edited via forms (no raw DB editing)
- Filters update the graph and result counts in real time
- Clicking nodes/edges opens details and allows contextual filtering
- Fuzzy search returns relevant results despite typos or partial input

## 4) Users and Roles

Audience: guidance authors, training teams, strategy leads, service owners.

Expected concurrent users: 2–3.

Role model (MVP):
- **Viewer** — read, search, filter graph and records
- **Editor** — create/edit records and relationships
- **Admin** — manage controlled vocabularies, users, and system settings

Roles are enforced via Supabase Row-Level Security (RLS) policies mapped to a `user_roles` table. See section 8.

Optional later:
- **Auditor** — read-only access scoped to reporting views

## 5) Core Functional Scope

### 5.1 Record management
- Create/edit/archive `guidance_items` via dedicated UI forms
- Create/manage lookup entities (`service_areas`, `services`, `tasks`, `topics`, `audiences`, `owners`, `locations`)
- Validate required fields and controlled vocabularies on submit

### 5.2 Graph exploration
- Interactive graph visualization (desktop-first, 1440×810+)
- Pan, zoom, node focus, neighborhood expansion/collapse
- Click node/edge → details panel
- Apply filters from side panel or directly from a selected node/edge

### 5.3 Filtering and search
- **Fuzzy search** (Fuse.js, client-side): title, summary, tags — typo-tolerant, instant
- **Faceted filtering**: service_area, service, task, topic, audience, owner, maintainer, location, campus_scope, status, doc_type, access, review freshness
- Live graph and result counts update on filter change

### 5.4 Governance support
- Mark records as `canonical` / `duplicate` / `obsolete` / `draft`
- Show `last_reviewed` and calculated next-review-due date
- Track ownership and stewardship per guidance item

## 6) Data Model (v1)

Relational schema in Supabase (PostgreSQL). Relationships between entities are modelled via join/edge tables, giving us graph-like traversal with standard SQL. All lookup IDs are referenced from `guidance_items` via join tables — no free-text foreign references.

### 6.1 Core table

**`guidance_items`** (the central node)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Default `gen_random_uuid()` |
| `title` | `text` NOT NULL | |
| `url` | `text` NOT NULL | Normalized on write |
| `summary` | `text` NOT NULL | 1–2 sentences |
| `doc_type` | `enum` NOT NULL | `tutorial`, `how_to`, `reference`, `explanation` |
| `status` | `enum` NOT NULL | `draft`, `canonical`, `duplicate`, `obsolete` |
| `access` | `enum` NOT NULL | `public`, `staff`, `restricted` |
| `campus_scope` | `enum` NOT NULL | `uk`, `malaysia`, `china`, `all`; default `all` |
| `last_reviewed` | `date` | |
| `review_cycle_months` | `int` | |
| `notes_internal` | `text` | Private/admin comments |
| `is_archived` | `boolean` | Soft delete; default `false` |
| `tags` | `text[]` | PostgreSQL array; controlled vocabulary |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto via trigger |
| `created_by` | `uuid` FK → `auth.users` | |
| `updated_by` | `uuid` FK → `auth.users` | |

### 6.2 Lookup tables

Each lookup table has `id uuid PK`, `slug text UNIQUE`, `label text`, `description text`, `created_at`. The `slug` is the machine-readable key; `label` is the human-readable display name.

**`service_areas`** (top-level domains)

| Slug | Label |
| --- | --- |
| `assessment` | Assessment |
| `teaching` | Teaching |
| `media_production` | Media Production |
| `security_compliance` | Security & Compliance |
| `it_support` | IT Support |
| `research_systems` | Research Systems |
| `student_records` | Student Records |
| `hr` | HR |
| `estates` | Estates |

**`services`** (systems/tools — each linked to a `service_area`)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE | Machine key |
| `label` | `text` | Display name |
| `service_area_id` | `uuid` FK → `service_areas` | Parent domain |
| `description` | `text` | |
| `created_at` | `timestamptz` | Auto |

Initial services: `moodle`, `lecture_capture`, `software_library`, `echo`, `xerte`, `unicore`, `campus_solutions`, `room_bookings`, `ms365`, `examsys`, `turnitin`, `wifi`

**`audiences`** (hierarchical — supports sub-categories via `parent_id`)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE | Machine key |
| `label` | `text` | Display name |
| `parent_id` | `uuid` FK → `audiences` | NULL for top-level |
| `description` | `text` | |
| `created_at` | `timestamptz` | Auto |

Initial hierarchy:

- `staff` → `academic`, `professional_services`, `other`
- `students` → `under_grad`, `post_grad`, `student_teachers`
- `researchers` (top-level)
- `applicants` (top-level)
- `public` (top-level)
- `partners` (top-level)

**`owners`** (teams responsible for guidance)

Initial values: `digital_education_service`, `university_of_nottingham_online`, `service_design`, `service_delivery`, `eacit`, `unicore_team`, `mobile_app_team`, `ris_team`, `eis_team`, `student_services`, `library`, `hr`, `external_vendor`, `unknown`, `faculty_school_support`, `learning_content_team`

**`locations`** (where guidance content is hosted)

Initial values: `uon_public_web`, `sharepoint_intranet`, `teams_channel`, `moodle`, `xerte`, `helpdesk_portal`, `vendor_docs`, `external_web`, `echo_video`, `atlassian`

**`topics`** (subject tags — prevents `RELATED_TO` becoming sludge)

Initial values: to be defined during Phase 0 taxonomy workshop. Examples: `accessibility`, `assessment_design`, `video_production`, `data_protection`, `student_support`.

**`tasks`** (what the guidance helps someone do)

Initial values: to be fleshed out during Phase 0. Examples: `set_up_zoom_meeting`, `request_exam_software`, `submit_turnitin_assignment`, `configure_moodle_course`.

### 6.3 Relationship tables (edges)

Each relationship table has `id uuid PK`, two foreign keys, and `created_at`.

**Entity relationships** (GuidanceItem → Lookup):

| Table | From | To | Edge meaning | Cardinality |
| --- | --- | --- | --- | --- |
| `guidance_services` | `guidance_items` | `services` | ABOUT_SERVICE | many-to-many |
| `guidance_tasks` | `guidance_items` | `tasks` | GUIDANCE_FOR | many-to-many |
| `guidance_audiences` | `guidance_items` | `audiences` | FOR_AUDIENCE | many-to-many |
| `guidance_owners` | `guidance_items` | `owners` | OWNED_BY | many-to-many |
| `guidance_maintainers` | `guidance_items` | `owners` | MAINTAINED_BY | many-to-many |
| `guidance_locations` | `guidance_items` | `locations` | HOSTED_AT | many-to-many |
| `guidance_topics` | `guidance_items` | `topics` | HAS_TOPIC | many-to-many |

Note: `OWNED_BY` = strategic/policy owner. `MAINTAINED_BY` = day-to-day updater. Often the same team, but not always.

**Self-referencing edges** (guidance ↔ guidance):

| Table | Columns | Notes |
| --- | --- | --- |
| `guidance_links` | `source_id`, `target_id`, `link_type` | `link_type` enum: `duplicate_of`, `supersedes`, `related_to` |

**Deferred to Phase 3:**

- `task_prerequisites` — only worth curating once the task vocabulary is mature. Adding prematurely creates noisy, speculative links.

### 6.4 Auth table

| Table | Columns | Notes |
| --- | --- | --- |
| `user_roles` | `user_id` FK → `auth.users`, `role` enum | `viewer`, `editor`, `admin` |

Supabase Auth handles sign-up/login via email + password. Admins can also create accounts and assign roles manually via an admin panel. The `user_roles` table maps each user to a role. RLS policies on every table check the caller's role before allowing reads or writes.

## 7) Data Standards and Governance Rules

- **Controlled vocabularies** for: `doc_type`, `status`, `access`, `source_platform`, `tags`. Managed via a `vocabularies` admin table or hardcoded enums in the schema.
- **URL normalization** — strip trailing slashes, lowercase hostname, remove tracking params — enforced by a database trigger or application-level transform on write.
- **Soft delete** — `is_archived = true` rather than hard delete, for auditability.
- **Canonical gate** — a record cannot be set to `canonical` unless `title`, `url`, `summary`, `doc_type`, `access`, `source_platform`, and at least one `service` and one `owner` are populated.
- **UUIDs** as primary keys (Supabase default). Human-readable short IDs (e.g. `gui-a3f8`) can be derived for display if needed.

## 8) Technical Architecture

### 8.1 Stack

| Layer | Technology | Hosting |
|---|---|---|
| Frontend + API routes | Next.js (App Router, TypeScript) | Vercel free tier |
| UI components | shadcn/ui + Tailwind CSS | — |
| Graph visualization | Cytoscape.js | — |
| Fuzzy search | Fuse.js (client-side) | — |
| Database | PostgreSQL (managed) | Supabase free tier |
| Auth | Supabase Auth (email/password) | Supabase free tier |
| Access control | Supabase Row-Level Security | — |
| Realtime (optional) | Supabase Realtime | — |

### 8.2 Why this stack

- **Zero infrastructure to manage.** Vercel and Supabase are fully managed; no server, no Docker, no SSH.
- **One language.** TypeScript end-to-end: UI, API routes, database queries (via Supabase JS client or Prisma).
- **Auth is built-in.** Supabase Auth + RLS means no custom JWT plumbing; policies live in the database.
- **No CORS issues.** Next.js API routes and the frontend share the same origin on Vercel.
- **Free tier is generous.** Supabase: 500 MB database, 50K monthly active users, unlimited API requests. Vercel: 100 GB bandwidth, serverless functions included.
- **Automatic CI/CD.** Push to `main` on GitHub → Vercel builds and deploys. No pipeline to configure.
- **Scale path.** If the project grows, both Vercel and Supabase have paid tiers. No re-architecture needed.

### 8.3 Data flow

```text
Browser (Next.js)
  ├── UI renders graph (Cytoscape.js) + forms (shadcn/ui)
  ├── Fuse.js indexes guidance items in memory for fuzzy search
  ├── Supabase JS client → Supabase PostgreSQL (reads, writes, auth)
  └── Next.js API routes (for complex graph queries or batch operations)
        └── Supabase service-role client → PostgreSQL
```

For the graph endpoint, a single SQL query with joins across the relationship tables returns all nodes and edges for the current filter set. The frontend transforms this into Cytoscape.js elements.

### 8.4 Supabase free tier limits to monitor

| Resource | Free tier limit | Our expected usage |
|---|---|---|
| Database size | 500 MB | ~5 MB for 1,000 items + edges |
| Monthly active users | 50,000 | 2–3 |
| API requests | Unlimited | Light |
| Realtime connections | 200 concurrent | 0–3 |
| Edge function invocations | 500K/month | Minimal |

No risk of hitting limits at this scale.

## 9) Frontend UX

Desktop-first graph explorer for 1440×810 and above. Responsive down to 1024px (stacked layout).

### 9.1 Layout

| Region | Content |
|---|---|
| **Left panel** | Filter controls + faceted search |
| **Centre** | Graph canvas (Cytoscape.js) |
| **Right panel** | Details for selected node/edge; edit forms |
| **Top bar** | Fuzzy search input + saved views + user menu |

### 9.2 Interactions

- **Click node** → highlight 1-hop neighborhood, open details in right panel
- **Click edge** → show relationship type and linked items, offer contextual filter
- **Double-click node** → enter "focus mode" (N-hop subgraph around that item)
- **Shift-click** → multi-select for comparison
- **"Reset view"** button → clear filters, re-centre graph
- **"Save filter set"** → persist current filters as a named view (stored in `localStorage` initially, database later)

### 9.3 Performance strategies

- Render only the filtered subgraph, not the full dataset
- Debounce filter and search inputs (300 ms)
- Virtualise the details list if it exceeds ~100 items
- Cytoscape layout computed in a Web Worker if > 500 visible nodes

### 9.4 Accessibility

- All interactive elements keyboard-navigable with visible focus indicators
- Graph nodes reachable via an accessible list/table alternative
- Colour is never the sole indicator of status (pair with icons or labels)
- ARIA labels and descriptions on all graph controls and panels
- Meets WCAG 2.1 AAA compliance requirements including:
  - 7:1 contrast ratio for normal text and 4.5:1 for large text
  - Multiple ways to navigate and find content
  - Context-sensitive help for all user inputs
  - No time limits on user interactions
  - Sign language support for any audio content
- Fully functional with screen readers and other assistive technologies

## 10) API Design (v1)

Most reads and writes go directly through the **Supabase JS client** with RLS. Next.js API routes handle cases where server-side logic is needed.

### 10.1 Supabase client calls (from browser)

```typescript
// Fetch guidance items with all related entities
supabase.from('guidance_items').select(`
  *,
  guidance_services(services(*, service_areas(*))),
  guidance_tasks(tasks(*)),
  guidance_topics(topics(*)),
  guidance_audiences(audiences(*)),
  guidance_owners(owners(*)),
  guidance_maintainers(owners(*)),
  guidance_locations(locations(*))
`)

// CRUD operations
supabase.from('guidance_items').insert({ ... })
supabase.from('guidance_items').update({ ... }).eq('id', id)
supabase.from('guidance_items').update({ is_archived: true }).eq('id', id)

// Auth
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
```

RLS ensures viewers cannot write and editors cannot modify vocabularies.

### 10.2 Next.js API routes (server-side)

| Route | Method | Purpose |
|---|---|---|
| `/api/graph` | GET | Returns filtered nodes + edges shaped for Cytoscape.js |
| `/api/reports/overdue` | GET | Items past their review due date |
| `/api/reports/duplicates` | GET | Candidate duplicates by service+task+audience overlap |
| `/api/reports/gaps` | GET | Items missing owner or key metadata |
| `/api/admin/vocabularies` | GET/POST | Manage controlled vocabulary entries |

These routes use the Supabase **service-role key** (server-only, never exposed to the browser) for queries that need elevated access or complex joins.

### 10.3 Security

- **Authentication**: Supabase Auth (email + password). Magic link or SSO can be added later.
- **Authorisation**: RLS policies on every table, keyed to `user_roles.role`.
- **No CORS complexity**: frontend and API routes share the Vercel origin.
- **Service-role key**: stored as a Vercel environment variable, never shipped to the client.
- **Rate limiting**: Vercel's built-in serverless function limits (free tier: 100 GB-hrs/month) are more than sufficient.

## 11) Search Implementation

### 11.1 Fuzzy search (Fuse.js)

On page load, the app fetches all `guidance_items` (id, title, summary, tags) into a Fuse.js index in memory. With ≤ 1,000 items this is ~200 KB and searches in < 5 ms.

Fuse.js configuration:

- **Keys**: `title` (weight 2), `summary` (weight 1), `tags` (weight 1.5)
- **Threshold**: 0.35 (tolerant of typos)
- **Min match char length**: 2

The index is rebuilt when a record is created or updated (via Supabase realtime subscription or on next page focus).

### 11.2 Faceted filters

Faceted filters operate on the Supabase query level (WHERE clauses). They stack with the fuzzy search: search narrows the candidate set, then facets filter within it.

## 12) Audit and Change Tracking

MVP (low effort):

- `created_at`, `updated_at`, `created_by`, `updated_by` on all core tables (automatic via Supabase triggers)

Phase 2:

- `change_log` table: `id`, `table_name`, `record_id`, `action` (insert/update/archive), `user_id`, `changed_at`, `diff_summary` (JSONB)
- Populated by a PostgreSQL trigger on `guidance_items`

## 13) Reporting and Analysis Views

| Report | Logic |
|---|---|
| **Review overdue** | `last_reviewed + review_cycle_months < today` |
| **Duplicate candidates** | Items sharing ≥ 2 of (service, task, audience) with similar titles |
| **Ownership gaps** | Records with no linked `owner` |
| **Platform concentration** | Count of items grouped by `source_platform` |
| **Coverage map** | Matrix of services × tasks showing which cells have guidance |

Reports are implemented as Next.js pages calling the `/api/reports/*` routes.

## 14) Testing Strategy

### 14.1 Levels

| Level | Tool | What it covers |
|---|---|---|
| **Unit** | Vitest | Utility functions, data transforms, Fuse.js config |
| **Component** | Vitest + React Testing Library | Form validation, filter panel, details panel |
| **Integration** | Vitest + MSW (Mock Service Worker) | Supabase client calls, API route handlers |
| **E2E** | Playwright | Full user flows: login → create item → see it on graph → filter → archive |
| **Visual regression** | Playwright screenshots (optional) | Graph layout doesn't break after changes |

### 14.2 Approach

- Write tests alongside features, not as a separate phase
- E2E tests for the 3–4 critical user journeys (create, search, filter, archive)
- Unit tests for any non-trivial logic (URL normalization, review-due calculation, graph data transforms)
- Run on every PR via GitHub Actions (free for public repos, 2,000 mins/month for private)

## 15) CI/CD and Deployment

### 15.1 Pipeline

```text
git push to main
  → GitHub Actions: lint + type-check + test
  → Vercel auto-build: Next.js build + deploy to production
```

Preview deployments: every PR gets a unique Vercel preview URL for manual review.

### 15.2 Environment management

| Environment | Vercel | Supabase |
|---|---|---|
| **Development** | `localhost:3000` | Local Supabase CLI or a dev project |
| **Preview** | Vercel preview URL (per PR) | Dev Supabase project |
| **Production** | `guidance-graph.vercel.app` | Production Supabase project |

Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are set in Vercel project settings per environment.

### 15.3 Database migrations

Use the **Supabase CLI** (`supabase db diff` / `supabase db push`) or **Prisma Migrate** to version-control schema changes as SQL migration files in the repo.

## 16) Backup and Recovery

- **Supabase automatic backups**: daily backups retained for 7 days (free tier). Point-in-time recovery available on paid plans.
- **Manual export**: periodic `pg_dump` via Supabase CLI or dashboard as an extra safety net.
- **Git**: all code, migrations, and vocabulary seed data are in version control.

At this scale (< 5 MB of data), a full database export takes seconds and can be stored in the repo or a private gist.

## 17) Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Taxonomy drift over time | Controlled vocabularies enforced by enums/lookup tables; admin-only edits |
| Data quality inconsistency | Validation on create/edit; canonical gate rule (section 7) |
| Graph becomes visually cluttered | Default to filtered views; focus mode; limit initial render to subgraph |
| Ownership ambiguity | Require at least one owner at creation time |
| Supabase free tier sunset or limits change | Data is portable PostgreSQL; can self-host Supabase or migrate to any Postgres provider |
| Vercel free tier limits | 100 GB bandwidth is far beyond our needs; upgrade path is straightforward |
| Single point of failure (one admin) | Document all setup steps; keep infra-as-code in repo |

## 18) Delivery Plan

### Phase 0 — Setup and taxonomy (1–2 days)

- Agree controlled vocabularies (service_areas, services, tasks, topics, audiences, owners, locations, doc_type, status, access, campus_scope, initial tags)
- Set up GitHub repo, Vercel project, Supabase project
- Create database schema (enums, tables, join tables, indexes) and seed all vocabulary tables
- Configure Supabase Auth (email/password) and RLS policies for all tables
- Map services → service_areas and audiences → parent hierarchy

### Phase 1 — MVP (1–2 weeks)

- Auth: email/password login/logout, role display, admin account creation
- CRUD forms for guidance items (create, edit, archive) with all relationship selectors
- CRUD for lookup entities (service_areas, services, tasks, topics, audiences, owners, locations)
- Relationship editor (link items to entities via ABOUT_SERVICE, GUIDANCE_FOR, FOR_AUDIENCE, OWNED_BY, MAINTAINED_BY, HOSTED_AT, HAS_TOPIC; link items to each other via DUPLICATE_OF, SUPERSEDES, RELATED_TO)
- Campus scope selector (uk, malaysia, china, all)
- Graph visualization with core filters and details panel
- Fuzzy search with Fuse.js
- Populate first 50–100 real guidance items to validate taxonomy and UX
- Basic E2E tests for critical flows

### Phase 2 — Governance and polish (1–2 weeks)

- Review-cycle dashboard (overdue items, upcoming reviews)
- Duplicate/supersede workflow (mark + link in one action)
- Saved filter views (localStorage, then database-backed)
- Shareable URLs (filter state encoded in query params)
- Coverage map report (services × tasks matrix)
- Service area drill-down view

### Phase 3 — Advanced (as needed)

- CSV import/export tooling
- Audit log table + UI
- Recommendation hints (possible duplicates, missing links)
- Task prerequisite graph (once task vocabulary is mature)
- Cross-campus comparison views

## 19) Design Principles and Development Requirements

### 19.1 Design System and Accessibility

- **IBM Carbon Design System**: The application will follow the IBM Carbon Design System principles and components.
  - Use Carbon's grid system, type scales, spacing tokens, and color palette
  - Leverage Carbon's React component library for consistent UI elements
  - Follow Carbon's interaction patterns for forms, modals, and data visualization

- **WCAG AAA Compliance**: The application must meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AAA standards.
  - Minimum contrast ratio of 7:1 for normal text and 4.5:1 for large text
  - Multiple ways to navigate and find content
  - Sign language interpretation for all pre-recorded audio content
  - Context-sensitive help and instructions for all user inputs
  - No time limits on user interactions
  - Keyboard-only navigation for all features

- **Nielsen's 10 Usability Heuristics**: The UX design must adhere to Nielsen's heuristics:
  1. **Visibility of system status**: Always show users where they are and what's happening
  2. **Match between system and real world**: Use language and concepts familiar to guidance authors
  3. **User control and freedom**: Easy undo/redo and escape from unwanted states
  4. **Consistency and standards**: Follow established conventions for graph visualization
  5. **Error prevention**: Validate inputs before submission and confirm destructive actions
  6. **Recognition over recall**: Make actions and options visible rather than requiring memorization
  7. **Flexibility and efficiency**: Provide shortcuts for power users while maintaining discoverability
  8. **Aesthetic and minimalist design**: Focus on essential information, minimize visual noise
  9. **Help users recognize and recover from errors**: Clear error messages with solutions
  10. **Help and documentation**: Contextual help for complex features like graph filtering

### 19.2 Development Requirements

- **Computational Efficiency**:
  - Optimize graph rendering for 1,000+ nodes with debounced updates
  - Implement virtualization for large lists and tables
  - Use memoization for expensive calculations
  - Lazy-load components and data where appropriate
  - Profile and optimize critical rendering paths
  - Set performance budgets: initial load < 2s, interactions < 100ms

- **Documentation Requirements**:
  - Inline code comments for complex logic
  - TypeScript interfaces/types for all data structures
  - README files for each major directory explaining purpose and patterns
  - Storybook documentation for UI components
  - API documentation with example requests/responses
  - User guide for administrators covering controlled vocabulary management
  - Developer onboarding guide with local setup instructions

- **Modularity and Architecture**:
  - Follow feature-based directory structure
  - Implement clean separation between UI, state management, and API calls
  - Create reusable hooks for common operations
  - Abstract graph operations behind a service layer
  - Use dependency injection patterns where appropriate
  - Implement adapter pattern for external services
  - Design for testability with pure functions and mockable dependencies
  - Follow single responsibility principle for components and functions

These principles and requirements must be considered at every stage of development, from initial architecture to feature implementation and code review.

## 20) Stack Summary

| Concern | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| UI | shadcn/ui + Tailwind CSS |
| Graph | Cytoscape.js |
| Search | Fuse.js (client-side fuzzy) |
| State / data fetching | TanStack Query |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth + RLS |
| Hosting (app) | Vercel free tier |
| Hosting (DB) | Supabase free tier |
| CI/CD | GitHub Actions + Vercel auto-deploy |
| Testing | Vitest + React Testing Library + Playwright |

## 21) Development Workflow

### 21.1 Local Development Environment

**Prerequisites:**

- Node.js 18+ and npm/yarn/pnpm
- Git
- GitHub account
- Supabase account
- Vercel account (linked to GitHub)

**Initial Setup:**

1. **GitHub Repository:**
   - Create a new GitHub repository
   - Clone it to your local machine: `git clone <repo-url>`

2. **Next.js Project:**
   - Initialize Next.js with TypeScript: `npx create-next-app@latest --typescript`
   - Install dependencies: `npm install @supabase/supabase-js @tanstack/react-query cytoscape fuse.js`
   - Install UI libraries: `npm install tailwindcss @tailwindcss/forms shadcn-ui`

3. **Supabase Setup:**
   - Create a new Supabase project from dashboard
   - Run SQL migrations to create tables and RLS policies
   - Get API keys (anon public key and service role key)

4. **Environment Configuration:**
   - Create `.env.local` file with Supabase credentials:
     
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

### 21.2 Development Workflow

**Daily Development:**

1. **Local Development Server:**
   - Run `npm run dev` to start Next.js development server
   - Access at `http://localhost:3000`
   - Hot module reloading enabled by default

2. **Database Changes:**
   - Use Supabase dashboard for schema changes during early development
   - Later, use Supabase CLI for migrations: `supabase db diff -f migration_name`
   - Apply migrations locally: `supabase db push`

3. **Feature Branch Workflow:**
   - Create feature branch: `git checkout -b feature/name`
   - Commit changes: `git commit -am "Add feature X"`
   - Push to GitHub: `git push origin feature/name`
   - Create pull request on GitHub

### 21.3 Deployment Process

**Vercel Integration:**

1. **Initial Setup:**
   - Connect GitHub repository to Vercel
   - Configure build settings (typically automatic)
   - Add environment variables in Vercel project settings

2. **Deployment Types:**
   - **Preview Deployments:** Automatically created for each PR
   - **Production Deployment:** Automatically triggered on merge to `main`

3. **Environment Variables:**
   - Configure in Vercel dashboard for each environment
   - Production variables are separate from preview/development

4. **Collaboration:**
   - Team members can be added to both GitHub repo and Vercel project
   - Vercel preview deployments allow easy review of changes

### 21.4 Supabase Management

**Database Management:**

1. **Development Database:**
   - Use Supabase project for development
   - Can use local Supabase instance with Docker for offline work

2. **Production Database:**
   - Separate Supabase project for production
   - Migrations applied via CI/CD or manually

3. **Data Seeding:**
   - Create seed scripts for initial data
   - Use Supabase dashboard for manual data entry during early development

### 21.5 Access Management

**Required Access for Development:**

1. **GitHub Repository:** Write access for developers
2. **Vercel Project:** Team member access
3. **Supabase Project:** Team member access

With this setup, developers can work locally with full hot-reloading capabilities, push changes to GitHub, and have Vercel automatically build and deploy the application. The Supabase database can be accessed both locally during development and remotely in production.

## 22) Required User Information and Setup Steps

Before development can begin, the following information and setup steps are required from the user. This ensures efficient development without unnecessary back-and-forth.

### 22.1 Required Accounts and Access

1. **GitHub Account**
   - Username: _________________
   - Repository name preference: _________________
   - Public or private repository: _________________

2. **Vercel Account**
   - Email associated with account: _________________
   - Preferred project name/subdomain: _________________
   - Team name (if applicable): _________________

3. **Supabase Account**
   - Email associated with account: _________________
   - Preferred project name: _________________
   - Region preference for database: _________________

### 22.2 Development Environment Decisions

1. **Local Environment**
   - Preferred package manager (npm, yarn, pnpm): _________________
   - Node.js version available: _________________
   - Will you be developing locally or would you prefer a GitHub Codespaces setup?: _________________

2. **Authentication Requirements**
   - Email/password authentication required? (Y/N): _________________
   - Any other auth providers needed (Google, GitHub, etc.)?: _________________
   - Will you need email verification? (Y/N): _________________

3. **Controlled Vocabularies**
   - Initial list of services: _________________
   - Initial list of tasks: _________________
   - Initial list of audiences: _________________
   - Initial list of source platforms: _________________

### 22.3 Access Tokens and Environment Variables

The following tokens will be needed during development. These should **NOT** be shared in the chat but should be added to environment variables in Vercel and your local `.env.local` file:

1. **GitHub**
   - Personal access token (for CI/CD if needed)

2. **Vercel**
   - Vercel access token (if using Vercel CLI)
   - Project ID (after project creation)

3. **Supabase**
   - Project URL
   - Anon public key
   - Service role key (secret, never expose in client code)

### 22.4 Setup Process for Development

1. **Repository Setup**
   - Create GitHub repository or provide access to existing repository
   - Clone repository locally

2. **Vercel Project Setup**
   - Create new project in Vercel dashboard
   - Connect to GitHub repository
   - Configure environment variables

3. **Supabase Project Setup**
   - Create new project in Supabase dashboard
   - Note down connection details
   - Apply initial SQL migrations

4. **Local Development Setup**
   - Create `.env.local` file with environment variables
   - Install dependencies
   - Run development server

Please provide the information requested above before development begins. For sensitive information like access tokens, these should be added to environment variables directly and not shared in the chat.

## 23) Immediate Next Steps

1. Create GitHub repo and initialise Next.js project with TypeScript + Tailwind + shadcn/ui.
2. Create Supabase project; apply initial schema migration (tables, enums, RLS policies).
3. Build auth flow (login page, session management, role check).
4. Build CRUD forms for `guidance_items` and lookup entities.
5. Build graph page: fetch data → transform to Cytoscape elements → render with filters.
6. Add Fuse.js fuzzy search.
7. Begin populating real guidance items to validate the model.
