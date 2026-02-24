-- Migration: Hierarchical locations structure
-- Date: 2026-02-23

-- Create location_type enum
CREATE TYPE location_type AS ENUM (
  'sharepoint_site',
  'xerte_collection',
  'atlassian_space',
  'website_area',
  'external_website', 
  'website_subdomain',
  'faculty_website'
);

-- Update locations table with hierarchical structure
ALTER TABLE locations 
  ADD COLUMN parent_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  ADD COLUMN location_type location_type NOT NULL DEFAULT 'website_area'::location_type,
  ADD COLUMN root_url TEXT,
  ADD COLUMN search_keywords TEXT[],
  ADD COLUMN location_access access_level,
  ADD COLUMN location_owner_id UUID REFERENCES owners(id) ON DELETE SET NULL;

-- Add granularity field to guidance_items 
ALTER TABLE guidance_items
  ADD COLUMN granularity TEXT CHECK (granularity IN ('specific', 'comprehensive', 'overview'));

-- Add indices for efficient querying
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_owner ON locations(location_owner_id);

-- Add a technical services staff audience entry
INSERT INTO audiences (slug, label, description)
VALUES ('technical_services_staff', 'Technical Services Staff', 'Laboratory technicians and technical support staff');

-- Skip RLS policy creation since they already exist

-- Insert initial hierarchical location data
INSERT INTO locations (slug, label, description, location_type, root_url) VALUES
-- SharePoint sites
('video_teaching_learning', 'Video in Teaching and Learning', 'SharePoint site for video pedagogy resources', 'sharepoint_site', 'https://uniofnottm.sharepoint.com/sites/VideoTeachingLearning'),
('brand_resources', 'Brand Resources', 'University brand guidelines and resources', 'sharepoint_site', 'https://uniofnottm.sharepoint.com/sites/BrandResources'),
('uon_des', 'UoN Digital Education Service', 'Digital Education Service SharePoint site', 'sharepoint_site', 'https://uniofnottm.sharepoint.com/sites/DigitalEducation'),

-- Xerte collections
('media_guides', 'Media Guides', 'Xerte collection for media production guides', 'xerte_collection', 'https://xerte.nottingham.ac.uk/mediaGuides'),
('echo_help', 'Echo Help', 'Xerte collection for Echo360 help', 'xerte_collection', 'https://xerte.nottingham.ac.uk/echoHelp'),

-- Atlassian spaces
('moodle_help_students', 'Moodle Help - Students', 'Atlassian space for student Moodle help', 'atlassian_space', 'https://nottingham.atlassian.net/wiki/spaces/MHS'),
('moodle_help_staff', 'Moodle Help - Staff', 'Atlassian space for staff Moodle help', 'atlassian_space', 'https://nottingham.atlassian.net/wiki/spaces/MHF'),
('des_blog', 'DES Blog', 'Digital Education Service blog', 'atlassian_space', 'https://nottingham.atlassian.net/wiki/spaces/DESBlog'),

-- Website areas
('dts_website', 'DTS', 'Digital and Technology Services website', 'website_area', 'https://www.nottingham.ac.uk/dts'),
('des_website', 'DES', 'Digital Education Service website', 'website_area', 'https://www.nottingham.ac.uk/des'),
('external_relations', 'External Relations', 'External Relations website section', 'website_area', 'https://www.nottingham.ac.uk/externalrelations'),
('xerte_help_website', 'Xerte Help', 'Xerte help website', 'website_area', 'https://www.nottingham.ac.uk/xerte'),
('quality_manual', 'Quality Manual', 'University Quality Manual', 'website_area', 'https://www.nottingham.ac.uk/qualitymanual'),
('student_services', 'Student Services', 'Student Services website', 'website_area', 'https://www.nottingham.ac.uk/studentservices'),
('libraries', 'Libraries', 'University Libraries website', 'website_area', 'https://www.nottingham.ac.uk/libraries'),
('registrar', 'Registrar', 'Registrar''s Office website', 'website_area', 'https://www.nottingham.ac.uk/registrar'),
('students_union', 'Student''s Union', 'University Student''s Union website', 'website_area', 'https://www.su.nottingham.ac.uk'),

-- Faculty websites
('faculty_arts', 'Faculty of Arts', 'Faculty of Arts website', 'faculty_website', 'https://www.nottingham.ac.uk/arts'),
('faculty_mhs', 'Faculty of Medicine and Health Sciences', 'Faculty of Medicine and Health Sciences website', 'faculty_website', 'https://www.nottingham.ac.uk/mhs'),
('faculty_engineering', 'Faculty of Engineering', 'Faculty of Engineering website', 'faculty_website', 'https://www.nottingham.ac.uk/engineering'),
('faculty_socsci', 'Faculty of Social Sciences', 'Faculty of Social Sciences website', 'faculty_website', 'https://www.nottingham.ac.uk/socialsciences'),
('faculty_science', 'Faculty of Science', 'Faculty of Science website', 'faculty_website', 'https://www.nottingham.ac.uk/science'),

-- Website subdomains
('student_enquiries', 'Student Enquiries FAQs', 'Student Enquiries FAQ subdomain', 'website_subdomain', 'https://studentenquiries.nottingham.ac.uk'),

-- External websites
('microsoft_help', 'Microsoft Help', 'Microsoft documentation and help', 'external_website', 'https://support.microsoft.com'),
('brickfield_help', 'Brickfield Help', 'Brickfield accessibility tool help', 'external_website', 'https://www.brickfield.ie/support');
