import type { Cart, CartLine, Centavos, OrderPriceBreakdown, Product, Voucher } from "@/types";
import { getMerchandisePrice, optionById, productById, PERCENT_VOUCHER_CAP } from "@/data";
import { VAT_RATE } from "./config";

/** Unit price for a product given selected options and member mode. */
export function calcUnitPrice(product: Product, selectedOptionIds: string[], memberMode: boolean): Centavos {
  const selected = new Set(selectedOptionIds);
  const baseGroup = product.specGroups.find((g) => g.priceMode === "base");

  let base = 0;
  if (baseGroup) {
    const chosen = baseGroup.options.find((o) => selected.has(o.id)) ?? baseGroup.options.find((o) => o.isDefault) ?? baseGroup.options[0];
    if (chosen) {
      base = memberMode && chosen.memberPrice != null && chosen.memberPrice >= 0 ? chosen.memberPrice : chosen.retailPrice;
    }
  } else {
    // merchandise or drinks without a base group
    base = getMerchandisePrice(product.id);
  }

  let addons = 0;
  for (const g of product.specGroups) {
    if (g.priceMode !== "addon") continue;
    for (const o of g.options) {
      if (selected.has(o.id)) addons += o.retailPrice;
    }
  }
  return base + addons;
}

export function calcLineTotal(line: CartLine, memberMode: boolean): Centavos {
  const product = productById[line.productId];
  if (!product) return 0;
  return calcUnitPrice(product, line.selectedOptionIds, memberMode) * line.quantity;
}

/** Human-readable summary of chosen options, e.g. "Regular, Normal Sweet, Normal Ice". */
export function optionSummary(line: CartLine, locale: "en" | "zh"): string {
  return line.selectedOptionIds
    .map((id) => optionById[id]?.label[locale])
    .filter(Boolean)
    .join(locale === "zh" ? "，" : ", ");
}

export function selectedLines(cart: Cart): CartLine[] {
  return cart.lines.filter((l) => l.isSelected);
}

export function cartSelectedTotal(cart: Cart, memberMode: boolean): Centavos {
  return selectedLines(cart).reduce((sum, l) => sum + calcLineTotal(l, memberMode), 0);
}

export function cartTotalQuantity(cart: Cart): number {
  return cart.lines.reduce((n, l) => n + l.quantity, 0);
}

/** Compute the discount a voucher yields against an items subtotal (centavos). 0 if ineligible. */
export function voucherDiscount(voucher: Voucher | undefined, itemsSubtotal: Centavos, context: VoucherContext = {}): Centavos {
  if (!voucher || !isVoucherEligible(voucher, itemsSubtotal, context)) return 0;
  if (voucher.type === "amount") return Math.min(voucher.value, itemsSubtotal);
  // percent
  const raw = Math.round((itemsSubtotal * voucher.value) / 100);
  const cap = PERCENT_VOUCHER_CAP[voucher.id];
  return Math.min(cap ?? raw, raw, itemsSubtotal);
}

export interface VoucherContext {
  memberId?: string | null;
  storeId?: string | null;
  productIds?: string[];
  unavailableVoucherIds?: string[];
  now?: number;
}
export function isVoucherEligible(voucher: Voucher, itemsSubtotal: Centavos, context: VoucherContext = {}): boolean {
  const now = context.now ?? Date.now();
  return !voucher.isUsed && !context.unavailableVoucherIds?.includes(voucher.id)
    && now >= Date.parse(voucher.validFrom) && now <= Date.parse(voucher.validTo)
    && (!voucher.memberId || voucher.memberId === context.memberId)
    && (!voucher.minSpend || itemsSubtotal >= voucher.minSpend)
    && (!voucher.applicableStoreIds?.length || !!context.storeId && voucher.applicableStoreIds.includes(context.storeId))
    && (!voucher.applicableProductIds?.length || !!context.productIds?.length && context.productIds.every(id => voucher.applicableProductIds!.includes(id)));
}

/** VAT is embedded in the (inclusive) grand total, never added on top. */
export function breakdownVat(totalInclusive: Centavos): { vatableSales: Centavos; vatAmount: Centavos } {
  const vatableSales = Math.round(totalInclusive / (1 + VAT_RATE));
  return { vatableSales, vatAmount: totalInclusive - vatableSales };
}

export interface CheckoutInput {
  cart: Cart;
  memberMode: boolean;
  packagingFeeAmount: Centavos; // 0 if unchecked
  voucher?: Voucher;
  voucherContext?: VoucherContext;
}

export function calcCheckout(input: CheckoutInput): OrderPriceBreakdown {
  const itemsSubtotal = cartSelectedTotal(input.cart, input.memberMode);
  const packagingFee = input.packagingFeeAmount;
  const discount = voucherDiscount(input.voucher, itemsSubtotal, { ...input.voucherContext, storeId: input.cart.storeId, productIds: selectedLines(input.cart).map(l => l.productId) });
  const grandTotal = Math.max(0, itemsSubtotal + packagingFee - discount);
  const { vatableSales, vatAmount } = breakdownVat(grandTotal);
  return {
    currency: "PHP",
    itemsSubtotal,
    packagingFee,
    voucherDiscount: discount,
    discountTotal: discount,
    grandTotal,
    vatRate: VAT_RATE,
    vatableSales,
    vatAmount,
  };
}
