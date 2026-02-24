-- Migration: Add default topics to tasks
-- Date: 2026-02-23

-- Create task_default_topics join table
CREATE TABLE task_default_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, topic_id)
);

-- Add RLS policy
ALTER TABLE task_default_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read task_default_topics"
  ON task_default_topics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage task_default_topics"
  ON task_default_topics FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Add index for performance
CREATE INDEX idx_task_default_topics_task ON task_default_topics(task_id);
CREATE INDEX idx_task_default_topics_topic ON task_default_topics(topic_id);

-- Insert some sample default topics for common tasks
-- This helps reduce repetitive data entry as requested

-- First, let's see what tasks and topics we have
INSERT INTO task_default_topics (task_id, topic_id)
SELECT 
  t.id as task_id,
  tp.id as topic_id
FROM tasks t, topics tp
WHERE 
  -- Assessment tasks get assessment-related topics
  (t.slug LIKE '%assessment%' AND tp.slug LIKE '%assessment%') OR
  (t.slug LIKE '%grade%' AND tp.slug LIKE '%grade%') OR
  -- Teaching tasks get teaching-related topics  
  (t.slug LIKE '%teach%' AND tp.slug LIKE '%teach%') OR
  (t.slug LIKE '%lecture%' AND tp.slug LIKE '%lecture%') OR
  -- Media tasks get media-related topics
  (t.slug LIKE '%video%' AND tp.slug LIKE '%video%') OR
  (t.slug LIKE '%record%' AND tp.slug LIKE '%record%')
ON CONFLICT (task_id, topic_id) DO NOTHING;
