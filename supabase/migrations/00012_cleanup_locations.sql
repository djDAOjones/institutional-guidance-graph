-- Migration: Cleanup locations — delete unwanted, fix types, SharePoint UK-only
-- Date: 2026-02-25

-- Step 1: Clean up any guidance_locations referencing locations we're about to delete
DELETE FROM guidance_locations WHERE location_id IN (
  SELECT id FROM locations WHERE slug NOT IN (
    'des_blog',
    'brand_resources',
    'video_teaching_learning',
    'brickfield_help',
    'microsoft_help',
    'faculty_arts',
    'faculty_mhs',
    'faculty_engineering',
    'faculty_socsci',
    'faculty_science',
    'libraries'
  )
);

-- Step 2: Delete all locations EXCEPT the ones we want to keep
DELETE FROM locations WHERE slug NOT IN (
  'des_blog',
  'brand_resources',
  'video_teaching_learning',
  'brickfield_help',
  'microsoft_help',
  'faculty_arts',
  'faculty_mhs',
  'faculty_engineering',
  'faculty_socsci',
  'faculty_science',
  'libraries'
);

-- Step 3: Make all SharePoint sites UK only
UPDATE locations 
SET campus_availability = '{uk}' 
WHERE location_type = 'sharepoint_site'::location_type;

-- Step 4: Verify type integrity — remove any mismatched locations
-- SharePoint URLs not in sharepoint_site category
DELETE FROM locations 
WHERE root_url LIKE '%sharepoint.com%' 
  AND location_type != 'sharepoint_site'::location_type;

-- Xerte URLs not in xerte_collection category
DELETE FROM locations 
WHERE root_url LIKE '%xerte.nottingham.ac.uk%' 
  AND location_type != 'xerte_collection'::location_type;

-- External URLs not in external_website category (non-nottingham domains)
DELETE FROM locations 
WHERE root_url IS NOT NULL
  AND root_url NOT LIKE '%nottingham%'
  AND location_type != 'external_website'::location_type;
