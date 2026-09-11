import { buildOrder } from "./order";
import { calcCheckout } from "./pricing";
import { validateCart } from "./validation";
import { PACKAGING_FEE } from "./config";
import { storeRepo } from "./repositories";
import { useAuth } from "@/stores/useAuth";
import { useCart } from "@/stores/useCart";
import { useSettings } from "@/stores/useSettings";
import { useOrders } from "@/stores/useOrders";
import type { PickupTimeSlot, Voucher } from "@/types";

const ASAP: PickupTimeSlot = { type: "asap", label: { en: "ASAP (made instantly)", zh: "尽快（即点即做）" } };

export interface PlaceFromCartOptions {
  pickupTime?: PickupTimeSlot;
  voucher?: Voucher;
  includePackaging?: boolean;
}

export type PlaceFromCartResult = { ok: true; orderId: string } | { ok: false; error: string };

/**
 * Places an order from the cart's selected lines using sensible defaults
 * (ASAP pickup, packaging fee on, no voucher). Reads every store via getState()
 * at call time so the snapshot reflects the latest login/member-price state.
 */
export function placeOrderFromCart(opts: PlaceFromCartOptions = {}): PlaceFromCartResult {
  const cart = useCart.getState().cart;
  const issue = validateCart(cart);
  if (issue) return { ok: false, error: issue };

  const storeId = useSettings.getState().selectedStoreId;
  const store = storeId ? storeRepo.getById(storeId) : undefined;
  if (!store) return { ok: false, error: "menu.selectStore" };

  const member = useAuth.getState().member;
  const memberMode = !!member && useSettings.getState().memberPriceEnabled;
  const voucherContext = {
    memberId: member?.id,
    unavailableVoucherIds: useOrders
      .getState()
      .orders.filter((o) => o.status !== "cancelled" && o.appliedVoucherId)
      .map((o) => o.appliedVoucherId!),
  };

  const order = buildOrder({
    cart,
    store,
    breakdown: calcCheckout({
      cart,
      memberMode,
      packagingFeeAmount: (opts.includePackaging ?? true) ? PACKAGING_FEE.amount : 0,
      voucher: opts.voucher,
      voucherContext,
    }),
    memberMode,
    memberId: member?.id ?? null,
    paymentMethod: "gcash",
    pickupTime: opts.pickupTime ?? ASAP,
    voucher: opts.voucher,
  });

  useOrders.getState().addOrder(order);
  useCart.getState().removeSelected();
  return { ok: true, orderId: order.id };
}
