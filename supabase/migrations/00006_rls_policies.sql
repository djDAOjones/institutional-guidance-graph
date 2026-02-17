-- Migration 00006: Row Level Security (RLS) policies.
-- Enforces role-based access control at the database level.
-- Roles: viewer (read-only), editor (read + write items/relationships), admin (full access).

-- Enable RLS on all tables
ALTER TABLE guidance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_maintainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Helper: get the current authenticated user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM user_roles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ═══════════════════════════════════════════════
-- guidance_items: all authenticated read, editors+ write
-- ═══════════════════════════════════════════════

CREATE POLICY "Anyone can read guidance items"
  ON guidance_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert guidance items"
  ON guidance_items FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));

CREATE POLICY "Editors can update guidance items"
  ON guidance_items FOR UPDATE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));


-- ═══════════════════════════════════════════════
-- Lookup tables: all authenticated read, admin-only write
-- ═══════════════════════════════════════════════

-- service_areas
CREATE POLICY "Anyone can read service_areas"
  ON service_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert service_areas"
  ON service_areas FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update service_areas"
  ON service_areas FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete service_areas"
  ON service_areas FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- services
CREATE POLICY "Anyone can read services"
  ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update services"
  ON services FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete services"
  ON services FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- audiences
CREATE POLICY "Anyone can read audiences"
  ON audiences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert audiences"
  ON audiences FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update audiences"
  ON audiences FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete audiences"
  ON audiences FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- tasks
CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete tasks"
  ON tasks FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- topics
CREATE POLICY "Anyone can read topics"
  ON topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert topics"
  ON topics FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update topics"
  ON topics FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete topics"
  ON topics FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- owners
CREATE POLICY "Anyone can read owners"
  ON owners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert owners"
  ON owners FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update owners"
  ON owners FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete owners"
  ON owners FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- locations
CREATE POLICY "Anyone can read locations"
  ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert locations"
  ON locations FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');
CREATE POLICY "Admins can update locations"
  ON locations FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');
CREATE POLICY "Admins can delete locations"
  ON locations FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');


-- ═══════════════════════════════════════════════
-- Relationship/join tables: all authenticated read, editors+ write
-- ═══════════════════════════════════════════════

-- guidance_services
CREATE POLICY "Anyone can read guidance_services"
  ON guidance_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_services"
  ON guidance_services FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_services"
  ON guidance_services FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_tasks
CREATE POLICY "Anyone can read guidance_tasks"
  ON guidance_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_tasks"
  ON guidance_tasks FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_tasks"
  ON guidance_tasks FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_topics
CREATE POLICY "Anyone can read guidance_topics"
  ON guidance_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_topics"
  ON guidance_topics FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_topics"
  ON guidance_topics FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_audiences
CREATE POLICY "Anyone can read guidance_audiences"
  ON guidance_audiences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_audiences"
  ON guidance_audiences FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_audiences"
  ON guidance_audiences FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_owners
CREATE POLICY "Anyone can read guidance_owners"
  ON guidance_owners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_owners"
  ON guidance_owners FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_owners"
  ON guidance_owners FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_maintainers
CREATE POLICY "Anyone can read guidance_maintainers"
  ON guidance_maintainers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_maintainers"
  ON guidance_maintainers FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_maintainers"
  ON guidance_maintainers FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_locations
CREATE POLICY "Anyone can read guidance_locations"
  ON guidance_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_locations"
  ON guidance_locations FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_locations"
  ON guidance_locations FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));

-- guidance_links
CREATE POLICY "Anyone can read guidance_links"
  ON guidance_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors can insert guidance_links"
  ON guidance_links FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('editor', 'admin'));
CREATE POLICY "Editors can delete guidance_links"
  ON guidance_links FOR DELETE TO authenticated
  USING (get_user_role() IN ('editor', 'admin'));


-- ═══════════════════════════════════════════════
-- user_roles: users can read own, admins can manage all
-- ═══════════════════════════════════════════════

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all roles"
  ON user_roles FOR SELECT TO authenticated
  USING (get_user_role() = 'admin');

CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');

CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');
