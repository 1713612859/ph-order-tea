import { useEffect, useState } from "react";
import { useAuth } from "@/stores/useAuth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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

const METHODS: { key: (typeof PaymentMethod)[keyof typeof PaymentMethod]; label: DictKey; logos: string[] }[] = [
  { key: "gcash", label: "method.gcash", logos: ["/icons/payments/gcash.png"] },
  { key: "maya", label: "method.maya", logos: ["/icons/payments/maya.png"] },
  { key: "qrph", label: "method.qrph", logos: ["/icons/payments/qrph.png"] },
  { key: "card", label: "method.card", logos: ["/icons/payments/visa.png", "/icons/payments/mastercard.png"] },
];

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useT();
  const memberId = useAuth(s => s.member?.id);
  const order = useOrders((s) => (orderId ? s.getById(orderId) : undefined));
  const pay = useOrders((s) => s.pay);

  const [phase, setPhase] = useState<Phase>("select");
  const [method, setMethod] = useState<(typeof PaymentMethod)[keyof typeof PaymentMethod]>("gcash");
  const [outcome, setOutcome] = useState<Outcome>("success");

  useEffect(() => {
    if (phase !== "processing") return;
    const timer = setTimeout(() => {
      if (orderId) pay(orderId, method, outcome);
      const updated = useOrders.getState().getById(orderId ?? "");
      if (updated?.payment.status === outcome) setPhase(outcome);
      else navigate("/orders", { replace: true });
    }, 1400);
    return () => clearTimeout(timer);
  }, [phase, outcome, method, orderId, pay, navigate]);

  if (!order || order.memberId !== memberId) {
    return (
      <div className="payment-page flex flex-1 flex-col">
        <TopBar title={t("pay.title")} />
        <div className="flex flex-1 items-center justify-center p-8">
          <button onClick={() => navigate("/orders")} className="btn-primary">
            {t("tab.orders")}
          </button>
        </div>
      </div>
    );
  }

  if (order.status !== "pending_payment" && phase !== "success" && phase !== "processing") return <Navigate to={`/orders/${order.id}`} replace />;

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
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 pb-6">
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
                <span className="flex h-10 w-16 shrink-0 items-center justify-center gap-1 rounded-lg bg-white ring-1 ring-line">
                  {m.logos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      loading="lazy"
                      className={m.logos.length > 1 ? "h-5 w-auto object-contain" : "h-7 w-auto object-contain"}
                    />
                  ))}
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
