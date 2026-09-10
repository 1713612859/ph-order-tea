import type { Member, Voucher } from "@/types";

const TS = "2026-09-01T00:00:00.000Z";

/** Demo member — "logged in" via simulated OTP for any +63 number in this prototype. */
export const demoMember: Member = {
  id: "mbr_demo",
  phone: "+63 917 000 0000",
  email: "demo@chatea.ph",
  name: "Juan Dela Cruz",
  gender: "prefer_not_to_say",
  region: "PH",
  tier: "gold",
  points: 320,
  favoriteStoreIds: ["store_sm_fairview"],
  registeredAt: "2025-03-14T00:00:00.000Z",
  isActive: true,
  createdAt: "2025-03-14T00:00:00.000Z",
  updatedAt: TS,
};

/** Vouchers available to the demo member (mock). */
export const vouchers: Voucher[] = [
  {
    id: "vou_p50",
    memberId: null,
    title: { en: "₱50 OFF (min. spend ₱150)", zh: "满 ₱150 减 ₱50" },
    type: "amount",
    value: 5000,
    minSpend: 15000,
    validFrom: "2026-09-01T00:00:00.000Z",
    validTo: "2026-12-31T23:59:59.000Z",
    isUsed: false,
    createdAt: TS,
    updatedAt: TS,
  },
  {
    id: "vou_10pct",
    memberId: null,
    title: { en: "10% OFF (max ₱40)", zh: "9 折（最高减 ₱40）" },
    type: "percent",
    value: 10,
    minSpend: 0,
    validFrom: "2026-09-01T00:00:00.000Z",
    validTo: "2026-12-31T23:59:59.000Z",
    isUsed: false,
    createdAt: TS,
    updatedAt: TS,
  },
];

/** Percent-voucher discount is capped at this amount (centavos). */
export const PERCENT_VOUCHER_CAP: Record<string, number> = {
  vou_10pct: 4000,
};
