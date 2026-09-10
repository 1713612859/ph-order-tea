import type {
  Cart,
  Order,
  OrderItemSnapshot,
  OrderPriceBreakdown,
  PaymentMethod,
  PickupTimeSlot,
  Store,
  Voucher,
} from "@/types";
import { optionById, productById } from "@/data";
import { calcLineTotal, calcUnitPrice, selectedLines } from "./pricing";

let orderSeq = 0;
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${(++orderSeq).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function orderNo(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const seq = String((date.getTime() % 10000)).padStart(4, "0");
  return `${y}${m}${d}-${seq}`;
}

function pickupNumber(): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
  const n = String(Math.floor(Math.random() * 90) + 10);
  return `${letter}${n}`;
}

export interface BuildOrderInput {
  cart: Cart;
  store: Store;
  breakdown: OrderPriceBreakdown;
  memberMode: boolean;
  memberId: string | null;
  paymentMethod: PaymentMethod;
  pickupTime: PickupTimeSlot;
  voucher?: Voucher;
}

export function buildOrder(input: BuildOrderInput): Order {
  const now = new Date();
  const nowIso = now.toISOString();
  const id = uid("order");

  const items: OrderItemSnapshot[] = selectedLines(input.cart).map((line) => {
    const product = productById[line.productId];
    const selectedOptions = line.selectedOptionIds
      .map((oid) => {
        const opt = optionById[oid];
        if (!opt) return null;
        return {
          groupName: { en: "", zh: "" }, // group name resolved lazily in UI if needed
          optionLabel: opt.label,
          unitPrice: opt.priceMode === "addon" ? opt.retailPrice : 0,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return {
      productId: line.productId,
      productName: product?.name ?? { en: line.productId, zh: line.productId },
      image: product?.image ?? { url: "", alt: { en: "", zh: "" } },
      quantity: line.quantity,
      selectedOptions,
      remark: line.remark,
      lineSubtotal: calcLineTotal(line, input.memberMode),
      memberPriceApplied:
        input.memberMode &&
        !!product &&
        calcUnitPrice(product, line.selectedOptionIds, true) < calcUnitPrice(product, line.selectedOptionIds, false),
    };
  });

  return {
    id,
    orderNo: orderNo(now),
    memberId: input.memberId,
    serviceType: "pickup",
    items,
    price: input.breakdown,
    pickup: {
      pickupNumber: pickupNumber(),
      storeId: input.store.id,
      storeName: input.store.name,
      storeAddress: input.store.address,
      estimatedReadyAt: input.pickupTime.type === "scheduled" && input.pickupTime.scheduledAt ? input.pickupTime.scheduledAt : new Date(now.getTime() + (input.store.liveOps.estimatedMinutes + 5) * 60000).toISOString(),
    },
    pickupTime: input.pickupTime,
    packagingFeeIncluded: input.breakdown.packagingFee > 0,
    appliedVoucherId: input.voucher?.id,
    status: "pending_payment",
    statusHistory: [{ status: "pending_payment", at: nowIso }],
    payment: { method: input.paymentMethod, status: "pending", transactions: [] },
    memberPriceApplied: items.some((i) => i.memberPriceApplied),
    placedAt: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/** Next status in the pickup lifecycle, or null if terminal. */
export function nextStatus(status: Order["status"]): Order["status"] | null {
  const flow: Order["status"][] = ["paid", "making", "ready", "completed"];
  const idx = flow.indexOf(status);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
}

