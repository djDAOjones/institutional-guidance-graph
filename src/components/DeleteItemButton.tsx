/**
 * WCAG-compliant delete button with confirmation dialog.
 *
 * Replaces the inline `window.confirm()` pattern with a proper
 * modal dialog for accessibility compliance.
 *
 * @module components/DeleteItemButton
 */
"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface DeleteItemButtonProps {
  /** The item title (shown in confirmation message) */
  itemTitle: string;
  /** Server action to call on confirmed delete */
  deleteAction: () => Promise<void>;
}

export default function DeleteItemButton({
  itemTitle,
  deleteAction,
}: DeleteItemButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setShowConfirm(false);
    startTransition(async () => {
      await deleteAction();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="text-status-error hover:underline focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-1 rounded disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Guidance Item"
        description={`Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
