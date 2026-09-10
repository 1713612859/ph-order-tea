import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom sheet constrained to the phone-width app frame. */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mt-auto w-full max-w-app rounded-t-3xl bg-white shadow-sheet">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <div className="text-lg font-bold text-navy">{title}</div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-navy/60 hover:bg-cream-soft">
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-3 pb-safe">{footer}</div>}
      </div>
    </div>
  );
}
