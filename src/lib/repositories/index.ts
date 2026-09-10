/**
 * Repository layer. Pages depend on these functions, not on the raw mock data,
 * so a future REST/GraphQL backend can be swapped in without touching pages.
 * Kept synchronous for the prototype; signatures can become async later.
 */
import type { Category, ID, Product, Store, StoreWithDistance, Voucher } from "@/types";
import {
  categories,
  getStoreEntry,
  productById,
  products,
  storeById,
  stores,
  vouchers as allVouchers,
} from "@/data";

function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Simulated user location: central Quezon City (so distances read a few km).
const USER_GEO = { latitude: 14.676, longitude: 121.0437 };

export const storeRepo = {
  listNearby(favoriteIds: ID[] = []): StoreWithDistance[] {
    return stores
      .filter((s) => s.isActive)
      .map((store) => ({ store, distanceKm: haversineKm(USER_GEO, store.geo), isFavorite: favoriteIds.includes(store.id) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },
  search(keyword: string, favoriteIds: ID[] = []): StoreWithDistance[] {
    const k = keyword.trim().toLowerCase();
    return this.listNearby(favoriteIds).filter(
      (s) => !k || s.store.name.en.toLowerCase().includes(k) || s.store.name.zh.includes(keyword),
    );
  },
  getById(id: ID): Store | undefined {
    return storeById[id];
  },
};

export interface AvailableProduct {
  product: Product;
  isSoldOut: boolean;
  soldOutOptionIds: string[];
}

export const catalogRepo = {
  listCategories(): Category[] {
    return categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  },
  listProducts(storeId: ID | null): AvailableProduct[] {
    return products
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((product) => {
        const entry = storeId ? getStoreEntry(storeId, product.id) : undefined;
        return {
          product,
          isSoldOut: entry?.isSoldOut ?? false,
          soldOutOptionIds: entry?.soldOutOptionIds ?? [],
        };
      })
      .filter((ap) => {
        if (!storeId) return true;
        const entry = getStoreEntry(storeId, ap.product.id);
        return entry ? entry.isAvailable : true;
      });
  },
  getProduct(id: ID): Product | undefined {
    return productById[id];
  },
  getAvailability(storeId: ID | null, productId: ID): { isSoldOut: boolean; soldOutOptionIds: string[] } {
    const entry = storeId ? getStoreEntry(storeId, productId) : undefined;
    return { isSoldOut: entry?.isSoldOut ?? false, soldOutOptionIds: entry?.soldOutOptionIds ?? [] };
  },
};

export const voucherRepo = {
  listAvailable(): Voucher[] {
    return allVouchers.filter((v) => !v.isUsed);
  },
};
