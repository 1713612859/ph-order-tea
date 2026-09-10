import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { useT } from "@/lib/i18n";
import { formatPHP } from "@/lib/format";
import { categoryAccent, productById } from "@/data";
import { calcUnitPrice, cartSelectedTotal, cartTotalQuantity, optionSummary, selectedLines } from "@/lib/pricing";
import { useCart } from "@/stores/useCart";
import { useMemberMode } from "@/stores/useMemberMode";

/** Bottom-sheet cart, opened from the menu page (matches the reference flow). */
export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, tx, locale } = useT();
  const navigate = useNavigate();
  const memberMode = useMemberMode();
  const cart = useCart((s) => s.cart);
  const setQuantity = useCart((s) => s.setQuantity);
  const setSelected = useCart((s) => s.setSelected);
  const setAllSelected = useCart((s) => s.setAllSelected);
  const clear = useCart((s) => s.clear);

  const totalQty = cartTotalQuantity(cart);
  const selCount = selectedLines(cart).length;
  const total = cartSelectedTotal(cart, memberMode);
  const allSelected = cart.lines.length > 0 && cart.lines.every((l) => l.isSelected);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true" aria-label={t("cart.title")}>
      <button aria-label={t("common.close")} className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="cart-sheet relative mt-auto flex w-full max-w-app flex-col rounded-t-3xl bg-white">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <button onClick={() => setAllSelected(!allSelected)} className="flex items-center gap-2">
            <Icon name={allSelected ? "check-circle" : "circle"} className={`h-6 w-6 ${allSelected ? "text-navy" : "text-line"}`} />
            <span className="text-base font-extrabold text-navy">
              {totalQty} {t("cart.items")}
            </span>
          </button>
          <button onClick={clear} className="flex items-center gap-1 text-xs font-medium text-muted">
            {t("cart.empty")}
            <Icon name="trash" className="h-4 w-4" />
          </button>
        </div>

        {/* lines */}
        <div className="max-h-[46vh] space-y-4 overflow-y-auto px-5 py-4">
          {cart.lines.length === 0 && <p className="py-10 text-center text-sm text-muted">{t("cart.emptyState")}</p>}

          {cart.lines.map((line) => {
            const product = productById[line.productId];
            if (!product) return null;
            const accent = categoryAccent[product.categoryId] ?? "#6E8B4E";
            const unit = calcUnitPrice(product, line.selectedOptionIds, memberMode);
            const summary = optionSummary(line, locale);
            return (
              <div key={line.lineId} className="flex gap-3">
                <button
                  onClick={() => setSelected(line.lineId, !line.isSelected)}
                  aria-label={t("cart.selectAll")}
                  aria-pressed={line.isSelected}
                  className="flex items-center"
                >
                  <Icon name={line.isSelected ? "check-circle" : "circle"} className={`h-6 w-6 ${line.isSelected ? "text-navy" : "text-line"}`} />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.id}?line=${line.lineId}`);
                  }}
                  className="relative shrink-0"
                  aria-label={tx(product.name)}
                >
                  <Media image={product.image} productId={product.id} accent={accent} className="h-20 w-20" rounded="rounded-xl" />
                  <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-navy shadow">
                    <Icon name="edit" className="h-4 w-4" />
                  </span>
                </button>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="text-sm font-bold text-navy">{tx(product.name)}</h3>
                  {summary && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{summary}</p>}
                  {line.remark && <p className="mt-0.5 line-clamp-1 text-xs italic text-muted">“{line.remark}”</p>}
                  <div className="mt-auto flex items-end justify-between pt-1">
                    <span className="text-sm font-extrabold text-brand-amber">{formatPHP(unit)}</span>
                    <QtyStepper value={line.quantity} onChange={(v) => setQuantity(line.lineId, v)} min={0} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="flex items-center gap-3 border-t border-line px-5 py-3 pb-safe">
          <div className="flex-1">
            <p className="text-xs text-muted">{t("checkout.subtotal")}</p>
            <p className="text-lg font-extrabold text-navy">{formatPHP(total)}</p>
          </div>
          <button
            disabled={selCount === 0}
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
            className="btn-primary px-8"
          >
            {selCount === 0 ? t("cart.selectItems") : t("cart.checkout")}
          </button>
        </div>
      </div>
    </div>
  );
}
