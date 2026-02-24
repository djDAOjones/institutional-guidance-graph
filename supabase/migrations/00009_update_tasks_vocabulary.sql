-- Update tasks vocabulary based on user requirements
-- This migration adds new tasks, removes outdated ones, and updates labels

-- Remove outdated tasks
DELETE FROM tasks WHERE slug IN ('manage_users', 'report', 'set_up');

-- Update existing task labels
UPDATE tasks SET 
  label = 'Student Feedback',
  description = 'Providing feedback to students on their work and progress'
WHERE slug = 'give_feedback';

UPDATE tasks SET 
  label = 'Assessment',
  description = 'Marking, grading, or assessing student work and assignments'
WHERE slug = 'mark_assess';

UPDATE tasks SET 
  label = 'Assignment Submission',
  description = 'Submitting assessments, coursework, or assignments'
WHERE slug = 'submit_work';

-- Add new tasks
INSERT INTO tasks (slug, label, description) VALUES
  ('digital_accessibility', 'Digital Accessibility', 'Making digital content and services accessible to all users'),
  ('productivity_tools', 'Productivity Tools', 'Using productivity and collaboration software effectively'),
  ('presentation_tools', 'Presentation Tools', 'Creating and delivering presentations using digital tools'),
  ('lecture_capture', 'Lecture Capture', 'Recording, managing, and sharing lecture content'),
  ('ai', 'AI', 'Using artificial intelligence tools and services in teaching and learning'),
  ('module_design', 'Module Design', 'Designing and structuring educational modules and courses')
ON CONFLICT (slug) DO NOTHING;
