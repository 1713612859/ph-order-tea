import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionBar } from "@/components/layout/ActionBar";
import { TopBar } from "@/components/layout/TopBar";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/lib/i18n";
import { formatPHP } from "@/lib/format";
import { useOrders } from "@/stores/useOrders";
import { PaymentMethod } from "@/types";
import type { DictKey } from "@/lib/i18n/dict";

type Phase = "select" | "processing" | "success" | "failed" | "cancelled";
type Outcome = "success" | "failed" | "cancelled";

const METHODS: { key: (typeof PaymentMethod)[keyof typeof PaymentMethod]; label: DictKey; tint: string }[] = [
  { key: "gcash", label: "method.gcash", tint: "#0A7CFF" },
  { key: "maya", label: "method.maya", tint: "#22C55E" },
  { key: "qrph", label: "method.qrph", tint: "#6D28D9" },
  { key: "card", label: "method.card", tint: "#0F2340" },
  { key: "cash_on_pickup", label: "method.cash_on_pickup", tint: "#A9750B" },
];

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useT();
  const order = useOrders((s) => (orderId ? s.getById(orderId) : undefined));
  const pay = useOrders((s) => s.pay);

  const [phase, setPhase] = useState<Phase>("select");
  const [method, setMethod] = useState<(typeof PaymentMethod)[keyof typeof PaymentMethod]>("gcash");
  const [outcome, setOutcome] = useState<Outcome>("success");

  useEffect(() => {
    if (phase !== "processing") return;
    const timer = setTimeout(() => {
      if (orderId) pay(orderId, method, outcome);
      setPhase(outcome);
    }, 1400);
    return () => clearTimeout(timer);
  }, [phase, outcome, method, orderId, pay]);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title={t("pay.title")} />
        <div className="flex flex-1 items-center justify-center p-8">
          <button onClick={() => navigate("/orders")} className="btn-primary">
            {t("tab.orders")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cream-soft border-t-navy" />
        <p className="text-sm text-muted">{t("pay.processing")}</p>
      </div>
    );
  }

  if (phase === "success" || phase === "failed" || phase === "cancelled") {
    return <ResultView phase={phase} amount={order.price.grandTotal} onView={() => navigate(`/orders/${order.id}`)} onRetry={() => setPhase("select")} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={t("pay.title")} />
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 pb-32">
        <div className="card p-4 text-center">
          <p className="text-xs text-muted">{t("checkout.pay")}</p>
          <p className="mt-1 text-3xl font-extrabold text-navy">{formatPHP(order.price.grandTotal)}</p>
          <p className="mt-1 text-xs text-muted">
            {t("orders.pickupNo")} {order.pickup.pickupNumber}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">{t("pay.chooseMethod")}</p>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${method === m.key ? "border-navy bg-navy/5" : "border-line"}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: m.tint }}>
                  <Icon name="bag" className="h-5 w-5" />
                </span>
                <span className="flex-1 text-sm font-semibold text-navy">{t(m.label)}</span>
                <Icon name={method === m.key ? "check-circle" : "circle"} className={`h-6 w-6 ${method === m.key ? "text-navy" : "text-line"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* simulate outcome (prototype only) */}
        <div className="rounded-xl border border-dashed border-line p-3">
          <p className="mb-2 text-xs font-semibold text-muted">{t("pay.outcome")}</p>
          <div className="flex gap-2">
            {(["success", "failed", "cancelled"] as Outcome[]).map((o) => (
              <button
                key={o}
                onClick={() => setOutcome(o)}
                className={`chip flex-1 text-xs ${outcome === o ? "chip-on" : "chip-off"}`}
              >
                {t(`pay.${o}.title` as DictKey)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">{t("pay.simulateHint")}</p>
        </div>
      </div>

      <ActionBar>
        <div className="px-4 py-3">
          <button onClick={() => setPhase("processing")} className="btn-primary w-full text-base">
            {t("pay.payNow")} · {formatPHP(order.price.grandTotal)}
          </button>
        </div>
      </ActionBar>
    </div>
  );
}

function ResultView({ phase, amount, onView, onRetry }: { phase: "success" | "failed" | "cancelled"; amount: number; onView: () => void; onRetry: () => void }) {
  const { t } = useT();
  const ok = phase === "success";
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
        <Icon name={ok ? "check" : "close"} className="h-10 w-10" strokeWidth={2.4} />
      </div>
      <h2 className="text-xl font-bold text-navy">{t(`pay.${phase}.title` as DictKey)}</h2>
      <p className="text-sm text-muted">{t(`pay.${phase}.body` as DictKey)}</p>
      <p className="text-2xl font-extrabold text-navy">{formatPHP(amount)}</p>
      <div className="mt-4 w-full space-y-2">
        {ok ? (
          <button onClick={onView} className="btn-primary w-full">
            {t("pay.viewOrder")}
          </button>
        ) : (
          <>
            <button onClick={onRetry} className="btn-primary w-full">
              {t("common.retry")}
            </button>
            <button onClick={onView} className="btn-outline w-full">
              {t("pay.viewOrder")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
