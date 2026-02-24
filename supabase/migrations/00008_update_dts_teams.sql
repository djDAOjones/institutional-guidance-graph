-- Update DTS team names to reflect new organizational structure
-- This migration updates existing DTS entries to align with the current structure

-- Update DTS Learning Technology → Digital Education Service
UPDATE owners 
SET 
  slug = 'digital_education_service',
  label = 'Digital Education Service',
  description = 'Digital Education Service (formerly Learning Technology team)'
WHERE slug = 'dts_learning_technology';

-- Update DTS Media Production → Digital Education Service - Learning Content Team  
UPDATE owners 
SET 
  slug = 'des_learning_content_team',
  label = 'Digital Education Service - Learning Content Team',
  description = 'Digital Education Service — Learning Content Team (formerly Media Production team)'
WHERE slug = 'dts_media_production';

-- Update DTS Service Desk → IT Service Desk team and Smart Bar
UPDATE owners 
SET 
  slug = 'it_service_desk_team',
  label = 'IT Service Desk team and Smart Bar',
  description = 'Digital Technology Services — IT Service Desk team and Smart Bar'
WHERE slug = 'dts_service_desk';

-- Update DTS Infrastructure → Cloud Infrastructure  
UPDATE owners 
SET 
  slug = 'cloud_infrastructure',
  label = 'Cloud Infrastructure',
  description = 'Digital Technology Services — Cloud Infrastructure team'
WHERE slug = 'dts_infrastructure';

-- Add additional DTS teams from the new structure that might be useful
INSERT INTO owners (slug, label, description) VALUES
  ('cyber_security', 'Cyber Security', 'Digital Technology Services — Cyber Security team'),
  ('application_support', 'Application Support', 'Digital Technology Services — Application Support team'),
  ('it_operations', 'IT Operations', 'Digital Technology Services — IT Operations team'),
  ('digital_campus_services', 'Digital Campus Services', 'Digital Technology Services — Digital Campus Services team'),
  ('customer_service', 'Customer Service', 'Digital Technology Services — Customer Service team'),
  ('service_management', 'Service Management', 'Digital Technology Services — Service Management team')
ON CONFLICT (slug) DO NOTHING;
