import type {
  AuditFields,
  Centavos,
  CurrencyCode,
  ID,
  I18nText,
  ISODateTime,
  ImageAsset,
  PostalAddress,
} from "./common";
import type { OrderStatus, PaymentMethod, PaymentStatus, ServiceType } from "./enums";

export interface OrderItemSnapshot {
  productId: ID;
  productName: I18nText;
  image: ImageAsset;
  quantity: number;
  selectedOptions: Array<{
    groupName: I18nText;
    optionLabel: I18nText;
    unitPrice: Centavos;
  }>;
  remark?: string;
  lineSubtotal: Centavos;
  memberPriceApplied: boolean;
}

export interface OrderPriceBreakdown {
  currency: CurrencyCode;
  itemsSubtotal: Centavos;
  packagingFee: Centavos;
  voucherDiscount: Centavos;
  discountTotal: Centavos;
  grandTotal: Centavos;
  vatRate: number;
  vatableSales: Centavos;
  vatAmount: Centavos;
}

export interface PickupTimeSlot {
  type: "asap" | "scheduled";
  scheduledAt?: ISODateTime;
  label: I18nText;
}

export interface PickupInfo {
  pickupNumber: string;
  storeId: ID;
  storeName: I18nText;
  storeAddress: PostalAddress;
  estimatedReadyAt?: ISODateTime;
}

export interface PaymentTransaction {
  id: ID;
  orderId: ID;
  method: PaymentMethod;
  amount: Centavos;
  status: PaymentStatus;
  attemptNo: number;
  createdAt: ISODateTime;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: ISODateTime;
  note?: I18nText;
}

export interface Order extends AuditFields {
  id: ID;
  orderNo: string;
  memberId: ID | null;
  serviceType: ServiceType;
  items: OrderItemSnapshot[];
  price: OrderPriceBreakdown;
  pickup: PickupInfo;
  pickupTime: PickupTimeSlot;
  packagingFeeIncluded: boolean;
  appliedVoucherId?: ID;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactions: PaymentTransaction[];
    paidAt?: ISODateTime;
  };
  memberPriceApplied: boolean;
  placedAt: ISODateTime;
}

export interface OrderListQuery {
  memberId: ID | null;
  status?: OrderStatus | "all";
  page?: number;
  pageSize?: number;
}
