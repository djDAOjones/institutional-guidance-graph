/**
 * Server actions for vocabulary (lookup table) CRUD operations.
 *
 * Provides add, edit, and delete for:
 * - Services, Tasks, Topics, Owners, Locations
 *
 * All mutations go through Supabase RLS.
 * Slug is auto-generated from label on create.
 *
 * @module lib/actions/vocabulary
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Allowed vocabulary table names — prevents SQL injection via table name */
const ALLOWED_TABLES = [
  "services",
  "tasks",
  "topics",
  "owners",
  "locations",
] as const;

type VocabTable = (typeof ALLOWED_TABLES)[number];

/** Generate a URL-safe slug from a label string */
function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
}

/** Validate that the table name is allowed */
function validateTable(table: string): asserts table is VocabTable {
  if (!ALLOWED_TABLES.includes(table as VocabTable)) {
    throw new Error(`Invalid vocabulary table: ${table}`);
  }
}

/**
 * Create a new vocabulary item in the specified table.
 *
 * @returns The newly created item with its generated ID
 */
export async function createVocabularyItem(
  table: string,
  data: {
    label: string;
    description?: string;
    service_area_id?: string;
    location_type?: string;
    root_url?: string;
    campus_availability?: string[];
  },
) {
  validateTable(table);
  const supabase = await createClient();

  const slug = slugify(data.label);

  // Build the insert payload based on table type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    slug,
    label: data.label,
    description: data.description || null,
  };

  // Table-specific fields
  if (table === "services" && data.service_area_id) {
    payload.service_area_id = data.service_area_id;
  }
  if (table === "locations") {
    payload.location_type = data.location_type || "website_area";
    payload.root_url = data.root_url || null;
    payload.campus_availability = data.campus_availability || ["uk", "malaysia", "china"];
  }

  const { data: item, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create ${table} item: ${error.message}`);
  }

  revalidatePath("/graph");
  revalidatePath("/guidance");
  return item;
}

/**
 * Update an existing vocabulary item.
 */
export async function updateVocabularyItem(
  table: string,
  id: string,
  data: {
    label: string;
    description?: string;
    service_area_id?: string;
    location_type?: string;
    root_url?: string;
    campus_availability?: string[];
  },
) {
  validateTable(table);
  const supabase = await createClient();

  // Build the update payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    label: data.label,
    description: data.description || null,
  };

  // Table-specific fields
  if (table === "services" && data.service_area_id !== undefined) {
    payload.service_area_id = data.service_area_id;
  }
  if (table === "locations") {
    if (data.location_type) payload.location_type = data.location_type;
    if (data.root_url !== undefined) payload.root_url = data.root_url || null;
    if (data.campus_availability) payload.campus_availability = data.campus_availability;
  }

  const { data: item, error } = await supabase
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update ${table} item: ${error.message}`);
  }

  revalidatePath("/graph");
  revalidatePath("/guidance");
  return item;
}

/**
 * Delete a vocabulary item. Cascades via FK constraints.
 */
export async function deleteVocabularyItem(table: string, id: string) {
  validateTable(table);
  const supabase = await createClient();

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete ${table} item: ${error.message}`);
  }

  revalidatePath("/graph");
  revalidatePath("/guidance");
}
