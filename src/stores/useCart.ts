import { validateLine, canOrderAt, MAX_QUANTITY } from "@/lib/validation";
import { storeById } from "@/data";
import { useAuth } from "./useAuth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartLine, ID } from "@/types";
import { PERSIST_KEY, SCHEMA_VERSION } from "@/lib/config";

const emptyCart = (): Cart => ({
  storeId: null,
  serviceType: "pickup",
  lines: [],
  updatedAt: new Date().toISOString(),
});

const lineId = () => `line_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Two lines merge only if same product + same options + same remark. */
function sameConfig(a: Omit<CartLine, "lineId" | "quantity" | "isSelected" | "addedAt">, b: CartLine): boolean {
  if (a.productId !== b.productId) return false;
  if ((a.remark ?? "") !== (b.remark ?? "")) return false;
  const as = [...a.selectedOptionIds].sort().join(",");
  const bs = [...b.selectedOptionIds].sort().join(",");
  return as === bs;
}

interface CartState {
  cart: Cart;
  /** Sets active store; if switching to a different store, clears the cart. Returns true if cleared. */
  setStore: (storeId: ID) => boolean;
  needsStoreSwitchConfirm: (storeId: ID) => boolean;
  addLine: (input: { productId: ID; selectedOptionIds: ID[]; quantity: number; remark?: string }) => void;
  updateLine: (lineId: ID, patch: Partial<Pick<CartLine, "selectedOptionIds" | "remark" | "quantity">>) => void;
  setQuantity: (lineId: ID, quantity: number) => void;
  removeLine: (lineId: ID) => void;
  setSelected: (lineId: ID, selected: boolean) => void;
  setAllSelected: (selected: boolean) => void;
  removeSelected: () => void;
  clear: () => void;
  reset: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: emptyCart(),
      needsStoreSwitchConfirm: (storeId) => {
        const { cart } = get();
        return cart.storeId !== null && cart.storeId !== storeId && cart.lines.length > 0;
      },
      setStore: (storeId) => {
        if (!canOrderAt(storeById[storeId])) return false;
        const { cart } = get();
        const switching = cart.storeId !== null && cart.storeId !== storeId && cart.lines.length > 0;
        if (switching) {
          set({ cart: { ...emptyCart(), storeId } });
          return true;
        }
        set({ cart: { ...cart, storeId, updatedAt: new Date().toISOString() } });
        return false;
      },
      addLine: ({ productId, selectedOptionIds, quantity, remark }) => {
        if (!useAuth.getState().isLoggedIn) return;
        const { cart } = get();
        if (validateLine(cart.storeId, { productId, selectedOptionIds, quantity })) return;
        const existing = cart.lines.find((l) => sameConfig({ productId, selectedOptionIds, remark }, l));
        let lines: CartLine[];
        if (existing) {
          lines = cart.lines.map((l) => (l.lineId === existing.lineId ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity), isSelected: true } : l));
        } else {
          lines = [
            ...cart.lines,
            { lineId: lineId(), productId, selectedOptionIds, quantity, remark, isSelected: true, addedAt: new Date().toISOString() },
          ];
        }
        set({ cart: { ...cart, lines, updatedAt: new Date().toISOString() } });
      },
      updateLine: (id, patch) => {
        if (!useAuth.getState().isLoggedIn) return;
        const { cart } = get();
        const original = cart.lines.find(l => l.lineId === id);
        if (!original) return;
        const updated = { ...original, ...patch };
        if (validateLine(cart.storeId, updated)) return;
        const duplicate = cart.lines.find(l => l.lineId !== id && sameConfig(updated, l));
        if (duplicate && duplicate.quantity + updated.quantity > MAX_QUANTITY) return;
        const lines = duplicate ? cart.lines.filter(l => l.lineId !== id).map(l => l.lineId === duplicate.lineId ? { ...l, quantity: l.quantity + updated.quantity, isSelected: l.isSelected || updated.isSelected } : l) : cart.lines.map(l => l.lineId === id ? updated : l);
        set({ cart: { ...cart, lines, updatedAt: new Date().toISOString() } });
      },
      setQuantity: (id, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) return;
        const existing = get().cart.lines.find((line) => line.lineId === id);
        if (existing && quantity > existing.quantity && validateLine(get().cart.storeId, {...existing, quantity})) return;
        if (!useAuth.getState().isLoggedIn && existing && quantity > existing.quantity) return;
        const { cart } = get();
        if (quantity <= 0) {
          set({ cart: { ...cart, lines: cart.lines.filter((l) => l.lineId !== id), updatedAt: new Date().toISOString() } });
          return;
        }
        set({ cart: { ...cart, lines: cart.lines.map((l) => (l.lineId === id ? { ...l, quantity } : l)), updatedAt: new Date().toISOString() } });
      },
      removeLine: (id) => {
        const { cart } = get();
        set({ cart: { ...cart, lines: cart.lines.filter((l) => l.lineId !== id), updatedAt: new Date().toISOString() } });
      },
      setSelected: (id, selected) => {
        const { cart } = get();
        set({ cart: { ...cart, lines: cart.lines.map((l) => (l.lineId === id ? { ...l, isSelected: selected } : l)), updatedAt: new Date().toISOString() } });
      },
      setAllSelected: (selected) => {
        const { cart } = get();
        set({ cart: { ...cart, lines: cart.lines.map((l) => ({ ...l, isSelected: selected })), updatedAt: new Date().toISOString() } });
      },
      removeSelected: () => {
        const { cart } = get();
        set({ cart: { ...cart, lines: cart.lines.filter((l) => !l.isSelected), updatedAt: new Date().toISOString() } });
      },
      clear: () => {
        const { cart } = get();
        set({ cart: { ...emptyCart(), storeId: cart.storeId } });
      },
      reset: () => set({ cart: emptyCart() }),
    }),
    { name: `${PERSIST_KEY}_cart`, version: SCHEMA_VERSION },
  ),
);

