export const StoreStatus = {
  Open: "open",
  Busy: "busy",
  Closed: "closed",
  ComingSoon: "coming_soon",
} as const;
export type StoreStatus = (typeof StoreStatus)[keyof typeof StoreStatus];

export const ServiceType = { Pickup: "pickup", Delivery: "delivery" } as const;
export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];

export const ProductTag = {
  New: "new",
  Hot: "hot",
  Recommended: "recommended",
  Seasonal: "seasonal",
} as const;
export type ProductTag = (typeof ProductTag)[keyof typeof ProductTag];

export const SpecPriceMode = { Base: "base", Addon: "addon" } as const;
export type SpecPriceMode = (typeof SpecPriceMode)[keyof typeof SpecPriceMode];

export const SpecSelectType = { Single: "single", Multi: "multi" } as const;
export type SpecSelectType = (typeof SpecSelectType)[keyof typeof SpecSelectType];

export const MembershipTier = { Friend: "friend", Silver: "silver", Gold: "gold" } as const;
export type MembershipTier = (typeof MembershipTier)[keyof typeof MembershipTier];

export const PaymentMethod = {
  GCash: "gcash",
  Maya: "maya",
  QRPh: "qrph",
  Card: "card",
  CashOnPickup: "cash_on_pickup",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  Pending: "pending",
  Success: "success",
  Failed: "failed",
  Cancelled: "cancelled",
  Refunded: "refunded",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const OrderStatus = {
  PendingPayment: "pending_payment",
  Paid: "paid",
  Making: "making",
  Ready: "ready",
  Completed: "completed",
  Cancelled: "cancelled",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const VoucherType = { Amount: "amount", Percent: "percent" } as const;
export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];
