export type ID = string;
export type Centavos = number; // ₱170.00 -> 17000
export type ISODateTime = string;
export type CurrencyCode = "PHP";
export type LocaleCode = "en" | "zh";

export interface I18nText {
  en: string;
  zh: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface PostalAddress {
  line1: I18nText;
  barangay?: string;
  city: string;
  province: string;
  region?: string;
  postalCode?: string;
  country: "PH";
  formatted?: I18nText;
}

export interface AuditFields {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ImageAsset {
  url: string;
  alt: I18nText;
  width?: number;
  height?: number;
}

export interface OpeningHour {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  open: string; // "10:00"
  close: string; // "22:00"
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
