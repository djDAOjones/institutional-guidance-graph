/**
 * Guidance items list page — the main dashboard view.
 *
 * Shows a sortable, filterable data table of all guidance items.
 * Admins/editors can create, edit, and delete items from this view.
 *
 * Design principles:
 * - Carbon: data table styling with spacing/type/colour tokens
 * - WCAG AAA: table with proper headers, scope, caption
 * - Nielsen #1 (System status): item count, empty state
 * - Nielsen #7 (Flexibility): links to create/edit
 *
 * @module app/(dashboard)/graph/page
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteGuidanceItem } from "@/lib/actions/guidance";
import {
  DOC_TYPE_LABELS,
  STATUS_LABELS,
  ACCESS_LABELS,
} from "@/lib/constants";
import type { DocType, ItemStatus, AccessLevel } from "@/types/database";

export default async function GraphPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch guidance items with related services and audiences
  const { data: items, error } = await supabase
    .from("guidance_items")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <main
      id="main-content"
      role="main"
      aria-label="Guidance items list"
      className="mx-auto max-w-7xl px-carbon-5 py-carbon-7"
    >
      {/* Page header */}
      <div className="mb-carbon-7 flex items-center justify-between">
        <div>
          <h1 className="text-carbon-3xl font-semibold text-foreground">
            Guidance Items
          </h1>
          <p className="mt-carbon-2 text-carbon-base text-foreground-secondary">
            {items?.length ?? 0} item{items?.length !== 1 ? "s" : ""} in the
            register
          </p>
        </div>
        <Link
          href="/guidance/new"
          className="rounded bg-interactive px-carbon-5 py-carbon-3 text-carbon-sm font-medium text-foreground-inverse transition-colors hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
        >
          + New Guidance Item
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="mb-carbon-5 rounded border border-status-error/30 bg-status-error/10 p-carbon-4 text-carbon-sm text-status-error"
        >
          Failed to load guidance items: {error.message}
        </div>
      )}

      {/* Empty state */}
      {(!items || items.length === 0) && !error && (
        <div className="rounded-lg border border-border bg-background-subtle p-carbon-9 text-center">
          <p className="text-carbon-lg text-foreground-secondary">
            No guidance items yet.
          </p>
          <p className="mt-carbon-2 text-carbon-base text-foreground-secondary">
            Click &quot;+ New Guidance Item&quot; to add your first entry.
          </p>
        </div>
      )}

      {/* Data table */}
      {items && items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-carbon-sm">
            <caption className="sr-only">
              Guidance items register — {items.length} items
            </caption>
            <thead className="border-b border-border bg-background-subtle">
              <tr>
                <th
                  scope="col"
                  className="px-carbon-4 py-carbon-3 font-medium text-foreground"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-carbon-4 py-carbon-3 font-medium text-foreground"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-carbon-4 py-carbon-3 font-medium text-foreground"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-carbon-4 py-carbon-3 font-medium text-foreground"
                >
                  Access
                </th>
                <th
                  scope="col"
                  className="px-carbon-4 py-carbon-3 font-medium text-foreground"
                >
                  Updated
                </th>
                <th scope="col" className="px-carbon-4 py-carbon-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-background-subtle"
                >
                  <td className="px-carbon-4 py-carbon-3">
                    <Link
                      href={`/guidance/${item.id}/edit`}
                      className="font-medium text-interactive hover:underline"
                    >
                      {item.title}
                    </Link>
                    {item.summary && (
                      <p className="mt-carbon-1 text-carbon-xs text-foreground-secondary line-clamp-1">
                        {item.summary}
                      </p>
                    )}
                  </td>
                  <td className="px-carbon-4 py-carbon-3">
                    <DocTypeBadge docType={item.doc_type as DocType} />
                  </td>
                  <td className="px-carbon-4 py-carbon-3">
                    <StatusBadge status={item.status as ItemStatus} />
                  </td>
                  <td className="px-carbon-4 py-carbon-3 text-foreground-secondary">
                    {ACCESS_LABELS[item.access as AccessLevel] ?? item.access}
                  </td>
                  <td className="px-carbon-4 py-carbon-3 text-foreground-secondary">
                    {new Date(item.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-carbon-4 py-carbon-3">
                    <div className="flex items-center gap-carbon-3">
                      <Link
                        href={`/guidance/${item.id}/edit`}
                        className="text-interactive hover:underline"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteGuidanceItem(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-status-error hover:underline"
                          onClick={(e) => {
                            if (
                              !window.confirm(
                                `Delete "${item.title}"? This cannot be undone.`,
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

/** Document type badge with visual emphasis for service manuals */
function DocTypeBadge({ docType }: { docType: DocType }) {
  const isServiceManual = docType === "service_manual";
  
  return (
    <div className="flex items-center gap-carbon-2">
      {isServiceManual && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-carbon-blue-60"
          aria-hidden="true"
        >
          <path
            d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1H2V3zM2 5h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm2 2v1h8V7H4zm0 2v1h6V9H4z"
            fill="currentColor"
          />
        </svg>
      )}
      <span
        className={`inline-block rounded px-carbon-2 py-carbon-1 text-carbon-xs font-medium ${
          isServiceManual
            ? "bg-carbon-blue-20/20 text-carbon-blue-60 border border-carbon-blue-30"
            : "text-foreground-secondary"
        }`}
      >
        {DOC_TYPE_LABELS[docType] ?? docType}
      </span>
    </div>
  );
}

/** Colour-coded status badge following Carbon status colours */
function StatusBadge({ status }: { status: ItemStatus }) {
  const colours: Record<ItemStatus, string> = {
    draft: "bg-carbon-yellow-30/20 text-carbon-gray-90",
    canonical: "bg-carbon-green-50/20 text-carbon-green-50",
    duplicate: "bg-carbon-purple-60/20 text-carbon-purple-60",
    obsolete: "bg-carbon-gray-50/20 text-carbon-gray-60",
  };

  return (
    <span
      className={`inline-block rounded-full px-carbon-3 py-carbon-1 text-carbon-xs font-medium ${colours[status] ?? ""}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
