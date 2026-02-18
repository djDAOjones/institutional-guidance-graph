/**
 * New guidance item page — form for creating a guidance entry.
 *
 * Server Component that fetches all lookup data, then renders
 * the client-side GuidanceItemForm with the create action.
 *
 * @module app/(dashboard)/guidance/new/page
 */
import { createGuidanceItem, fetchLookups } from "@/lib/actions/guidance";
import GuidanceItemForm from "@/components/GuidanceItemForm";

export default async function NewGuidancePage() {
  const lookups = await fetchLookups();

  return (
    <main
      id="main-content"
      role="main"
      aria-label="Create new guidance item"
      className="mx-auto max-w-4xl px-carbon-5 py-carbon-7"
    >
      <h1 className="mb-carbon-7 text-carbon-3xl font-semibold text-foreground">
        New Guidance Item
      </h1>

      <GuidanceItemForm action={createGuidanceItem} lookups={lookups} />
    </main>
  );
}
