/**
 * Server actions for guidance item CRUD operations.
 *
 * All mutations go through Supabase RLS — only editors/admins can write.
 * Revalidates the /graph page after mutations for instant UI updates.
 *
 * @module lib/actions/guidance
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DocType, ItemStatus, AccessLevel, CampusScope } from "@/types/database";

/** Shape of the form data for creating/updating a guidance item */
interface GuidanceFormData {
  title: string;
  url: string;
  summary: string;
  doc_type: DocType;
  status: ItemStatus;
  access: AccessLevel;
  campus_scope: CampusScope;
  last_reviewed: string | null;
  review_cycle_months: number | null;
  notes_internal: string | null;
  tags: string[];
  parent_id: string | null;
  collection_title: string | null;
  // Relationship IDs
  service_ids: string[];
  technical_service_ids: string[];
  audience_ids: string[];
  task_ids: string[];
  topic_ids: string[];
  owner_ids: string[];
  maintainer_ids: string[];
  location_ids: string[];
}

/**
 * Parse raw FormData into a typed GuidanceFormData object.
 */
function parseFormData(formData: FormData): GuidanceFormData {
  // Access checkbox: checked = "public", unchecked = no value → default "staff"
  const accessValue = formData.get("access");
  const access: AccessLevel = accessValue === "public" ? "public" : "staff";

  return {
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    summary: formData.get("summary") as string,
    doc_type: formData.get("doc_type") as DocType,
    status: formData.get("status") as ItemStatus,
    access,
    campus_scope: formData.get("campus_scope") as CampusScope,
    last_reviewed: (formData.get("last_reviewed") as string) || null,
    review_cycle_months: formData.get("review_cycle_months")
      ? Number(formData.get("review_cycle_months"))
      : null,
    notes_internal: (formData.get("notes_internal") as string) || null,
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
    parent_id: (formData.get("parent_id") as string) || null,
    collection_title: (formData.get("collection_title") as string) || null,
    service_ids: formData.getAll("service_ids") as string[],
    technical_service_ids: formData.getAll("technical_service_ids") as string[],
    audience_ids: formData.getAll("audience_ids") as string[],
    task_ids: formData.getAll("task_ids") as string[],
    topic_ids: formData.getAll("topic_ids") as string[],
    owner_ids: formData.getAll("owner_ids") as string[],
    maintainer_ids: formData.getAll("maintainer_ids") as string[],
    location_ids: formData.getAll("location_ids") as string[],
  };
}

/**
 * Upsert rows into a join table for a given guidance item.
 * Deletes existing rows first, then inserts new ones.
 */
async function syncJoinTable(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tableName: string,
  guidanceItemId: string,
  foreignKeyColumn: string,
  ids: string[],
) {
  // Delete existing relationships
  await supabase
    .from(tableName)
    .delete()
    .eq("guidance_item_id", guidanceItemId);

  // Insert new relationships
  if (ids.length > 0) {
    const rows = ids.map((id) => ({
      guidance_item_id: guidanceItemId,
      [foreignKeyColumn]: id,
    }));
    await supabase.from(tableName).insert(rows);
  }
}

/**
 * Create a new guidance item with all relationships.
 */
export async function createGuidanceItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const data = parseFormData(formData);

  // Insert the guidance item
  const { data: item, error } = await supabase
    .from("guidance_items")
    .insert({
      title: data.title,
      url: data.url,
      summary: data.summary,
      doc_type: data.doc_type,
      status: data.status,
      access: data.access,
      campus_scope: data.campus_scope,
      last_reviewed: data.last_reviewed,
      review_cycle_months: data.review_cycle_months,
      notes_internal: data.notes_internal,
      tags: data.tags,
      parent_id: data.parent_id,
      collection_title: data.collection_title,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create guidance item: ${error.message}`);
  }

  // Sync all join tables
  await Promise.all([
    syncJoinTable(supabase, "guidance_services", item.id, "service_id", data.service_ids),
    syncJoinTable(supabase, "guidance_technical_services", item.id, "technical_service_id", data.technical_service_ids),
    syncJoinTable(supabase, "guidance_audiences", item.id, "audience_id", data.audience_ids),
    syncJoinTable(supabase, "guidance_tasks", item.id, "task_id", data.task_ids),
    syncJoinTable(supabase, "guidance_topics", item.id, "topic_id", data.topic_ids),
    syncJoinTable(supabase, "guidance_owners", item.id, "owner_id", data.owner_ids),
    syncJoinTable(supabase, "guidance_maintainers", item.id, "owner_id", data.maintainer_ids),
    syncJoinTable(supabase, "guidance_locations", item.id, "location_id", data.location_ids),
  ]);

  revalidatePath("/graph");
  redirect("/graph");
}

/**
 * Update an existing guidance item and its relationships.
 */
export async function updateGuidanceItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const data = parseFormData(formData);

  // Update the guidance item
  const { error } = await supabase
    .from("guidance_items")
    .update({
      title: data.title,
      url: data.url,
      summary: data.summary,
      doc_type: data.doc_type,
      status: data.status,
      access: data.access,
      campus_scope: data.campus_scope,
      last_reviewed: data.last_reviewed,
      review_cycle_months: data.review_cycle_months,
      notes_internal: data.notes_internal,
      tags: data.tags,
      parent_id: data.parent_id,
      collection_title: data.collection_title,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update guidance item: ${error.message}`);
  }

  // Sync all join tables
  await Promise.all([
    syncJoinTable(supabase, "guidance_services", id, "service_id", data.service_ids),
    syncJoinTable(supabase, "guidance_technical_services", id, "technical_service_id", data.technical_service_ids),
    syncJoinTable(supabase, "guidance_audiences", id, "audience_id", data.audience_ids),
    syncJoinTable(supabase, "guidance_tasks", id, "task_id", data.task_ids),
    syncJoinTable(supabase, "guidance_topics", id, "topic_id", data.topic_ids),
    syncJoinTable(supabase, "guidance_owners", id, "owner_id", data.owner_ids),
    syncJoinTable(supabase, "guidance_maintainers", id, "owner_id", data.maintainer_ids),
    syncJoinTable(supabase, "guidance_locations", id, "location_id", data.location_ids),
  ]);

  revalidatePath("/graph");
  redirect("/graph");
}

/**
 * Delete a guidance item. Cascades to all join tables via FK ON DELETE CASCADE.
 */
export async function deleteGuidanceItem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("guidance_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete guidance item: ${error.message}`);
  }

  revalidatePath("/graph");
}

/**
 * Fetch all lookup data for the guidance item form.
 *
 * NOTE: Cannot use `unstable_cache` here because `createClient()` calls
 * `cookies()`, which is a dynamic data source disallowed inside cache scopes.
 * Caching can be added later via a service-role client or React `cache()`.
 */
export async function fetchLookups() {
  const supabase = await createClient();

  const [
    { data: serviceAreas },
    { data: services },
    { data: technicalServices },
    { data: audiences },
    { data: tasks },
    { data: topics },
    { data: owners },
    { data: locations },
  ] = await Promise.all([
    supabase.from("service_areas").select("*").order("label"),
    supabase.from("services").select("*").order("label"),
    supabase.from("technical_services").select("*").order("label"),
    supabase.from("audiences").select("*").order("label"),
    supabase.from("tasks").select("*").order("label"),
    supabase.from("topics").select("*").order("label"),
    supabase.from("owners").select("*").order("label"),
    supabase.from("locations").select("*").order("label"),
  ]);

  return {
    serviceAreas: serviceAreas ?? [],
    services: services ?? [],
    technicalServices: technicalServices ?? [],
    audiences: audiences ?? [],
    tasks: tasks ?? [],
    topics: topics ?? [],
    owners: owners ?? [],
    locations: locations ?? [],
  };
}

/**
 * Fetch a single guidance item with all its relationships for editing.
 */
export async function fetchGuidanceItemWithRelations(id: string) {
  const supabase = await createClient();

  const [
    { data: item },
    { data: itemServices },
    { data: itemTechServices },
    { data: itemAudiences },
    { data: itemTasks },
    { data: itemTopics },
    { data: itemOwners },
    { data: itemMaintainers },
    { data: itemLocations },
  ] = await Promise.all([
    supabase.from("guidance_items").select("*").eq("id", id).single(),
    supabase.from("guidance_services").select("service_id").eq("guidance_item_id", id),
    supabase.from("guidance_technical_services").select("technical_service_id").eq("guidance_item_id", id),
    supabase.from("guidance_audiences").select("audience_id").eq("guidance_item_id", id),
    supabase.from("guidance_tasks").select("task_id").eq("guidance_item_id", id),
    supabase.from("guidance_topics").select("topic_id").eq("guidance_item_id", id),
    supabase.from("guidance_owners").select("owner_id").eq("guidance_item_id", id),
    supabase.from("guidance_maintainers").select("owner_id").eq("guidance_item_id", id),
    supabase.from("guidance_locations").select("location_id").eq("guidance_item_id", id),
  ]);

  return {
    item,
    service_ids: itemServices?.map((r) => r.service_id) ?? [],
    technical_service_ids: itemTechServices?.map((r) => r.technical_service_id) ?? [],
    audience_ids: itemAudiences?.map((r) => r.audience_id) ?? [],
    task_ids: itemTasks?.map((r) => r.task_id) ?? [],
    topic_ids: itemTopics?.map((r) => r.topic_id) ?? [],
    owner_ids: itemOwners?.map((r) => r.owner_id) ?? [],
    maintainer_ids: itemMaintainers?.map((r) => r.owner_id) ?? [],
    location_ids: itemLocations?.map((r) => r.location_id) ?? [],
  };
}
