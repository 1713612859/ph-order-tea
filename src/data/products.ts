import type { Centavos, Product, SpecGroup, SpecOption } from "@/types";

const TS = "2026-09-01T00:00:00.000Z";
const php = (n: number): Centavos => Math.round(n * 100);

let optSeq = 0;
const oid = () => `opt_${++optSeq}`;

/** Shared addon groups reused across beverages. */
function sweetnessGroup(): SpecGroup {
  return {
    id: "spec_sweetness",
    name: { en: "Sweetness", zh: "甜度" },
    priceMode: "addon",
    selectType: "single",
    required: true,
    sortOrder: 2,
    options: [
      { id: "sw_normal", label: { en: "Normal Sweet", zh: "标准糖" }, priceMode: "addon", retailPrice: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "sw_less", label: { en: "Less Sweet", zh: "少糖" }, priceMode: "addon", retailPrice: 0, isAvailable: true, sortOrder: 2 },
      { id: "sw_none", label: { en: "No Additional Sugar", zh: "不额外加糖" }, priceMode: "addon", retailPrice: 0, isAvailable: true, sortOrder: 3 },
    ],
  };
}

function temperatureGroup(allowHot = true): SpecGroup {
  return {
    id: "spec_temperature",
    name: { en: "Temperature", zh: "温度" },
    priceMode: "addon",
    selectType: "single",
    required: true,
    sortOrder: 3,
    options: [
      { id: "tp_ice", label: { en: "Normal Ice", zh: "正常冰" }, priceMode: "addon", retailPrice: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "tp_less_ice", label: { en: "Less Ice", zh: "少冰" }, priceMode: "addon", retailPrice: 0, isAvailable: true, sortOrder: 2 },
      { id: "tp_hot", label: { en: "Hot", zh: "热" }, priceMode: "addon", retailPrice: 0, isAvailable: allowHot, sortOrder: 3 },
    ],
  };
}

function milkGroup(): SpecGroup {
  return {
    id: "spec_milk",
    name: { en: "Milk Customization", zh: "换奶" },
    priceMode: "addon",
    selectType: "single",
    required: false,
    sortOrder: 4,
    options: [
      { id: "mk_fresh", label: { en: "Fresh Milk", zh: "鲜奶" }, priceMode: "addon", retailPrice: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "mk_oat", label: { en: "Oat Milk", zh: "燕麦奶" }, priceMode: "addon", retailPrice: php(30), isAvailable: true, sortOrder: 2 },
    ],
  };
}

function toppingsGroup(): SpecGroup {
  return {
    id: "spec_toppings",
    name: { en: "Toppings", zh: "加料" },
    priceMode: "addon",
    selectType: "multi",
    required: false,
    maxSelect: 3,
    sortOrder: 5,
    options: [
      { id: "tg_cheese", label: { en: "Creamy Cheese Topping", zh: "芝士奶盖" }, priceMode: "addon", retailPrice: php(30), isAvailable: true, sortOrder: 1 },
      { id: "tg_pearl", label: { en: "Pearls", zh: "珍珠" }, priceMode: "addon", retailPrice: php(20), isAvailable: true, sortOrder: 2 },
      { id: "tg_pudding", label: { en: "Pudding", zh: "布丁" }, priceMode: "addon", retailPrice: php(25), isAvailable: true, sortOrder: 3 },
      { id: "tg_redbean", label: { en: "Red Bean", zh: "红豆" }, priceMode: "addon", retailPrice: php(25), isAvailable: true, sortOrder: 4 },
    ],
  };
}

/** Base (price-defining) group. Each option carries an absolute price. */
function baseGroup(name: SpecGroup["name"], options: Array<{ label: SpecOption["label"]; price: number; member?: number | null; def?: boolean }>): SpecGroup {
  return {
    id: "spec_base",
    name,
    priceMode: "base",
    selectType: "single",
    required: true,
    sortOrder: 1,
    options: options.map((o, i) => ({
      id: oid(),
      label: o.label,
      priceMode: "base",
      retailPrice: php(o.price),
      memberPrice: o.member === undefined ? null : o.member === null ? null : php(o.member),
      isDefault: o.def ?? i === 0,
      isAvailable: true,
      sortOrder: i + 1,
    })),
  };
}

const sizeBase = (regular: number, large: number, memberRegular?: number | null) =>
  baseGroup({ en: "Size", zh: "规格" }, [
    { label: { en: "Regular", zh: "中杯" }, price: regular, member: memberRegular ?? null, def: true },
    { label: { en: "Large", zh: "大杯" }, price: large, member: null },
  ]);

function beverage(
  p: {
    id: string;
    sku: string;
    categoryId: string;
    name: { en: string; zh: string };
    description: { en: string; zh: string };
    teaBase?: { en: string; zh: string };
    tags?: Product["tags"];
    sortOrder: number;
    base: SpecGroup;
    allowHot?: boolean;
    withMilk?: boolean;
  },
): Product {
  const groups: SpecGroup[] = [p.base, sweetnessGroup(), temperatureGroup(p.allowHot ?? true)];
  if (p.withMilk ?? true) groups.push(milkGroup());
  groups.push(toppingsGroup());
  return {
    id: p.id,
    sku: p.sku,
    categoryId: p.categoryId,
    name: p.name,
    description: p.description,
    teaBase: p.teaBase,
    sellingPoints:
      p.tags?.includes("new")
        ? [
            { en: "Premium", zh: "高品质" },
            { en: "Creamy", zh: "醇厚" },
            { en: "Smooth", zh: "顺滑" },
          ]
        : undefined,
    image: { url: p.id === "prod_signature_matcha_latte" ? "/images/matcha-editorial.png" : "", alt: p.name },
    tags: p.tags ?? [],
    specGroups: groups,
    allowRemark: true,
    sortOrder: p.sortOrder,
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  };
}

export const products: Product[] = [
  // ---- Matcha Series ----
  beverage({
    id: "prod_signature_matcha_latte",
    sku: "MAT-001",
    categoryId: "cat_matcha",
    name: { en: "Signature Matcha Latte", zh: "抹茶拿铁" },
    description: { en: "Smooth and creamy with rich matcha flavour, delivering a comforting and well-balanced classic.", zh: "顺滑奶香，抹茶风味浓郁，均衡耐喝的经典之选。" },
    teaBase: { en: "Matcha", zh: "抹茶" },
    tags: ["new"],
    sortOrder: 1,
    base: baseGroup({ en: "Milk + Matcha Level", zh: "奶 + 抹茶浓度" }, [
      { label: { en: "Fresh Milk + Normal Matcha", zh: "鲜奶 + 标准抹茶" }, price: 170, member: 155, def: true },
      { label: { en: "Fresh Milk + Extra Matcha", zh: "鲜奶 + 加浓抹茶" }, price: 195, member: null },
    ]),
  }),
  beverage({
    id: "prod_jasmine_matcha",
    sku: "MAT-002",
    categoryId: "cat_matcha",
    name: { en: "Jasmine Matcha Pure Tea", zh: "茉见青" },
    description: { en: "A delicate blend of matcha and jasmine green tea, light and refreshing.", zh: "抹茶与茉莉绿茶的清雅融合，轻盈爽口。" },
    teaBase: { en: "Matcha", zh: "抹茶" },
    tags: ["new"],
    sortOrder: 2,
    base: sizeBase(140, 160, 128),
    withMilk: false,
  }),
  beverage({
    id: "prod_choco_cookie_matcha_frappe",
    sku: "MAT-003",
    categoryId: "cat_matcha",
    name: { en: "Chocolate Cookie Matcha Frappé", zh: "星尘绿意" },
    description: { en: "A decadent blend of matcha and chocolate cookie crumble, blended into a creamy frappé.", zh: "抹茶与巧克力饼干碎的浓郁冰沙。" },
    teaBase: { en: "Matcha", zh: "抹茶" },
    tags: ["new"],
    sortOrder: 3,
    base: sizeBase(225, 245),
    allowHot: false,
  }),

  // ---- Fresh Milk Tea ----
  beverage({
    id: "prod_classic_milk_tea",
    sku: "FMT-001",
    categoryId: "cat_milk_tea",
    name: { en: "Signature Fresh Milk Tea", zh: "招牌鲜奶茶" },
    description: { en: "Roasted oolong with fresh milk, rounded and aromatic.", zh: "烘焙乌龙搭配鲜奶，醇厚回甘。" },
    teaBase: { en: "Oolong", zh: "乌龙" },
    tags: ["hot"],
    sortOrder: 1,
    base: sizeBase(130, 150, 118),
  }),
  beverage({
    id: "prod_brown_sugar_milk_tea",
    sku: "FMT-002",
    categoryId: "cat_milk_tea",
    name: { en: "Brown Sugar Fresh Milk Tea", zh: "黑糖鲜奶茶" },
    description: { en: "Fresh milk tea layered with slow-cooked brown sugar and chewy pearls.", zh: "黑糖慢煮，搭配鲜奶与Q弹珍珠。" },
    sortOrder: 2,
    base: sizeBase(150, 170),
  }),
  beverage({
    id: "prod_taro_milk_tea",
    sku: "FMT-003",
    categoryId: "cat_milk_tea",
    name: { en: "Taro Fresh Milk Tea", zh: "香芋鲜奶茶" },
    description: { en: "Creamy mashed taro blended with fresh milk tea.", zh: "绵密芋泥融合鲜奶茶。" },
    sortOrder: 3,
    base: sizeBase(155, 175),
  }),

  // ---- Fresh Fruit Tea ----
  beverage({
    id: "prod_mango_fruit_tea",
    sku: "FFT-001",
    categoryId: "cat_fruit_tea",
    name: { en: "Mango Green Tea", zh: "芒果绿茶" },
    description: { en: "Sweet Philippine mango with fragrant green tea.", zh: "菲律宾甜芒果搭配清香绿茶。" },
    teaBase: { en: "Green Tea", zh: "绿茶" },
    tags: ["recommended"],
    sortOrder: 1,
    base: sizeBase(145, 165),
    withMilk: false,
  }),
  beverage({
    id: "prod_lychee_oolong",
    sku: "FFT-002",
    categoryId: "cat_fruit_tea",
    name: { en: "Lychee Oolong Tea", zh: "荔枝乌龙" },
    description: { en: "Juicy lychee balanced with roasted oolong.", zh: "多汁荔枝平衡烘焙乌龙。" },
    sortOrder: 2,
    base: sizeBase(140, 160),
    withMilk: false,
  }),
  beverage({
    id: "prod_passion_fruit",
    sku: "FFT-003",
    categoryId: "cat_fruit_tea",
    name: { en: "Passion Fruit Green Tea", zh: "百香果绿茶" },
    description: { en: "Tangy passion fruit over jasmine green tea.", zh: "酸甜百香果搭配茉莉绿茶。" },
    sortOrder: 3,
    base: sizeBase(140, 160),
    withMilk: false,
  }),

  // ---- Snow Cap Milk Tea ----
  beverage({
    id: "prod_snow_oolong",
    sku: "SC-001",
    categoryId: "cat_snow_cap",
    name: { en: "Snow Cap Oolong Milk Tea", zh: "雪顶乌龙奶茶" },
    description: { en: "Roasted oolong milk tea crowned with a salted cheese snow cap.", zh: "烘焙乌龙奶茶，覆以海盐芝士奶盖。" },
    tags: ["hot"],
    sortOrder: 1,
    base: sizeBase(160, 180),
    allowHot: false,
  }),
  beverage({
    id: "prod_snow_jasmine",
    sku: "SC-002",
    categoryId: "cat_snow_cap",
    name: { en: "Snow Cap Jasmine Milk Tea", zh: "雪顶茉莉奶茶" },
    description: { en: "Fragrant jasmine milk tea with a creamy cheese snow cap.", zh: "茉莉奶茶，绵密芝士奶盖。" },
    sortOrder: 2,
    base: sizeBase(160, 180),
    allowHot: false,
  }),

  // ---- Teaspresso Latte ----
  beverage({
    id: "prod_teaspresso_latte",
    sku: "TL-001",
    categoryId: "cat_teaspresso",
    name: { en: "Teaspresso Oolong Latte", zh: "乌龙茶浓缩拿铁" },
    description: { en: "Concentrated tea shot pulled like espresso, with steamed fresh milk.", zh: "浓缩茶汤如意式浓缩，融合蒸煮鲜奶。" },
    teaBase: { en: "Oolong", zh: "乌龙" },
    sortOrder: 1,
    base: sizeBase(165, 185),
  }),
  beverage({
    id: "prod_teaspresso_black",
    sku: "TL-002",
    categoryId: "cat_teaspresso",
    name: { en: "Teaspresso Black Tea Latte", zh: "红茶浓缩拿铁" },
    description: { en: "Bold black tea concentrate with velvety fresh milk.", zh: "醇厚红茶浓缩，丝滑鲜奶。" },
    sortOrder: 2,
    base: sizeBase(165, 185),
  }),

  // ---- Teaspresso Frappé ----
  beverage({
    id: "prod_frappe_oolong",
    sku: "TF-001",
    categoryId: "cat_frappe",
    name: { en: "Oolong Teaspresso Frappé", zh: "乌龙茶浓缩冰沙" },
    description: { en: "Blended iced teaspresso frappé, smooth and frosty.", zh: "冰爽绵密的浓缩茶冰沙。" },
    sortOrder: 1,
    base: sizeBase(190, 210),
    allowHot: false,
  }),
  beverage({
    id: "prod_frappe_choco",
    sku: "TF-002",
    categoryId: "cat_frappe",
    name: { en: "Chocolate Teaspresso Frappé", zh: "巧克力茶浓缩冰沙" },
    description: { en: "Rich chocolate blended with tea concentrate into a frappé.", zh: "浓郁巧克力融合茶浓缩冰沙。" },
    sortOrder: 2,
    base: sizeBase(210, 230),
    allowHot: false,
  }),

  // ---- Brewed Tea ----
  beverage({
    id: "prod_brewed_oolong",
    sku: "BT-001",
    categoryId: "cat_brewed",
    name: { en: "Roasted Oolong (Pure Tea)", zh: "烘焙乌龙纯茶" },
    description: { en: "Single-origin roasted oolong, brewed fresh. No milk, no sugar option.", zh: "单一产区烘焙乌龙，鲜泡原味。" },
    teaBase: { en: "Oolong", zh: "乌龙" },
    sortOrder: 1,
    base: sizeBase(110, 130, 99),
    withMilk: false,
  }),
  beverage({
    id: "prod_brewed_jasmine",
    sku: "BT-002",
    categoryId: "cat_brewed",
    name: { en: "Jasmine Green (Pure Tea)", zh: "茉莉绿纯茶" },
    description: { en: "Aromatic jasmine green tea, light and clean.", zh: "清香茉莉绿茶，清爽纯净。" },
    sortOrder: 2,
    base: sizeBase(110, 130),
    withMilk: false,
  }),

  // ---- Merchandise ----
  {
    id: "prod_tea_gift_set",
    sku: "MER-001",
    categoryId: "cat_merch",
    name: { en: "Tea Gift Set (Bundle of 5)", zh: "茶礼盒（5盒装）" },
    description: { en: "A curated bundle of 5 CHAGEE-style tea boxes. Perfect for gifting.", zh: "精选 5 盒茶礼盒，馈赠佳品。" },
    image: { url: "", alt: { en: "Tea Gift Set", zh: "茶礼盒" } },
    tags: ["recommended"],
    specGroups: [],
    allowRemark: false,
    sortOrder: 1,
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  },
  {
    id: "prod_tumbler",
    sku: "MER-002",
    categoryId: "cat_merch",
    name: { en: "Stardust Tumbler", zh: "星尘随行杯" },
    description: { en: "Reusable insulated tumbler, 500ml.", zh: "可重复使用保温随行杯，500ml。" },
    image: { url: "", alt: { en: "Tumbler", zh: "随行杯" } },
    tags: [],
    specGroups: [],
    allowRemark: false,
    sortOrder: 2,
    isActive: true,
    createdAt: TS,
    updatedAt: TS,
  },
];

/** Fixed prices for merchandise (no spec groups → price comes from here). */
export const merchandisePrice: Record<string, Centavos> = {
  prod_tea_gift_set: php(3299),
  prod_tumbler: php(650),
};
