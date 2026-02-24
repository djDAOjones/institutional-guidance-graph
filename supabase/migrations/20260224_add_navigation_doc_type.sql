-- Migration: Add Navigation document type
-- Date: 2026-02-24

-- Add 'navigation' to the doc_type enum
ALTER TYPE doc_type ADD VALUE 'navigation';

COMMENT ON TYPE doc_type IS 'Document types following Diátaxis framework plus Navigation for wayfinding content';
