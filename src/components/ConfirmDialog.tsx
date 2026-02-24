/**
 * WCAG-compliant confirmation dialog component.
 *
 * Replaces `window.confirm()` with a focus-trapped, keyboard-navigable
 * modal dialog following Carbon Design System patterns.
 *
 * Features:
 * - Focus trapped within dialog when open
 * - Escape key closes the dialog
 * - Returns focus to trigger element on close
 * - aria-modal, aria-labelledby, aria-describedby
 * - Carbon spacing and colour tokens
 *
 * @module components/ConfirmDialog
 */
"use client";

import { useRef, useEffect, useCallback } from "react";
import { dangerButtonClasses, secondaryButtonClasses } from "@/lib/styles";

interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  open: boolean;
  /** Dialog title */
  title: string;
  /** Dialog description / message */
  description: string;
  /** Label for the confirm (danger) button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Called when user confirms */
  onConfirm: () => void;
  /** Called when user cancels or presses Escape */
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Sync open state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // Focus the cancel button by default (safer choice per Nielsen #5)
      cancelButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle Escape key via native dialog behaviour + callback
  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-lg border border-border bg-background p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="p-carbon-6 space-y-carbon-5">
        <h2
          id="confirm-dialog-title"
          className="text-carbon-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="text-carbon-sm text-foreground-secondary"
        >
          {description}
        </p>
        <div className="flex justify-end gap-carbon-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className={secondaryButtonClasses}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={dangerButtonClasses}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
