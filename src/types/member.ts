import type { AuditFields, Centavos, ID, I18nText, ISODateTime, ImageAsset } from "./common";
import type { MembershipTier, VoucherType } from "./enums";

export interface Member extends AuditFields {
  id: ID;
  phone: string;
  email?: string;
  name?: string;
  avatar?: ImageAsset;
  gender?: "male" | "female" | "prefer_not_to_say";
  birthday?: string;
  region: "PH";
  tier: MembershipTier;
  points: number;
  favoriteStoreIds: ID[];
  registeredAt: ISODateTime;
  isActive: boolean;
}

export interface AuthSession {
  memberId: ID | null;
  isLoggedIn: boolean;
  loginAt?: ISODateTime;
}

export interface Voucher extends AuditFields {
  id: ID;
  memberId: ID | null;
  title: I18nText;
  type: VoucherType;
  value: number; // amount: centavos; percent: 0-100
  minSpend?: Centavos;
  applicableStoreIds?: ID[];
  applicableProductIds?: ID[];
  validFrom: ISODateTime;
  validTo: ISODateTime;
  isUsed: boolean;
  usedOrderId?: ID;
}
