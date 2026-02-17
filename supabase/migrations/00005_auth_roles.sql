-- Migration 00005: Create user_roles table for RBAC.
-- Maps Supabase Auth users to application roles (viewer/editor/admin).
-- RLS policies in 00006 use get_user_role() to check permissions.

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz DEFAULT now()
);
