-- Migration 00007: Performance indexes for common query patterns.
-- These speed up filtered reads, join traversals, and reporting queries.
-- Each index is named with a consistent convention: idx_<table>_<column>.

-- guidance_items: filter by status, campus, archived, doc_type, review date
CREATE INDEX idx_guidance_items_status ON guidance_items(status);
CREATE INDEX idx_guidance_items_campus ON guidance_items(campus_scope);
CREATE INDEX idx_guidance_items_archived ON guidance_items(is_archived);
CREATE INDEX idx_guidance_items_doc_type ON guidance_items(doc_type);
CREATE INDEX idx_guidance_items_last_reviewed ON guidance_items(last_reviewed);

-- Lookup FK indexes for parent relationships
CREATE INDEX idx_services_area ON services(service_area_id);
CREATE INDEX idx_audiences_parent ON audiences(parent_id);

-- Join table indexes: guidance_item_id (for "get all links for item X")
CREATE INDEX idx_guidance_services_item ON guidance_services(guidance_item_id);
CREATE INDEX idx_guidance_services_service ON guidance_services(service_id);
CREATE INDEX idx_guidance_tasks_item ON guidance_tasks(guidance_item_id);
CREATE INDEX idx_guidance_topics_item ON guidance_topics(guidance_item_id);
CREATE INDEX idx_guidance_audiences_item ON guidance_audiences(guidance_item_id);
CREATE INDEX idx_guidance_owners_item ON guidance_owners(guidance_item_id);
CREATE INDEX idx_guidance_maintainers_item ON guidance_maintainers(guidance_item_id);
CREATE INDEX idx_guidance_locations_item ON guidance_locations(guidance_item_id);

-- Self-referencing links: both directions for bidirectional traversal
CREATE INDEX idx_guidance_links_source ON guidance_links(source_id);
CREATE INDEX idx_guidance_links_target ON guidance_links(target_id);
