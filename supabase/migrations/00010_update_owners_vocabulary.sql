-- Update owners vocabulary based on user requirements
-- This migration adds faculty owners, removes outdated ones, and updates labels

-- Remove outdated owners
DELETE FROM owners WHERE slug IN (
  'academic_services',
  'des_learning_content_team', -- Digital Education Service - Learning Content Team
  'planning',
  'quality_assurance'
);

-- Update existing owner labels
UPDATE owners SET 
  label = 'Educational Excellence',
  description = 'Educational Excellence (formerly Centre for Teaching and Learning)'
WHERE slug = 'teaching_learning';

UPDATE owners SET 
  label = 'External Relations',
  description = 'External Relations (formerly Communications)'
WHERE slug = 'communications';

-- Add new faculty and institutional owners
INSERT INTO owners (slug, label, description) VALUES
  ('faculty_of_art', 'Faculty of Art', 'Faculty of Art academic and administrative oversight'),
  ('faculty_of_engineering', 'Faculty of Engineering', 'Faculty of Engineering academic and administrative oversight'),
  ('faculty_of_medicine_health', 'Faculty of Medicine and Health Sciences', 'Faculty of Medicine and Health Sciences academic and administrative oversight'),
  ('faculty_of_science', 'Faculty of Science', 'Faculty of Science academic and administrative oversight'),
  ('faculty_of_social_sciences', 'Faculty of Social Sciences', 'Faculty of Social Sciences academic and administrative oversight'),
  ('libraries', 'Libraries', 'University Libraries and Learning Resources'),
  ('registrar', 'Registrar', 'Registrar academic records and student administration')
ON CONFLICT (slug) DO NOTHING;

-- Note: The 'library' entry already exists, but 'libraries' is being added as requested
-- The maintainer changes will be handled in the next migration since maintainers use the same owners table
