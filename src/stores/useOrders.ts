import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ID, Order, PaymentMethod, PaymentStatus, PaymentTransaction } from "@/types";
import { PERSIST_KEY, SCHEMA_VERSION } from "@/lib/config";
import { nextStatus } from "@/lib/order";

const txId = () => `pay_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getById: (id: ID) => Order | undefined;
  /** Records a payment attempt. On success, advances order to "paid". */
  pay: (orderId: ID, method: PaymentMethod, outcome: Extract<PaymentStatus, "success" | "failed" | "cancelled">) => void;
  advanceStatus: (orderId: ID) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      getById: (id) => get().orders.find((o) => o.id === id),
      pay: (orderId, method, outcome) => {
        const now = new Date().toISOString();
        set({
          orders: get().orders.map((o) => {
            if (o.id !== orderId) return o;
            if (o.status !== "pending_payment" || o.payment.status === "success") return o;
            const attemptNo = o.payment.transactions.length + 1;
            const tx: PaymentTransaction = {
              id: txId(),
              orderId,
              method,
              amount: o.price.grandTotal,
              status: outcome,
              attemptNo,
              createdAt: now,
            };
            const transactions = [...o.payment.transactions, tx];
            if (outcome === "success") {
              return {
                ...o,
                status: "paid",
                statusHistory: [...o.statusHistory, { status: "paid", at: now }],
                payment: { ...o.payment, method, status: "success", transactions, paidAt: now },
                updatedAt: now,
              };
            }
            return { ...o, payment: { ...o.payment, method, status: outcome, transactions }, updatedAt: now };
          }),
        });
      },
      advanceStatus: (orderId) => {
        const now = new Date().toISOString();
        set({
          orders: get().orders.map((o) => {
            if (o.id !== orderId) return o;
            const ns = nextStatus(o.status);
            if (!ns) return o;
            return { ...o, status: ns, statusHistory: [...o.statusHistory, { status: ns, at: now }], updatedAt: now };
          }),
        });
      },
    }),
    { name: `${PERSIST_KEY}_orders`, version: SCHEMA_VERSION },
  ),
);

