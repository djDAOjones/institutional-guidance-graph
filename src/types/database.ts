/**
 * TypeScript types for the Supabase database schema.
 *
 * These types mirror the PostgreSQL schema defined in the Supabase migrations.
 * They provide compile-time type safety for all database operations.
 *
 * When the schema changes, regenerate types with:
 *   npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
 *
 * For now, these are manually maintained to match the migration SQL exactly.
 */

/* ── Enum types (match PostgreSQL enums) ── */

/** Document type following the Diátaxis framework + Navigation */
export type DocType = "tutorial" | "how_to" | "reference" | "explanation" | "navigation";

/** Guidance item lifecycle status */
export type ItemStatus = "intended" | "draft" | "canonical" | "duplicate" | "obsolete";

/** Access level for the guidance item */
export type AccessLevel = "public" | "staff" | "restricted";

/** Campus scope — which campus(es) this guidance applies to */
export type CampusScope = "uk" | "malaysia" | "china" | "all";

/** User role for RBAC via Supabase RLS */
export type UserRole = "viewer" | "editor" | "admin";

/** Self-referencing link type between guidance items */
export type LinkType = "duplicate_of" | "supersedes" | "related_to";

/** Location type for hierarchical containers */
export type LocationType = 
  | "sharepoint_site" 
  | "xerte_collection" 
  | "atlassian_space" 
  | "website_area" 
  | "external_website";


/* ── Lookup table row types ── */

/** A top-level service area (e.g. "Assessment", "Teaching") */
export interface ServiceArea {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
}

/** A service within a service area (e.g. "Moodle" under "Teaching") */
export interface Service {
  id: string;
  slug: string;
  label: string;
  service_area_id: string | null;
  description: string | null;
  created_at: string;
}

/** A technical service within a service (e.g. "Turnitin Originality" under "Turnitin") */
export interface TechnicalService {
  id: string;
  slug: string;
  label: string;
  service_id: string | null;
  description: string | null;
  created_at: string;
}

/** Audience with optional parent for hierarchy (e.g. "Academic Staff" under "Staff") */
export interface Audience {
  id: string;
  slug: string;
  label: string;
  parent_id: string | null;
  description: string | null;
  created_at: string;
}

/** A task that guidance helps users perform */
export interface Task {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
}

/** A topic tag for cross-cutting concerns */
export interface Topic {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
}

/** An organisational owner (team/unit) */
export interface Owner {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
}

/** A hosting location/platform for the guidance document with hierarchical structure */
export interface Location {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
  // Hierarchical structure fields
  parent_id: string | null;
  location_type: LocationType;
  root_url: string | null;
  search_keywords: string[] | null;
  location_access: AccessLevel | null;
  location_owner_id: string | null;
  // Campus availability - array of campus identifiers
  campus_availability: string[]; // uk, malaysia, china
}

/* ── Core entity ── */

/** A single guidance item — the central node of the graph */
export interface GuidanceItem {
  id: string;
  title: string;
  url: string;
  summary: string;
  doc_type: DocType;
  status: ItemStatus;
  access: AccessLevel;
  campus_scope: CampusScope;
  last_reviewed: string | null;
  review_cycle_months: number | null;
  notes_internal: string | null;
  is_archived: boolean;
  tags: string[];
  parent_id: string | null; // Parent guidance item for collection relationships
  collection_title: string | null; // Title for collection parent items
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/** Default topic mapping for a task (used by TaskTopicSelector) */
export interface TaskDefaultTopic {
  task_id: string;
  topic_id: string;
}

/* ── Relationship (join) table types ── */

/** GuidanceItem → Service (ABOUT_SERVICE) */
export interface GuidanceService {
  id: string;
  guidance_item_id: string;
  service_id: string;
  created_at: string;
}

/** GuidanceItem → Task (GUIDANCE_FOR) */
export interface GuidanceTask {
  id: string;
  guidance_item_id: string;
  task_id: string;
  created_at: string;
}

/** GuidanceItem → Topic (HAS_TOPIC) */
export interface GuidanceTopic {
  id: string;
  guidance_item_id: string;
  topic_id: string;
  created_at: string;
}

/** GuidanceItem → Audience (FOR_AUDIENCE) */
export interface GuidanceAudience {
  id: string;
  guidance_item_id: string;
  audience_id: string;
  created_at: string;
}

/** GuidanceItem → Owner (OWNED_BY — strategic owner) */
export interface GuidanceOwner {
  id: string;
  guidance_item_id: string;
  owner_id: string;
  created_at: string;
}

/** GuidanceItem → Owner (MAINTAINED_BY — day-to-day updater) */
export interface GuidanceMaintainer {
  id: string;
  guidance_item_id: string;
  owner_id: string;
  created_at: string;
}

/** GuidanceItem → Location (HOSTED_AT) */
export interface GuidanceLocation {
  id: string;
  guidance_item_id: string;
  location_id: string;
  created_at: string;
}

/** GuidanceItem ↔ GuidanceItem (self-referencing link) */
export interface GuidanceLink {
  id: string;
  source_id: string;
  target_id: string;
  link_type: LinkType;
  created_at: string;
}

/** GuidanceItem → TechnicalService */
export interface GuidanceTechnicalService {
  id: string;
  guidance_item_id: string;
  technical_service_id: string;
  created_at: string;
}

/* ── Auth ── */

/** Row in user_roles table */
export interface UserRoleRow {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

/* ── Supabase database type map ── */

/**
 * Helper: build a full table definition from a Row type.
 *
 * Insert allows partial rows (DB defaults fill the rest).
 * Update is always partial.
 * Relationships left empty — not needed for basic query typing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableDef<R extends Record<string, any>> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: [];
};

/**
 * Top-level type representing the full database schema.
 * Used by the Supabase client generic for type-safe queries.
 *
 * When the schema changes, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */
export interface Database {
  public: {
    Tables: {
      service_areas: TableDef<ServiceArea>;
      services: TableDef<Service>;
      technical_services: TableDef<TechnicalService>;
      audiences: TableDef<Audience>;
      tasks: TableDef<Task>;
      topics: TableDef<Topic>;
      owners: TableDef<Owner>;
      locations: TableDef<Location>;
      guidance_items: TableDef<GuidanceItem>;
      guidance_services: TableDef<GuidanceService>;
      guidance_tasks: TableDef<GuidanceTask>;
      guidance_topics: TableDef<GuidanceTopic>;
      guidance_audiences: TableDef<GuidanceAudience>;
      guidance_owners: TableDef<GuidanceOwner>;
      guidance_maintainers: TableDef<GuidanceMaintainer>;
      guidance_locations: TableDef<GuidanceLocation>;
      guidance_links: TableDef<GuidanceLink>;
      guidance_technical_services: TableDef<GuidanceTechnicalService>;
      user_roles: TableDef<UserRoleRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
