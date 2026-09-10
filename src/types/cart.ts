import type { ID, ISODateTime } from "./common";
import type { ServiceType } from "./enums";

export interface CartLine {
  lineId: ID;
  productId: ID;
  quantity: number;
  selectedOptionIds: ID[];
  remark?: string;
  isSelected: boolean;
  addedAt: ISODateTime;
}

export interface Cart {
  storeId: ID | null;
  serviceType: ServiceType;
  lines: CartLine[];
  updatedAt: ISODateTime;
}
