-- Migration 00004: Create join/relationship tables.
-- These implement the graph edges between guidance_items and lookup entities.
-- Each table uses a composite UNIQUE constraint to prevent duplicate links.

-- GuidanceItem → Service (ABOUT_SERVICE)
CREATE TABLE guidance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, service_id)
);

-- GuidanceItem → Task (GUIDANCE_FOR)
CREATE TABLE guidance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, task_id)
);

-- GuidanceItem → Topic (HAS_TOPIC)
CREATE TABLE guidance_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, topic_id)
);

-- GuidanceItem → Audience (FOR_AUDIENCE)
CREATE TABLE guidance_audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  audience_id uuid NOT NULL REFERENCES audiences(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, audience_id)
);

-- GuidanceItem → Owner (OWNED_BY — strategic owner)
CREATE TABLE guidance_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, owner_id)
);

-- GuidanceItem → Owner (MAINTAINED_BY — day-to-day updater)
CREATE TABLE guidance_maintainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, owner_id)
);

-- GuidanceItem → Location (HOSTED_AT)
CREATE TABLE guidance_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guidance_item_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guidance_item_id, location_id)
);

-- GuidanceItem ↔ GuidanceItem (self-referencing links)
CREATE TABLE guidance_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES guidance_items(id) ON DELETE CASCADE,
  link_type link_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_id, target_id, link_type),
  CHECK (source_id != target_id)
);
