-- Migration 00002: Create lookup/vocabulary tables.
-- These tables store controlled vocabularies that guidance items reference
-- via join tables (created in 00004). Each has a unique slug for URL-friendly IDs.

-- Service areas: top-level organisational domains
CREATE TABLE service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Services: specific systems/tools, each belonging to a service area
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  service_area_id uuid REFERENCES service_areas(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Audiences: hierarchical via optional parent_id self-reference
CREATE TABLE audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  parent_id uuid REFERENCES audiences(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tasks: actions that guidance helps users perform
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Topics: cross-cutting thematic tags
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Owners: organisational teams/units responsible for guidance
CREATE TABLE owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Locations: hosting platforms where guidance documents live
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
