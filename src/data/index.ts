import type { Category, Product, SpecOption, Store, StoreCatalogEntry, Voucher } from "@/types";
import { categories } from "./categories";
import { products, merchandisePrice } from "./products";
import { stores, storeCatalog } from "./stores";
import { vouchers } from "./members";

export { categories, categoryAccent } from "./categories";
export { products, merchandisePrice } from "./products";
export { stores, storeCatalog } from "./stores";
export { demoMember, vouchers, PERCENT_VOUCHER_CAP } from "./members";

export const productById: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]));
export const categoryById: Record<string, Category> = Object.fromEntries(categories.map((c) => [c.id, c]));
export const storeById: Record<string, Store> = Object.fromEntries(stores.map((s) => [s.id, s]));

/** All spec options flattened, for quick label/price lookup by option id. */
export const optionById: Record<string, SpecOption> = Object.fromEntries(
  products.flatMap((p) => p.specGroups.flatMap((g) => g.options.map((o) => [o.id, o] as const))),
);

export function getStoreEntry(storeId: string, productId: string): StoreCatalogEntry | undefined {
  return storeCatalog.find((e) => e.storeId === storeId && e.productId === productId);
}

export function getMerchandisePrice(productId: string): number {
  return merchandisePrice[productId] ?? 0;
}

export function getVoucherById(id: string): Voucher | undefined {
  return vouchers.find((v) => v.id === id);
}
