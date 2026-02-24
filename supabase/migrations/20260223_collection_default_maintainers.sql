-- Migration: Add default maintainers to collections
-- Date: 2026-02-23

-- Create collection_default_maintainers join table
CREATE TABLE collection_default_maintainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, owner_id)
);

-- Add RLS policy
ALTER TABLE collection_default_maintainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read collection_default_maintainers"
  ON collection_default_maintainers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage collection_default_maintainers"
  ON collection_default_maintainers FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Add indexes for performance
CREATE INDEX idx_collection_default_maintainers_collection ON collection_default_maintainers(collection_id);
CREATE INDEX idx_collection_default_maintainers_owner ON collection_default_maintainers(owner_id);

-- Note: Business logic constraint (only items with collection_title can have default maintainers) 
-- will be enforced in application layer since PostgreSQL doesn't support subqueries in CHECK constraints

COMMENT ON TABLE collection_default_maintainers IS 'Default maintainers for collection parent items - reduces repetitive data entry. Only collections with collection_title should have entries here (enforced in app logic).';
