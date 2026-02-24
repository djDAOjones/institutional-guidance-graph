-- Migration: Cleanup locations and services
-- Date: 2026-02-23

-- Update faculty_website and website_subdomain locations to be website_area
UPDATE locations 
SET location_type = 'website_area'::location_type 
WHERE location_type IN ('faculty_website'::location_type, 'website_subdomain'::location_type);

-- Add missing services to the services table
INSERT INTO services (slug, label, description, service_area_id)
SELECT 
  'moodle', 
  'Moodle', 
  'Virtual Learning Environment platform',
  (SELECT id FROM service_areas WHERE slug = 'teaching' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'moodle');

INSERT INTO services (slug, label, description, service_area_id)  
SELECT 
  'turnitin_originality', 
  'Turnitin Originality', 
  'Plagiarism detection and similarity checking service',
  (SELECT id FROM service_areas WHERE slug = 'assessment' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'turnitin_originality');

INSERT INTO services (slug, label, description, service_area_id)
SELECT 
  'turnitin_feedback_studio', 
  'Turnitin Feedback Studio', 
  'Online marking and feedback tools',
  (SELECT id FROM service_areas WHERE slug = 'assessment' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'turnitin_feedback_studio');
