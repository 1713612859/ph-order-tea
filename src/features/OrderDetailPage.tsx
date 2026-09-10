import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useT } from "@/lib/i18n";
import { formatPHP, formatDateTime, formatTime } from "@/lib/format";
import { categoryAccent, productById } from "@/data";
import { nextStatus } from "@/lib/order";
import { useOrders } from "@/stores/useOrders";
import type { DictKey } from "@/lib/i18n/dict";

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, tx, locale } = useT();
  const order = useOrders((s) => (id ? s.getById(id) : undefined));
  const advance = useOrders((s) => s.advanceStatus);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title={t("order.detail")} />
        <div className="flex flex-1 items-center justify-center p-8">
          <button onClick={() => navigate("/orders")} className="btn-primary">
            {t("tab.orders")}
          </button>
        </div>
      </div>
    );
  }

  const p = order.price;
  const canAdvance = nextStatus(order.status) !== null && order.status !== "pending_payment";

  return (
    <div className="flex flex-1 flex-col bg-cream">
      <TopBar title={t("order.detail")} />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 pb-28">
        {/* status + pickup number */}
        <div className="card p-5 text-center">
          <StatusBadge status={order.status} />
          <p className="mt-3 text-xs text-muted">{t("orders.pickupNo")}</p>
          <p className="text-5xl font-extrabold tracking-wide text-navy">{order.pickup.pickupNumber}</p>
          <p className="mt-2 text-xs text-muted">{t("order.showTo")}</p>
          {order.status === "pending_payment" && (
            <button onClick={() => navigate(`/payment/${order.id}`)} className="btn-primary mt-4 w-full">
              {t("checkout.pay")} {formatPHP(p.grandTotal)}
            </button>
          )}
          {canAdvance && (
            <button onClick={() => advance(order.id)} className="btn-outline mt-4 w-full">
              {t("order.advance")}
            </button>
          )}
        </div>

        {/* pickup info */}
        <div className="card p-4">
          <p className="mb-1 text-sm font-bold text-navy">{t("order.pickupInfo")}</p>
          <p className="text-sm font-semibold text-navy">{tx(order.pickup.storeName)}</p>
          <p className="mt-0.5 text-xs text-muted">{tx(order.pickup.storeAddress.line1)}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted">
            <Icon name="clock" className="h-4 w-4" />
            {tx(order.pickupTime.label)}
            {order.pickup.estimatedReadyAt ? ` · ~${formatTime(order.pickup.estimatedReadyAt, locale)}` : ""}
          </p>
        </div>

        {/* timeline */}
        <div className="card p-4">
          <p className="mb-3 text-sm font-bold text-navy">{t("order.timeline")}</p>
          <ol className="space-y-3">
            {order.statusHistory.map((ev, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white">
                  <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">{t(`status.${ev.status}` as DictKey)}</p>
                  <p className="text-xs text-muted">{formatDateTime(ev.at, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* items */}
        <div className="card p-4">
          <p className="mb-2 text-sm font-bold text-navy">{t("checkout.orderSummary")}</p>
          <div className="space-y-3">
            {order.items.map((item, i) => {
              const product = productById[item.productId];
              const accent = product ? categoryAccent[product.categoryId] ?? "#6E8B4E" : "#6E8B4E";
              return (
                <div key={i} className="flex gap-3">
                  <Media image={item.image} productId={item.productId} accent={accent} className="h-14 w-14 shrink-0" rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{tx(item.productName)}</p>
                    <p className="line-clamp-1 text-xs text-muted">
                      {item.selectedOptions.map((o) => tx(o.optionLabel)).join(locale === "zh" ? "，" : ", ")}
                    </p>
                    {item.remark && <p className="text-xs italic text-muted">“{item.remark}”</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy">{formatPHP(item.lineSubtotal)}</p>
                    <p className="text-xs text-muted">x {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* price breakdown */}
        <div className="card p-4">
          <div className="flex justify-between py-0.5 text-sm text-navy/80">
            <span>{t("checkout.itemsSubtotal")}</span>
            <span>{formatPHP(p.itemsSubtotal)}</span>
          </div>
          {p.packagingFee > 0 && (
            <div className="flex justify-between py-0.5 text-sm text-navy/80">
              <span>{t("checkout.packagingFee")}</span>
              <span>+ {formatPHP(p.packagingFee)}</span>
            </div>
          )}
          {p.voucherDiscount > 0 && (
            <div className="flex justify-between py-0.5 text-sm text-brand-red">
              <span>{t("checkout.voucherApplied")}</span>
              <span>- {formatPHP(p.voucherDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between py-0.5 text-sm text-muted">
            <span>{t("checkout.vat")}</span>
            <span>{formatPHP(p.vatAmount)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
            <span className="text-sm font-bold text-navy">{t("order.total")}</span>
            <span className="text-lg font-extrabold text-navy">{formatPHP(p.grandTotal)}</span>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {t(("method." + order.payment.method) as DictKey)} · {order.payment.status}
          </p>
        </div>
      </div>
    </div>
  );
}
