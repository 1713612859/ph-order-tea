import type { Category } from "@/types";

const TS = "2026-09-01T00:00:00.000Z";

export const categories: Category[] = [
  { id: "cat_matcha", name: { en: "Matcha Series", zh: "抹茶系列" }, sortOrder: 1, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_milk_tea", name: { en: "Fresh Milk Tea", zh: "鲜奶茶" }, sortOrder: 2, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_fruit_tea", name: { en: "Fresh Fruit Tea", zh: "鲜果茶" }, sortOrder: 3, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_snow_cap", name: { en: "Snow Cap Milk Tea", zh: "雪顶奶茶" }, sortOrder: 4, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_teaspresso", name: { en: "Teaspresso Latte", zh: "茶浓缩拿铁" }, sortOrder: 5, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_frappe", name: { en: "Teaspresso Frappé", zh: "茶浓缩冰沙" }, sortOrder: 6, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_brewed", name: { en: "Brewed Tea", zh: "原叶茶" }, sortOrder: 7, kind: "beverage", isActive: true, createdAt: TS, updatedAt: TS },
  { id: "cat_merch", name: { en: "Merchandise", zh: "周边商品" }, sortOrder: 8, kind: "merchandise", isActive: true, createdAt: TS, updatedAt: TS },
];

/** UI accent per category (tea-technology-style tint for thumbnails). */
export const categoryAccent: Record<string, string> = {
  cat_matcha: "#6E8B4E",
  cat_milk_tea: "#B98A5E",
  cat_fruit_tea: "#D98324",
  cat_snow_cap: "#7C93B0",
  cat_teaspresso: "#8A6D3B",
  cat_frappe: "#5C8AA6",
  cat_brewed: "#4E7C59",
  cat_merch: "#94795D",
};
