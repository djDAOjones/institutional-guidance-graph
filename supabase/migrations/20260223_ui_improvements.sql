-- Migration: UI improvements - intended status, remove service_manual, simplify access
-- Date: 2026-02-23

-- Add 'intended' status as the first option
ALTER TYPE item_status ADD VALUE 'intended' BEFORE 'draft';

-- Remove service_manual from doc_type (back to pure Diátaxis framework)
-- Note: Cannot directly remove enum values in PostgreSQL, so we'll handle this in application logic

-- Update access_level to be simpler (public/staff/restricted -> public/private)
-- We'll map 'staff' and 'restricted' to 'private' in application logic
-- Keep the enum for backwards compatibility but use only 'public' and 'staff' (as private)

-- Add parent_id to guidance_items for collection relationships
ALTER TABLE guidance_items ADD COLUMN parent_id uuid REFERENCES guidance_items(id);
CREATE INDEX idx_guidance_items_parent ON guidance_items(parent_id);

-- Add collection_title for parent items that represent collections
ALTER TABLE guidance_items ADD COLUMN collection_title text;

COMMENT ON COLUMN guidance_items.parent_id IS 'Parent guidance item for collection relationships (HAS_PART/IS_PART_OF)';
COMMENT ON COLUMN guidance_items.collection_title IS 'Title for collection parent items (optional, defaults to title)';
