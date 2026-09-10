import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useT } from "@/lib/i18n";
import { formatPHP, formatDateTime } from "@/lib/format";
import { useOrders } from "@/stores/useOrders";
import type { Order } from "@/types";

type Filter = "all" | "active" | "completed";
const ACTIVE = new Set(["pending_payment", "paid", "making", "ready"]);

export function OrdersPage() {
  const { t, tx, locale } = useT();
  const navigate = useNavigate();
  const orders = useOrders((s) => s.orders);
  const [filter, setFilter] = useState<Filter>("all");

  const list = orders.filter((o) => {
    if (filter === "active") return ACTIVE.has(o.status);
    if (filter === "completed") return o.status === "completed" || o.status === "cancelled";
    return true;
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 px-4 pb-2 pt-4 backdrop-blur">
        <h1 className="text-xl font-bold text-navy">{t("orders.title")}</h1>
        <div className="mt-3 flex gap-6">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`relative pb-2 text-sm font-semibold ${filter === f ? "text-navy" : "text-muted"}`}>
              {t(`orders.${f}` as const)}
              {filter === f && <span className="absolute -bottom-px left-0 h-0.5 w-full bg-brand-red" />}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {list.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Icon name="orders" className="h-12 w-12 text-muted" />
            <p className="text-sm text-muted">{t("orders.empty")}</p>
            <button onClick={() => navigate("/menu")} className="btn-primary mt-1">
              {t("cart.emptyCta")}
            </button>
          </div>
        )}
        {list.map((o) => (
          <OrderCard key={o.id} order={o} onOpen={() => navigate(`/orders/${o.id}`)} tx={tx} locale={locale} t={t} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onOpen,
  tx,
  locale,
  t,
}: {
  order: Order;
  onOpen: () => void;
  tx: (v: { en: string; zh: string } | undefined) => string;
  locale: "en" | "zh";
  t: (k: "orders.pickupNo" | "order.total") => string;
}) {
  const first = order.items[0];
  const moreCount = order.items.reduce((n, i) => n + i.quantity, 0) - (first?.quantity ?? 0);
  return (
    <button onClick={onOpen} className="card w-full p-4 text-left active:scale-[0.99]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted">#{order.orderNo}</span>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">{tx(order.pickup.storeName)}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {first ? tx(first.productName) : ""}
            {moreCount > 0 ? ` +${moreCount}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-muted">{formatDateTime(order.placedAt, locale)}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted">
            {t("orders.pickupNo")} <span className="font-bold text-navy">{order.pickup.pickupNumber}</span>
          </p>
          <p className="mt-1 text-base font-extrabold text-navy">{formatPHP(order.price.grandTotal)}</p>
        </div>
      </div>
    </button>
  );
}
