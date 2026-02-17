-- Migration 00001: Create enum types for the Institutional Guidance Graph.
-- These enums enforce controlled vocabularies at the database level.
-- See Spec.md section 6 for the full data model.

-- Document types following the Diátaxis framework
CREATE TYPE doc_type AS ENUM ('tutorial', 'how_to', 'reference', 'explanation');

-- Guidance item lifecycle status
CREATE TYPE item_status AS ENUM ('draft', 'canonical', 'duplicate', 'obsolete');

-- Access level for guidance items
CREATE TYPE access_level AS ENUM ('public', 'staff', 'restricted');

-- Campus scope — which campus(es) this guidance applies to
CREATE TYPE campus_scope AS ENUM ('uk', 'malaysia', 'china', 'all');

-- User roles for RBAC via RLS policies
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin');

-- Self-referencing link types between guidance items
CREATE TYPE link_type AS ENUM ('duplicate_of', 'supersedes', 'related_to');
