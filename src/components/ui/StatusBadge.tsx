import type { OrderStatus } from "@/types";
import { useT } from "@/lib/i18n";
import type { DictKey } from "@/lib/i18n/dict";

const styles: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-800",
  paid: "bg-navy/10 text-navy",
  making: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-cream-soft text-muted",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useT();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {t(`status.${status}` as DictKey)}
    </span>
  );
}
