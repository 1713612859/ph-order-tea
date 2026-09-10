import type { Centavos } from "@/types";

/** Philippine VAT is 12% and menu prices are VAT-inclusive; VAT is shown as an
 * embedded breakdown (total - total/1.12), never added on top. */
export const VAT_RATE = 0.12;

export const PACKAGING_FEE: { amount: Centavos; enabledByDefault: boolean; optional: boolean } = {
  amount: 500, // ₱5.00
  enabledByDefault: true,
  optional: true,
};

export const CURRENCY = "PHP" as const;
export const CURRENCY_SYMBOL = "₱";

/** localStorage namespace + schema version for migrations. */
export const PERSIST_KEY = "chatea_app";
export const SCHEMA_VERSION = 1;
