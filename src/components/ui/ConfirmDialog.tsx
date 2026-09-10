import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-8" role="dialog" aria-modal="true">
      <button aria-label="Cancel" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-[340px] rounded-2xl bg-white p-6 text-center shadow-sheet">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        {body && <p className="mt-2 text-sm text-muted">{body}</p>}
        <div className="mt-5 flex gap-3">
          <button className="btn-outline flex-1" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn-primary flex-1" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
