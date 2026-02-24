-- Migration: Add campus availability to locations
-- Date: 2026-02-24

-- Add campus_availability column to locations table
ALTER TABLE locations ADD COLUMN campus_availability text[] DEFAULT '{uk,malaysia,china}';

-- Add index for campus availability queries
CREATE INDEX idx_locations_campus_availability ON locations USING GIN (campus_availability);

-- Add constraint to ensure valid campus values
ALTER TABLE locations ADD CONSTRAINT check_valid_campus_availability 
CHECK (
  campus_availability <@ ARRAY['uk', 'malaysia', 'china'] 
  AND array_length(campus_availability, 1) > 0
);

-- Update existing locations with default campus availability
UPDATE locations SET campus_availability = '{uk,malaysia,china}' WHERE campus_availability IS NULL;

-- Make the column NOT NULL now that we have default values
ALTER TABLE locations ALTER COLUMN campus_availability SET NOT NULL;

COMMENT ON COLUMN locations.campus_availability IS 'Array of campus identifiers where this location is available (uk, malaysia, china)';
