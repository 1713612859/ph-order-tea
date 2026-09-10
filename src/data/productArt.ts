/**
 * Per-product vector artwork descriptors. Gives every SKU a distinct look
 * (cup style, liquid colour, cap, garnish) instead of one shared glyph.
 */
export type CupStyle = "clear" | "porcelain";
export type CapStyle = "snow" | "foam" | null;
export type Garnish = "leaf" | "matcha" | "peach" | "mango" | "lychee" | "passion" | "cookie" | "pearls" | "grain" | "none";

export interface TeaArt {
  cup: CupStyle;
  /** [upper, lower] liquid colours. */
  liquid: [string, string];
  cap: CapStyle;
  garnish: Garnish;
  /** Background wash behind the cup. */
  wash: string;
}

const ART: Record<string, TeaArt> = {
  // Matcha — clear cups, layered green
  prod_signature_matcha_latte: { cup: "clear", liquid: ["#8FBF63", "#F4F6EC"], cap: null, garnish: "matcha", wash: "#E8F0DC" },
  prod_jasmine_matcha: { cup: "clear", liquid: ["#94C169", "#7FAE55"], cap: null, garnish: "leaf", wash: "#E6EFD8" },
  prod_choco_cookie_matcha_frappe: { cup: "clear", liquid: ["#CFE0B4", "#A8C489"], cap: "snow", garnish: "cookie", wash: "#EDF1E2" },

  // Fresh Milk Tea — blue porcelain paper cups
  prod_classic_milk_tea: { cup: "porcelain", liquid: ["#C9A07A", "#B98A5E"], cap: null, garnish: "leaf", wash: "#EDE7DD" },
  prod_brown_sugar_milk_tea: { cup: "porcelain", liquid: ["#B07B4F", "#8B5A32"], cap: null, garnish: "pearls", wash: "#EFE4D6" },
  prod_taro_milk_tea: { cup: "porcelain", liquid: ["#C9B6DC", "#A88FC4"], cap: null, garnish: "grain", wash: "#EDE7F1" },

  // Fruit tea — clear cups, bright fruit
  prod_mango_fruit_tea: { cup: "clear", liquid: ["#F7C24B", "#EFA028"], cap: null, garnish: "mango", wash: "#F6EBD3" },
  prod_lychee_oolong: { cup: "clear", liquid: ["#F0DCC4", "#DFC09A"], cap: null, garnish: "lychee", wash: "#F2E8DC" },
  prod_passion_fruit: { cup: "clear", liquid: ["#F5B833", "#D98324"], cap: null, garnish: "passion", wash: "#F5E9D2" },

  // Snow cap — white cheese foam on top
  prod_snow_oolong: { cup: "clear", liquid: ["#C39A6B", "#A8763F"], cap: "snow", garnish: "leaf", wash: "#EEE6DA" },
  prod_snow_jasmine: { cup: "clear", liquid: ["#DCCBA8", "#C2AC7E"], cap: "snow", garnish: "leaf", wash: "#EFEADD" },

  // Teaspresso latte — porcelain, creamy
  prod_teaspresso_latte: { cup: "porcelain", liquid: ["#D6BE9B", "#B8935F"], cap: "foam", garnish: "leaf", wash: "#EEE8DC" },
  prod_teaspresso_black: { cup: "porcelain", liquid: ["#C3A079", "#96683C"], cap: "foam", garnish: "grain", wash: "#EDE4D8" },

  // Frappé — blended, snow cap
  prod_frappe_oolong: { cup: "clear", liquid: ["#DAC5A2", "#BFA075"], cap: "snow", garnish: "grain", wash: "#EFE9DD" },
  prod_frappe_choco: { cup: "clear", liquid: ["#9A6B4A", "#6E4429"], cap: "snow", garnish: "cookie", wash: "#E9DFD5" },

  // Brewed tea — clear, translucent
  prod_brewed_oolong: { cup: "clear", liquid: ["#D9A85F", "#BE8438"], cap: null, garnish: "leaf", wash: "#F0E7D6" },
  prod_brewed_jasmine: { cup: "clear", liquid: ["#D9E3A8", "#BCCB7C"], cap: null, garnish: "leaf", wash: "#EDF0DB" },
};

const FALLBACK: TeaArt = { cup: "clear", liquid: ["#9DBE72", "#7C9E55"], cap: null, garnish: "leaf", wash: "#EAEFDD" };

export function getTeaArt(productId: string): TeaArt {
  return ART[productId] ?? FALLBACK;
}
