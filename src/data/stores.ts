import type { Store, StoreCatalogEntry } from "@/types";

const TS = "2026-09-10T06:00:00.000Z";
const LOGO = { url: "/icons/pwa-192.png", alt: { en: "ChaTea", zh: "ChaTea" } };

export const stores: Store[] = [
  {
    id: "store_sm_fairview",
    code: "PH-QC-001",
    name: { en: "SM City Fairview", zh: "SM 城市菲尔维尤店" },
    logo: LOGO,
    storefrontImage: { url: "", alt: { en: "SM City Fairview store", zh: "菲尔维尤门店" } },
    address: {
      line1: { en: "Ground Floor, SM City Fairview, Quirino Highway cor. Regalado Avenue, Fairview", zh: "SM 城市菲尔维尤商场一层，Quirino 高速与 Regalado 大道交口，Fairview" },
      barangay: "Fairview",
      city: "Quezon City",
      province: "Metro Manila",
      region: "NCR",
      postalCode: "1118",
      country: "PH",
      formatted: {
        en: "Ground Floor, SM City Fairview, Quirino Highway cor. Regalado Avenue, Fairview, Quezon City",
        zh: "SM 城市菲尔维尤商场一层，Quirino 高速与 Regalado 大道交口，奎松市",
      },
    },
    geo: { latitude: 14.7349, longitude: 121.0575 },
    status: "open",
    serviceTypes: ["pickup"],
    openingHours: Array.from({ length: 7 }, (_, d) => ({ dayOfWeek: d as 0 | 1 | 2 | 3 | 4 | 5 | 6, open: "10:00", close: "22:00" })),
    contact: { phone: "+63 2 8888 1001" },
    liveOps: { preparingCups: 3, estimatedMinutes: 2, updatedAt: TS },
    amenities: [{ en: "Dine-in", zh: "堂食" }, { en: "Air-conditioned", zh: "空调" }],
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  },
  {
    id: "store_sm_north_edsa",
    code: "PH-QC-002",
    name: { en: "SM City North EDSA", zh: "SM 城市北 EDSA 店" },
    logo: LOGO,
    storefrontImage: { url: "", alt: { en: "SM City North EDSA store", zh: "北 EDSA 门店" } },
    address: {
      line1: { en: "2nd Floor, City Center, SM City North EDSA, EDSA cor. North Avenue, Barangay Bagong Pag-asa", zh: "SM 城市北 EDSA 商场二层城市中心，EDSA 与北大道交口，Bagong Pag-asa" },
      barangay: "Bagong Pag-asa",
      city: "Quezon City",
      province: "Metro Manila",
      region: "NCR",
      postalCode: "1105",
      country: "PH",
      formatted: {
        en: "2nd Floor, City Center, SM City North EDSA, EDSA cor. North Avenue, Quezon City",
        zh: "SM 城市北 EDSA 商场二层城市中心，EDSA 与北大道交口，奎松市",
      },
    },
    geo: { latitude: 14.6566, longitude: 121.0301 },
    status: "busy",
    serviceTypes: ["pickup"],
    openingHours: Array.from({ length: 7 }, (_, d) => ({ dayOfWeek: d as 0 | 1 | 2 | 3 | 4 | 5 | 6, open: "10:00", close: "22:00" })),
    contact: { phone: "+63 2 8888 1002" },
    liveOps: { preparingCups: 22, estimatedMinutes: 11, updatedAt: TS },
    amenities: [{ en: "Dine-in", zh: "堂食" }],
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  },
  {
    id: "store_trinoma",
    code: "PH-QC-003",
    name: { en: "TriNoma", zh: "TriNoma 店" },
    logo: LOGO,
    storefrontImage: { url: "", alt: { en: "TriNoma store", zh: "TriNoma 门店" } },
    address: {
      line1: { en: "Level 1, Activity Center, Ayala Malls TriNoma, EDSA cor. North Avenue, Brgy. Bagong Pag-asa", zh: "Ayala Malls TriNoma 一层活动中心，EDSA 与北大道交口，Bagong Pag-asa" },
      barangay: "Bagong Pag-asa",
      city: "Quezon City",
      province: "Metro Manila",
      region: "NCR",
      postalCode: "1105",
      country: "PH",
      formatted: {
        en: "Level 1, Activity Center, Ayala Malls TriNoma, EDSA cor. North Avenue, Quezon City",
        zh: "Ayala Malls TriNoma 一层活动中心，EDSA 与北大道交口，奎松市",
      },
    },
    geo: { latitude: 14.6539, longitude: 121.0326 },
    status: "open",
    serviceTypes: ["pickup"],
    openingHours: Array.from({ length: 7 }, (_, d) => ({ dayOfWeek: d as 0 | 1 | 2 | 3 | 4 | 5 | 6, open: "10:00", close: "22:00" })),
    contact: { phone: "+63 2 8888 1003" },
    liveOps: { preparingCups: 3, estimatedMinutes: 2, updatedAt: TS },
    amenities: [{ en: "Dine-in", zh: "堂食" }, { en: "WiFi", zh: "WiFi" }],
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  },
];

/**
 * Store-product availability. Only exceptions are listed; anything not present
 * is considered available. Demonstrates per-store sold-out state.
 */
export const storeCatalog: StoreCatalogEntry[] = [
  // North EDSA: one drink sold out, and Hot option sold out on another
  { storeId: "store_sm_north_edsa", productId: "prod_choco_cookie_matcha_frappe", isAvailable: true, isSoldOut: true },
  { storeId: "store_sm_north_edsa", productId: "prod_taro_milk_tea", isAvailable: true, isSoldOut: false, soldOutOptionIds: ["tp_hot"] },
  // TriNoma: tumbler out of stock
  { storeId: "store_trinoma", productId: "prod_tumbler", isAvailable: true, isSoldOut: true },
];
