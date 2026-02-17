-- Migration 00003: Create the core guidance_items table.
-- This is the central entity in the graph — every relationship radiates from here.

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

-- Trigger: auto-update updated_at timestamp on every row change
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
