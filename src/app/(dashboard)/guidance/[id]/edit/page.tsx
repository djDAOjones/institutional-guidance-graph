/**
 * Edit guidance item page — form for updating an existing guidance entry.
 *
 * Server Component that fetches the item + lookups, then renders
 * the client-side GuidanceItemForm with the update action bound to the item ID.
 *
 * @module app/(dashboard)/guidance/[id]/edit/page
 */
import { notFound } from "next/navigation";
import {
  updateGuidanceItem,
  fetchLookups,
  fetchGuidanceItemWithRelations,
} from "@/lib/actions/guidance";
import GuidanceItemForm from "@/components/GuidanceItemForm";

interface EditGuidancePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGuidancePage({
  params,
}: EditGuidancePageProps) {
  const { id } = await params;
  const [lookups, itemData] = await Promise.all([
    fetchLookups(),
    fetchGuidanceItemWithRelations(id),
  ]);

  if (!itemData.item) {
    notFound();
  }

  // Bind the update action to this item's ID
  const updateAction = updateGuidanceItem.bind(null, id);

  return (
    <main
      id="main-content"
      role="main"
      aria-label={`Edit: ${itemData.item.title}`}
      className="mx-auto max-w-4xl px-carbon-5 py-carbon-7"
    >
      <h1 className="mb-carbon-7 text-carbon-3xl font-semibold text-foreground">
        Edit Guidance Item
      </h1>

      <GuidanceItemForm
        action={updateAction}
        item={itemData.item}
        selectedRelations={{
          service_ids: itemData.service_ids,
          technical_service_ids: itemData.technical_service_ids,
          audience_ids: itemData.audience_ids,
          task_ids: itemData.task_ids,
          topic_ids: itemData.topic_ids,
          owner_ids: itemData.owner_ids,
          maintainer_ids: itemData.maintainer_ids,
          location_ids: itemData.location_ids,
        }}
        lookups={lookups}
      />
    </main>
  );
}
