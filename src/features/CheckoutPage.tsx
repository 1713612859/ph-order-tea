import { useSettings } from "@/stores/useSettings";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionBar } from "@/components/layout/ActionBar";
import { TopBar } from "@/components/layout/TopBar";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Sheet } from "@/components/ui/Sheet";
import { useT } from "@/lib/i18n";
import { formatPHP } from "@/lib/format";
import { categoryAccent, productById, storeById } from "@/data";
import { voucherRepo } from "@/lib/repositories";
import { calcCheckout, calcLineTotal, isVoucherEligible, optionSummary, selectedLines, cartSelectedTotal } from "@/lib/pricing";
import { validateCart } from "@/lib/validation";
import type { DictKey } from "@/lib/i18n/dict";
import { buildOrder } from "@/lib/order";
import { PACKAGING_FEE } from "@/lib/config";
import { useCart } from "@/stores/useCart";
import { useOrders } from "@/stores/useOrders";
import { useAuth } from "@/stores/useAuth";
import { useMemberMode } from "@/stores/useMemberMode";
import { LoginSheet } from "./LoginSheet";
import type { PickupTimeSlot, Voucher } from "@/types";

const ASAP: PickupTimeSlot = { type: "asap", label: { en: "ASAP (made instantly)", zh: "尽快（即点即做）" } };

export function CheckoutPage() {
  const { t, tx, locale } = useT();
  const navigate = useNavigate();
  const cart = useCart((s) => s.cart);
  const removeSelected = useCart((s) => s.removeSelected);
  const memberMode = useMemberMode();
  const isLoggedIn = useAuth((s) => s.isLoggedIn);

  const addOrder = useOrders((s) => s.addOrder);

  const store = cart.storeId ? storeById[cart.storeId] : undefined;
  const lines = selectedLines(cart);

  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const member = useAuth(s => s.member);
  const orders = useOrders(s => s.orders);
  const unavailableVoucherIds = orders.filter(o => o.status !== "cancelled" && o.appliedVoucherId).map(o => o.appliedVoucherId!);
  const voucherContext = { memberId: member?.id, unavailableVoucherIds, storeId: cart.storeId, productIds: lines.map(l => l.productId) };
  const [packaging, setPackaging] = useState(PACKAGING_FEE.enabledByDefault);
  const [voucher, setVoucher] = useState<Voucher | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState<PickupTimeSlot>(ASAP);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const itemsSubtotal = cartSelectedTotal(cart, memberMode);
  const breakdown = useMemo(
    () => calcCheckout({ cart, memberMode, packagingFeeAmount: packaging ? PACKAGING_FEE.amount : 0, voucher, voucherContext }),
    [cart, memberMode, packaging, voucher, member, orders],
  );

  if (!store || lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title={t("checkout.title")} />
        <div className="flex flex-1 items-center justify-center p-8">
          <button onClick={() => navigate("/menu")} className="btn-primary">
            {t("tab.menu")}
          </button>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    if (!useAuth.getState().isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    if (submitting.current) return;
    const freshCart = useCart.getState().cart;
    const issue = validateCart(freshCart);
    if (issue) { setError(issue); return; }
    if (pickupTime.type === "scheduled" && (!pickupTime.scheduledAt || Date.parse(pickupTime.scheduledAt) <= Date.now())) { setError("validation.time"); return; }
    const currentMember = useAuth.getState().member;
    const currentMemberMode = !!currentMember && useSettings.getState().memberPriceEnabled;
    const freshContext = { ...voucherContext, memberId: currentMember?.id, unavailableVoucherIds: useOrders.getState().orders.filter(o => o.status !== "cancelled" && o.appliedVoucherId).map(o => o.appliedVoucherId!) };
    if (voucher && !isVoucherEligible(voucher, cartSelectedTotal(freshCart, currentMemberMode), freshContext)) { setError("validation.voucher"); return; }
    submitting.current = true;
    const order = buildOrder({
      cart: freshCart,
      store,
      breakdown: calcCheckout({ cart: freshCart, memberMode: currentMemberMode, packagingFeeAmount: packaging ? PACKAGING_FEE.amount : 0, voucher, voucherContext: freshContext }),
      memberMode: currentMemberMode,
      memberId: currentMember?.id ?? null,
      paymentMethod: "gcash",
      pickupTime,
      voucher,
    });
    addOrder(order);
    if (!useOrders.getState().orders.some(o => o.id === order.id)) { submitting.current = false; setError("validation.voucher"); return; }
    // remove ordered (selected) lines from cart; keep unselected items
    removeSelected();
    navigate(`/payment/${order.id}`);
  };

  return (
    <div className="checkout-page flex flex-1 flex-col bg-cream">
      <TopBar title={t("checkout.title")} />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 pb-6">
        {error && <p role="alert" className="validation-message">{t(error as DictKey)}</p>}
        {/* pickup store */}
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t("common.pickup")}</p>
          <button onClick={() => navigate("/stores")} className="mt-2 flex w-full items-center justify-between text-left">
            <span className="text-base font-bold text-navy">{tx(store.name)}</span>
            <Icon name="chevron-right" className="h-5 w-5 text-muted" />
          </button>
          <p className="mt-1 text-xs text-muted">{tx(store.address.line1)}</p>
        </div>

        {/* pickup time */}
        <div className="card flex items-center justify-between p-4">
          <span className="text-sm font-semibold text-navy">{t("checkout.pickupTime")}</span>
          <button onClick={() => setTimeOpen(true)} className="flex items-center gap-1 text-sm font-medium text-navy underline">
            {tx(pickupTime.label)}
          </button>
        </div>

        {/* order summary */}
        <div className="card p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">{t("checkout.orderSummary")}</p>
          <div className="space-y-3">
            {lines.map((line) => {
              const product = productById[line.productId];
              if (!product) return null;
              const accent = categoryAccent[product.categoryId] ?? "#6E8B4E";
              return (
                <div key={line.lineId} className="flex gap-3">
                  <Media image={product.image} productId={product.id} accent={accent} className="h-14 w-14 shrink-0" rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{tx(product.name)}</p>
                    <p className="line-clamp-1 text-xs text-muted">{optionSummary(line, locale)}</p>
                    {line.remark && <p className="text-xs italic text-muted">“{line.remark}”</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy">{formatPHP(calcLineTotal(line, memberMode))}</p>
                    <p className="text-xs text-muted">x {line.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* packaging fee */}
        <button onClick={() => PACKAGING_FEE.optional && setPackaging((v) => !v)} className="card flex w-full items-center justify-between p-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Icon name="bag" className="h-5 w-5 text-brand-amber" />
            {t("checkout.packagingFee")}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-bold text-navy">{formatPHP(PACKAGING_FEE.amount)}</span>
            <Icon name={packaging ? "check-circle" : "circle"} className={`h-6 w-6 ${packaging ? "text-navy" : "text-line"}`} />
          </span>
        </button>

        {/* voucher */}
        <button onClick={() => setVoucherOpen(true)} className="card flex w-full items-center justify-between p-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Icon name="ticket" className="h-5 w-5 text-brand-amber" />
            {t("checkout.addVoucher")}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-red">
            {voucher ? `- ${formatPHP(breakdown.voucherDiscount)}` : ""}
            <Icon name="chevron-right" className="h-5 w-5 text-muted" />
          </span>
        </button>

        {/* payment details */}
        <div className="card p-4">
          <p className="mb-2 text-sm font-bold text-navy">{t("checkout.paymentDetails")}</p>
          <Row label={t("checkout.itemsSubtotal")} value={formatPHP(itemsSubtotal)} />
          {packaging && <Row label={t("checkout.packagingFee")} value={`+ ${formatPHP(PACKAGING_FEE.amount)}`} />}
          {breakdown.voucherDiscount > 0 && <Row label={t("checkout.voucherApplied")} value={`- ${formatPHP(breakdown.voucherDiscount)}`} accent />}
          <Row label={t("checkout.vat")} value={formatPHP(breakdown.vatAmount)} muted />
          <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
            <span className="text-sm font-bold text-navy">{t("checkout.subtotal")}</span>
            <span className="text-lg font-extrabold text-navy">{formatPHP(breakdown.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* pay bar */}
      <ActionBar>
        <div className="px-4 py-3">
          {!isLoggedIn && <p className="mb-2 text-center text-xs text-brand-red">{t("checkout.loginToOrder")}</p>}
          <button onClick={placeOrder} className="btn-primary w-full text-base">
            {t("checkout.pay")} {formatPHP(breakdown.grandTotal)}
          </button>
        </div>
      </ActionBar>

      {/* voucher sheet */}
      <Sheet open={voucherOpen} onClose={() => setVoucherOpen(false)} title={t("checkout.selectVoucher")}>
        <div className="space-y-2 pb-2">
          <button
            onClick={() => {
              setVoucher(undefined);
              setVoucherOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm ${!voucher ? "border-navy bg-navy/5" : "border-line"}`}
          >
            {t("checkout.noVoucher")}
            {!voucher && <Icon name="check" className="h-5 w-5 text-navy" />}
          </button>
          {voucherRepo.listAvailable().map((v) => {
            const eligible = isVoucherEligible(v, itemsSubtotal, voucherContext);
            return (
              <button
                key={v.id}
                disabled={!eligible}
                onClick={() => {
                  setVoucher(v);
                  setVoucherOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm ${
                  voucher?.id === v.id ? "border-navy bg-navy/5" : "border-line"
                } ${!eligible ? "opacity-40" : ""}`}
              >
                <span>
                  <span className="flex items-center gap-2 font-semibold text-navy">
                    <Icon name="ticket" className="h-4 w-4 text-brand-red" />
                    {tx(v.title)}
                  </span>
                  {!eligible && (
                    <span className="mt-0.5 block text-xs text-muted">
                      {tx({ en: "Not available for this order", zh: "当前订单不可用" })}
                    </span>
                  )}
                </span>
                {voucher?.id === v.id && <Icon name="check" className="h-5 w-5 text-navy" />}
              </button>
            );
          })}
        </div>
      </Sheet>

      {/* pickup time sheet */}
      <Sheet open={timeOpen} onClose={() => setTimeOpen(false)} title={t("checkout.selectTime")}>
        <div className="space-y-2 pb-2">
          {[ASAP, ...buildSlots(store.liveOps.estimatedMinutes)].map((slot, i) => (
            <button
              key={i}
              onClick={() => {
                setPickupTime(slot);
                setTimeOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm ${
                pickupTime.label.en === slot.label.en ? "border-navy bg-navy/5" : "border-line"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-navy">
                <Icon name="clock" className="h-4 w-4 text-muted" />
                {tx(slot.label)}
              </span>
              {pickupTime.label.en === slot.label.en && <Icon name="check" className="h-5 w-5 text-navy" />}
            </button>
          ))}
        </div>
      </Sheet>

      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={placeOrder} />
    </div>
  );
}

function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className={muted ? "text-muted" : "text-navy/80"}>{label}</span>
      <span className={accent ? "font-semibold text-brand-red" : muted ? "text-muted" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}

function buildSlots(baseMin: number): PickupTimeSlot[] {
  const now = new Date();
  const slots: PickupTimeSlot[] = [];
  for (let i = 1; i <= 4; i++) {
    const d = new Date(now.getTime() + (baseMin + i * 15) * 60000);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const label = `${hh}:${mm}`;
    slots.push({ type: "scheduled", scheduledAt: d.toISOString(), label: { en: label, zh: label } });
  }
  return slots;
}


