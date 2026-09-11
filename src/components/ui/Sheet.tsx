import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";
import { useModal } from "@/lib/useModal";
import { useT } from "@/lib/i18n";
interface SheetProps { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; }
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const ref = useModal(open, onClose);
  const id = useId();
  const { t } = useT();
  if (!open) return null;
  return <div className="sheet-overlay fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}>
    <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
    <div className="sheet-panel relative mt-auto flex w-full max-w-app flex-col rounded-t-3xl bg-white shadow-sheet">
      <div className="sheet-handle"/>
      <div className="flex items-center justify-between px-5 pb-4 pt-3"><h2 id={id} className="text-lg font-bold text-navy">{title}</h2><button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-2 text-muted"><Icon name="close" className="h-5 w-5"/></button></div>
      <div className="min-h-0 overflow-y-auto px-5 pb-5">{children}</div>
      {footer && <div className="border-t border-line px-5 py-3 pb-safe">{footer}</div>}
    </div>
  </div>;
}
