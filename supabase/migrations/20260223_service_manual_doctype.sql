-- Migration: Replace granularity with service_manual document type
-- Date: 2026-02-23

-- Add service_manual to the doc_type enum
ALTER TYPE doc_type ADD VALUE 'service_manual';

-- Drop the granularity column since it's now handled by doc_type
ALTER TABLE guidance_items DROP COLUMN granularity;
