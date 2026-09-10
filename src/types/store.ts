import type {
  AuditFields,
  GeoPoint,
  ID,
  I18nText,
  ImageAsset,
  OpeningHour,
  PostalAddress,
  ISODateTime,
} from "./common";
import type { ServiceType, StoreStatus } from "./enums";

export interface Store extends AuditFields {
  id: ID;
  code: string;
  name: I18nText;
  logo: ImageAsset;
  storefrontImage: ImageAsset;
  gallery?: ImageAsset[];
  address: PostalAddress;
  geo: GeoPoint;
  status: StoreStatus;
  serviceTypes: ServiceType[];
  openingHours: OpeningHour[];
  contact: { phone?: string; email?: string };
  liveOps: {
    preparingCups: number;
    estimatedMinutes: number;
    updatedAt: ISODateTime;
  };
  amenities?: I18nText[];
  isActive: boolean;
}

export interface StoreWithDistance {
  store: Store;
  distanceKm: number;
  isFavorite: boolean;
}
