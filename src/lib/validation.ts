import type { Cart, CartLine, Store } from "@/types";
import { productById, storeById, getStoreEntry } from "@/data";

export const MAX_QUANTITY = 99;
export function canOrderAt(store?: Store): boolean {
  return !!store && store.isActive && ["open", "busy"].includes(store.status) && store.serviceTypes.includes("pickup");
}
/** Shared by product configuration, cart mutations and checkout. */
export function validateLine(storeId: string | null, line: Pick<CartLine, "productId" | "selectedOptionIds" | "quantity">): string | null {
  if (!storeId || !canOrderAt(storeById[storeId])) return "validation.store";
  const product = productById[line.productId];
  const entry = getStoreEntry(storeId, line.productId);
  if (!product?.isActive || entry?.isAvailable === false || entry?.isSoldOut) return "validation.unavailable";
  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY) return "validation.quantity";
  const ids = line.selectedOptionIds;
  if (new Set(ids).size !== ids.length) return "validation.options";
  const options = product.specGroups.flatMap(g => g.options);
  if (ids.some(id => !options.some(o => o.id === id && o.isAvailable) || entry?.soldOutOptionIds?.includes(id))) return "validation.options";
  for (const group of product.specGroups) {
    const count = group.options.filter(o => ids.includes(o.id)).length;
    if ((group.required && count === 0) || (group.selectType === "single" && count > 1) || (group.maxSelect && count > group.maxSelect)) return "validation.options";
  }
  return null;
}
export function validateCart(cart: Cart): string | null {
  const selected = cart.lines.filter(l => l.isSelected);
  if (!selected.length) return "cart.selectItems";
  for (const line of selected) {
    const error = validateLine(cart.storeId, line);
    if (error) return error;
  }
  return null;
}
export function defaultOptions(productId: string, storeId: string | null): string[] {
  const product = productById[productId];
  const unavailable = storeId ? getStoreEntry(storeId, productId)?.soldOutOptionIds ?? [] : [];
  return product?.specGroups.flatMap(g => {
    const enabled = g.options.filter(o => o.isAvailable && !unavailable.includes(o.id));
    if (g.selectType === "single") {
      const option = enabled.find(o => o.isDefault) ?? (g.required ? enabled[0] : undefined);
      return option ? [option.id] : [];
    }
    return enabled.filter(o => o.isDefault).slice(0, g.maxSelect).map(o => o.id);
  }) ?? [];
}
