import type { AuditFields, Centavos, ID, I18nText, ImageAsset } from "./common";
import type { ProductTag, SpecPriceMode, SpecSelectType } from "./enums";

export interface Category extends AuditFields {
  id: ID;
  name: I18nText;
  icon?: ImageAsset;
  sortOrder: number;
  kind: "beverage" | "merchandise";
  isActive: boolean;
}

export interface SpecOption {
  id: ID;
  label: I18nText;
  priceMode: SpecPriceMode;
  retailPrice: Centavos; // base: base price; addon: delta (may be 0)
  memberPrice?: Centavos | null; // empty or 0 -> falls back to retailPrice
  isDefault?: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface SpecGroup {
  id: ID;
  name: I18nText;
  priceMode: SpecPriceMode;
  selectType: SpecSelectType;
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: SpecOption[];
  sortOrder: number;
}

export interface Product extends AuditFields {
  id: ID;
  sku: string;
  categoryId: ID;
  name: I18nText;
  description: I18nText;
  teaBase?: I18nText;
  sellingPoints?: I18nText[];
  image: ImageAsset;
  gallery?: ImageAsset[];
  tags: ProductTag[];
  specGroups: SpecGroup[]; // exactly one base+single group for beverages
  allowRemark: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface StoreCatalogEntry {
  storeId: ID;
  productId: ID;
  isAvailable: boolean;
  isSoldOut: boolean;
  priceOverride?: Centavos | null;
  soldOutOptionIds?: ID[];
}
