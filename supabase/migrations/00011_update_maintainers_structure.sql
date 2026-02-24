-- Update maintainer structure based on user requirements
-- Since maintainers reference the owners table, we need to add specific maintainer entries
-- and clean up relationships that reference removed owners

-- Add specific maintainer-focused entries to owners table
INSERT INTO owners (slug, label, description) VALUES
  ('faculty_school_support', 'Faculty and School Support', 'Faculty and School Support services'),
  ('learning_content_team', 'Learning Content Team', 'Learning Content Team (formerly Digital Education Service - Learning Content Team)')
ON CONFLICT (slug) DO NOTHING;

-- Remove relationships to owners that are being removed as maintainers
-- This will clean up guidance_maintainers table for owners that should no longer be maintainers
DELETE FROM guidance_maintainers WHERE owner_id IN (
  SELECT id FROM owners WHERE slug IN (
    'academic_services',
    'teaching_learning', -- Centre for Teaching and Learning
    'cloud_infrastructure', 
    'communications',
    'cyber_security',
    'digital_education_service',
    'estates',
    'hr', -- Human Resources
    'it_operations',
    'it_service_desk_team',
    'legal', -- Legal Services
    'planning', -- Planning and Performance 
    'quality_assurance', -- Quality and Standards
    'registry',
    'research_innovation', -- Research and Innovation
    'service_management',
    'student_services'
  )
);

-- Update any existing maintainer relationships to use the new maintainer entries
-- Digital Education Service → Faculty and School Support
UPDATE guidance_maintainers 
SET owner_id = (SELECT id FROM owners WHERE slug = 'faculty_school_support')
WHERE owner_id = (SELECT id FROM owners WHERE slug = 'digital_education_service');

-- Digital Education Service - Learning Content Team → Learning Content Team  
UPDATE guidance_maintainers 
SET owner_id = (SELECT id FROM owners WHERE slug = 'learning_content_team')
WHERE owner_id = (SELECT id FROM owners WHERE slug = 'des_learning_content_team');
