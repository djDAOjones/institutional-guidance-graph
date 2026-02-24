-- Seed data for the Institutional Guidance Graph.
-- Run this AFTER all migrations (00001–00007) have been applied.
-- This populates the controlled vocabularies defined in Spec.md section 6.

-- ═══════════════════════════════════════════════
-- Service Areas (9 top-level domains)
-- ═══════════════════════════════════════════════
INSERT INTO service_areas (slug, label, description) VALUES
  ('assessment', 'Assessment', 'Assessment design, submission, marking, and feedback'),
  ('teaching', 'Teaching', 'Teaching delivery, course design, and learning support'),
  ('media_production', 'Media Production', 'Video, audio, and multimedia content creation'),
  ('learning_spaces', 'Learning Spaces', 'Physical and virtual learning environments'),
  ('academic_integrity', 'Academic Integrity', 'Plagiarism, misconduct, and academic standards'),
  ('student_support', 'Student Support', 'Wellbeing, accessibility, and pastoral care'),
  ('research', 'Research', 'Research data, ethics, and outputs'),
  ('administration', 'Administration', 'Enrolment, records, and institutional processes'),
  ('it_services', 'IT Services', 'Infrastructure, accounts, and technical support');

-- ═══════════════════════════════════════════════
-- Services (linked to service areas)
-- ═══════════════════════════════════════════════
INSERT INTO services (slug, label, service_area_id, description) VALUES
  ('moodle', 'Moodle', (SELECT id FROM service_areas WHERE slug = 'teaching'), 'Virtual learning environment'),
  ('turnitin', 'Turnitin', (SELECT id FROM service_areas WHERE slug = 'assessment'), 'Plagiarism detection and online submission'),
  ('panopto', 'Panopto', (SELECT id FROM service_areas WHERE slug = 'media_production'), 'Lecture capture and video management'),
  ('echo360', 'Echo360', (SELECT id FROM service_areas WHERE slug = 'media_production'), 'Lecture capture system'),
  ('microsoft_teams', 'Microsoft Teams', (SELECT id FROM service_areas WHERE slug = 'teaching'), 'Collaboration and online meetings'),
  ('sharepoint', 'SharePoint', (SELECT id FROM service_areas WHERE slug = 'administration'), 'Document management and intranet'),
  ('trent', 'TRENT', (SELECT id FROM service_areas WHERE slug = 'assessment'), 'Coursework management system'),
  ('rogo', 'Rogo', (SELECT id FROM service_areas WHERE slug = 'assessment'), 'Online assessment platform'),
  ('blue', 'Blue', (SELECT id FROM service_areas WHERE slug = 'teaching'), 'Module evaluation system'),
  ('mahara', 'Mahara', (SELECT id FROM service_areas WHERE slug = 'teaching'), 'ePortfolio platform'),
  ('campus_solutions', 'Campus Solutions', (SELECT id FROM service_areas WHERE slug = 'administration'), 'Student records system'),
  ('nottingham_docs', 'Nottingham Docs', (SELECT id FROM service_areas WHERE slug = 'administration'), 'Institutional documentation portal');

-- ═══════════════════════════════════════════════
-- Audiences (hierarchical — top-level then sub-categories)
-- ═══════════════════════════════════════════════

-- Top-level audiences
INSERT INTO audiences (slug, label, description) VALUES
  ('staff', 'Staff', 'All university staff'),
  ('students', 'Students', 'All enrolled students'),
  ('researchers', 'Researchers', 'Research-active staff and postgraduate researchers'),
  ('applicants', 'Applicants', 'Prospective students and applicants'),
  ('public', 'Public', 'External visitors and general public'),
  ('partners', 'Partners', 'External partner organisations');

-- Sub-categories under Staff
INSERT INTO audiences (slug, label, parent_id, description) VALUES
  ('academic_staff', 'Academic Staff', (SELECT id FROM audiences WHERE slug = 'staff'), 'Teaching and research academics'),
  ('professional_services', 'Professional Services', (SELECT id FROM audiences WHERE slug = 'staff'), 'Administrative and support staff'),
  ('other_staff', 'Other Staff', (SELECT id FROM audiences WHERE slug = 'staff'), 'Hourly-paid, casual, and visiting staff');

-- Sub-categories under Students
INSERT INTO audiences (slug, label, parent_id, description) VALUES
  ('undergrad', 'Undergraduate Students', (SELECT id FROM audiences WHERE slug = 'students'), 'Students on undergraduate programmes'),
  ('postgrad', 'Postgraduate Students', (SELECT id FROM audiences WHERE slug = 'students'), 'Students on taught or research postgraduate programmes'),
  ('student_teachers', 'Student Teachers', (SELECT id FROM audiences WHERE slug = 'students'), 'Students in teacher training programmes');

-- ═══════════════════════════════════════════════
-- Owners (organisational teams)
-- ═══════════════════════════════════════════════
INSERT INTO owners (slug, label, description) VALUES
  -- Digital Education Service (formerly Learning Technology)
  ('digital_education_service', 'Digital Education Service', 'Digital Education Service (formerly Learning Technology team)'),
  ('des_learning_content_team', 'Digital Education Service - Learning Content Team', 'Digital Education Service — Learning Content Team (formerly Media Production team)'),
  
  -- Digital Technology Services teams
  ('it_service_desk_team', 'IT Service Desk team and Smart Bar', 'Digital Technology Services — IT Service Desk team and Smart Bar'),
  ('cloud_infrastructure', 'Cloud Infrastructure', 'Digital Technology Services — Cloud Infrastructure team'),
  ('cyber_security', 'Cyber Security', 'Digital Technology Services — Cyber Security team'),
  ('application_support', 'Application Support', 'Digital Technology Services — Application Support team'),
  ('it_operations', 'IT Operations', 'Digital Technology Services — IT Operations team'),
  ('digital_campus_services', 'Digital Campus Services', 'Digital Technology Services — Digital Campus Services team'),
  ('customer_service', 'Customer Service', 'Digital Technology Services — Customer Service team'),
  ('service_management', 'Service Management', 'Digital Technology Services — Service Management team'),
  
  -- Faculties
  ('faculty_of_art', 'Faculty of Art', 'Faculty of Art academic and administrative oversight'),
  ('faculty_of_engineering', 'Faculty of Engineering', 'Faculty of Engineering academic and administrative oversight'),
  ('faculty_of_medicine_health', 'Faculty of Medicine and Health Sciences', 'Faculty of Medicine and Health Sciences academic and administrative oversight'),
  ('faculty_of_science', 'Faculty of Science', 'Faculty of Science academic and administrative oversight'),
  ('faculty_of_social_sciences', 'Faculty of Social Sciences', 'Faculty of Social Sciences academic and administrative oversight'),
  
  -- Central services
  ('educational_excellence', 'Educational Excellence', 'Educational Excellence (formerly Centre for Teaching and Learning)'),
  ('libraries', 'Libraries', 'University Libraries and Learning Resources'),
  ('registrar', 'Registrar', 'Registrar academic records and student administration'),
  ('library', 'Library', 'University Libraries and Learning Resources'),
  ('student_services', 'Student Services', 'Student wellbeing and support services'),
  ('registry', 'Registry', 'Student records and enrolment'),
  ('hr', 'Human Resources', 'Staff HR services'),
  ('research_innovation', 'Research and Innovation', 'Research support services'),
  ('estates', 'Estates', 'Buildings and learning spaces'),
  ('planning', 'Planning and Performance', 'Institutional planning and analytics'),
  ('external_relations', 'External Relations', 'External Relations (formerly Communications)'),
  ('legal', 'Legal Services', 'Legal and compliance'),
  
  -- Maintainer-specific entries
  ('faculty_school_support', 'Faculty and School Support', 'Faculty and School Support services'),
  ('learning_content_team', 'Learning Content Team', 'Learning Content Team (formerly Digital Education Service - Learning Content Team)');

-- ═══════════════════════════════════════════════
-- Locations (10 hosting platforms)
-- ═══════════════════════════════════════════════
INSERT INTO locations (slug, label, description) VALUES
  ('workspace', 'Workspace (Confluence/Wiki)', 'Internal wiki or knowledge base'),
  ('sharepoint_site', 'SharePoint Site', 'SharePoint Online site or page'),
  ('university_website', 'University Website', 'Public-facing university website'),
  ('moodle_site', 'Moodle Site', 'Content hosted within Moodle'),
  ('qm_handbook', 'QM Handbook', 'Quality Manual / academic handbook'),
  ('pdf_document', 'PDF Document', 'Standalone PDF document'),
  ('teams_channel', 'Teams Channel', 'Microsoft Teams channel or wiki'),
  ('external_site', 'External Site', 'Third-party or vendor documentation'),
  ('github_repo', 'GitHub Repository', 'Code repository or technical docs'),
  ('video_platform', 'Video Platform', 'Panopto, YouTube, or similar');

-- ═══════════════════════════════════════════════
-- Topics (initial cross-cutting themes)
-- ═══════════════════════════════════════════════
INSERT INTO topics (slug, label, description) VALUES
  ('accessibility', 'Accessibility', 'Making content and services accessible to all users'),
  ('data_protection', 'Data Protection', 'GDPR, data handling, and privacy'),
  ('copyright', 'Copyright', 'Intellectual property and licensing'),
  ('safeguarding', 'Safeguarding', 'Duty of care and safeguarding responsibilities'),
  ('equality_diversity', 'Equality, Diversity & Inclusion', 'EDI policies and inclusive practice'),
  ('sustainability', 'Sustainability', 'Environmental and sustainable practices'),
  ('digital_skills', 'Digital Skills', 'Staff and student digital capability'),
  ('ai_tools', 'AI Tools', 'Use of artificial intelligence in teaching and assessment');

-- ═══════════════════════════════════════════════
-- Tasks (updated vocabulary based on user requirements)
-- ═══════════════════════════════════════════════
INSERT INTO tasks (slug, label, description) VALUES
  ('create_content', 'Create Content', 'Authoring new learning or guidance content'),
  ('assignment_submission', 'Assignment Submission', 'Submitting assessments, coursework, or assignments'),
  ('assessment', 'Assessment', 'Marking, grading, or assessing student work and assignments'),
  ('student_feedback', 'Student Feedback', 'Providing feedback to students on their work and progress'),
  ('troubleshoot', 'Troubleshoot', 'Resolving common issues and errors'),
  ('digital_accessibility', 'Digital Accessibility', 'Making digital content and services accessible to all users'),
  ('productivity_tools', 'Productivity Tools', 'Using productivity and collaboration software effectively'),
  ('presentation_tools', 'Presentation Tools', 'Creating and delivering presentations using digital tools'),
  ('lecture_capture', 'Lecture Capture', 'Recording, managing, and sharing lecture content'),
  ('ai', 'AI', 'Using artificial intelligence tools and services in teaching and learning'),
  ('module_design', 'Module Design', 'Designing and structuring educational modules and courses');
