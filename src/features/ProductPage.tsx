import { validateLine } from "@/lib/validation";
import type { DictKey } from "@/lib/i18n/dict";
import { useAuth } from "@/stores/useAuth";
import { LoginSheet } from "./LoginSheet";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ActionBar } from "@/components/layout/ActionBar";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { useT } from "@/lib/i18n";
import { formatPHP } from "@/lib/format";
import { catalogRepo } from "@/lib/repositories";
import { categoryAccent } from "@/data";
import { calcUnitPrice } from "@/lib/pricing";
import { useCart } from "@/stores/useCart";
import { useSettings } from "@/stores/useSettings";
import { useMemberMode } from "@/stores/useMemberMode";
import type { SpecGroup, SpecOption } from "@/types";

export function ProductPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  return <ProductConfiguration key={`${id}:${params.get("line") ?? "new"}`} />;
}

function ProductConfiguration() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const editingLineId = params.get("line");
  const navigate = useNavigate();
  const { t, tx } = useT();
  const memberMode = useMemberMode();
  const storeId = useSettings((s) => s.selectedStoreId);
  const addLine = useCart((s) => s.addLine);
  const updateLine = useCart((s) => s.updateLine);
  const editingLine = useCart((s) => s.cart.lines.find((l) => l.lineId === editingLineId && l.productId === id));

  const product = id ? catalogRepo.getProduct(id) : undefined;
  const availability = useMemo(() => (product ? catalogRepo.getAvailability(storeId, product.id) : { isSoldOut: false, soldOutOptionIds: [] }), [product, storeId]);
  const accent = product ? categoryAccent[product.categoryId] ?? "#6E8B4E" : "#6E8B4E";

  const initialSingle = useMemo(() => {
    const map: Record<string, string> = {};
    product?.specGroups.forEach((g) => {
      if (g.selectType === "single") {
        const def = g.options.find((o) => o.isDefault && isOptionEnabled(o, availability.soldOutOptionIds)) ?? g.options.find((o) => isOptionEnabled(o, availability.soldOutOptionIds));
        if (def) map[g.id] = def.id;
      }
    });
    if (editingLine) {
      product?.specGroups.forEach((g) => {
        if (g.selectType === "single") {
          const chosen = g.options.find((o) => editingLine.selectedOptionIds.includes(o.id));
          if (chosen) map[g.id] = chosen.id;
        }
      });
    }
    return map;
  }, [product, availability.soldOutOptionIds, editingLine]);

  const initialMulti = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    product?.specGroups.forEach((g) => {
      if (g.selectType === "multi") {
        map[g.id] = new Set(editingLine ? g.options.filter((o) => editingLine.selectedOptionIds.includes(o.id)).map((o) => o.id) : []);
      }
    });
    return map;
  }, [product, editingLine]);

  const [single, setSingle] = useState<Record<string, string>>(initialSingle);
  const [multi, setMulti] = useState<Record<string, Set<string>>>(initialMulti);
  const [qty, setQty] = useState(editingLine?.quantity ?? 1);
  const [remark, setRemark] = useState(editingLine?.remark ?? "");
  const [loginOpen, setLoginOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pendingGo = useRef<"back" | "cart" | null>(null);

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-muted">Product not found.</p>
        <button onClick={() => navigate("/menu")} className="btn-primary">
          {t("tab.menu")}
        </button>
      </div>
    );
  }

  const selectedOptionIds = [
    ...Object.values(single),
    ...Object.values(multi).flatMap((s) => [...s]),
  ];
  const unit = calcUnitPrice(product, selectedOptionIds, memberMode);

  const toggleMulti = (group: SpecGroup, optId: string) => {
    setMulti((prev) => {
      const set = new Set(prev[group.id] ?? []);
      if (set.has(optId)) set.delete(optId);
      else {
        if (group.maxSelect && set.size >= group.maxSelect) return prev;
        set.add(optId);
      }
      return { ...prev, [group.id]: set };
    });
  };

  const selectionError = storeId ? validateLine(storeId, { productId: product.id, selectedOptionIds, quantity: qty }) : null;
  const validSelection = !selectionError;

  const commit = (thenGo: "back" | "cart") => {
    if (!useAuth.getState().isLoggedIn) {
      pendingGo.current = thenGo;
      setLoginOpen(true);
      return;
    }
    if (!storeId) {
      navigate("/stores");
      return;
    }
    if (!validSelection) return;
    if (editingLine) {
      updateLine(editingLine.lineId, { selectedOptionIds, remark: remark || undefined, quantity: qty });
    } else {
      addLine({ productId: product.id, selectedOptionIds, quantity: qty, remark: remark || undefined });
    }
    // the cart lives as a sheet on the menu page
    navigate(thenGo === "cart" ? "/menu?cart=1" : "/menu");
  };

  return (
    <div className="product-page flex flex-1 flex-col">
      <LoginSheet
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          pendingGo.current = null;
        }}
        onSuccess={() => {
          const go = pendingGo.current;
          pendingGo.current = null;
          if (go) commit(go);
        }}
      />
      {/* hero */}
      <div className={`product-hero relative ${product.sellingPoints?.length ? "product-hero-editorial" : ""}`}>
        <Media image={product.image} productId={product.id} accent={accent} className="h-64 w-full" rounded="rounded-none" />
        {!!product.sellingPoints?.length && <div className="product-hero-copy"><p>{product.sellingPoints.map(tx).join(" · ")}</p><span>{tx(product.description)}</span>{product.teaBase && <small>{t("product.teaBase")}: <strong>{tx(product.teaBase)}</strong></small>}</div>}
        <button
          onClick={() => navigate(editingLine ? "/menu?cart=1" : "/menu")}
          aria-label={t("common.close")}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="product-content relative z-10 -mt-6 flex-1 rounded-t-3xl bg-white px-5 pb-8 shadow-[0_-8px_24px_rgba(31,59,44,0.08)]">
        {selectionError && <p role="alert" className="validation-message">{t(selectionError as DictKey)}</p>}
        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-navy">{tx(product.name)}</h1>
            {product.teaBase && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {t("product.teaBase")}: <span className="text-navy">{tx(product.teaBase)}</span>
              </p>
            )}
          </div>
          <span className="shrink-0 pt-0.5 text-xl font-extrabold text-brand-red">{formatPHP(unit * qty)}</span>
        </div>
        <p className={`mt-2 text-sm text-muted ${expanded ? "" : "line-clamp-2"}`}>{tx(product.description)}</p>
        {tx(product.description).length > 60 && (
          <button onClick={() => setExpanded((v) => !v)} className="mt-1 flex items-center gap-1 text-xs font-medium text-navy">
            {expanded ? t("product.showLess") : t("product.showMore")}
            <Icon name="chevron-down" className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        {product.specGroups
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((group) => (
            <div key={group.id} className={`spec-group mt-6 ${group.priceMode === "base" ? "spec-group-base" : ""}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold text-navy">{tx(group.name)}</h3>
                {group.selectType === "multi" && group.maxSelect && (
                  <span className="text-[11px] text-muted">
                    {t("product.maxSelect")} {group.maxSelect}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.options
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((opt) => {
                    const enabled = isOptionEnabled(opt, availability.soldOutOptionIds);
                    const active = group.selectType === "single" ? single[group.id] === opt.id : multi[group.id]?.has(opt.id);
                    return (
                      <button
                        key={opt.id}
                        aria-pressed={!!active}
                        disabled={!enabled}
                        onClick={() =>
                          group.selectType === "single"
                            ? setSingle((p) => ({ ...p, [group.id]: opt.id }))
                            : toggleMulti(group, opt.id)
                        }
                        className={`chip ${active ? "chip-on" : "chip-off"} ${!enabled ? "cursor-not-allowed line-through opacity-40" : ""}`}
                      >
                        {tx(opt.label)}
                        {opt.retailPrice > 0 && group.priceMode === "addon" && <span className="ml-1 text-xs">+{formatPHP(opt.retailPrice)}</span>}
                        {group.priceMode === "base" && <span className="ml-1 text-xs text-muted">{formatPHP(memberMode && opt.memberPrice ? opt.memberPrice : opt.retailPrice)}</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

        {product.allowRemark && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-navy">
              {t("product.remark")} <span className="text-xs font-normal text-muted">({t("common.optional")})</span>
            </h3>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
              maxLength={120}
              placeholder={t("product.remarkPlaceholder")}
              className="mt-2 w-full resize-none rounded-xl border border-line bg-cream-soft/50 p-3 text-sm outline-none focus:border-navy"
            />
          </div>
        )}
      </div>

      <ActionBar>
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xl font-extrabold text-brand-red">{formatPHP(unit * qty)}</span>
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
          </div>
          <div className="flex gap-3">
            <button disabled={!validSelection} onClick={() => commit("back")} className="btn-outline flex-1">
              {editingLine ? t("common.confirm") : t("product.addToBag")}
            </button>
            <button disabled={!validSelection} onClick={() => commit("cart")} className="btn-primary flex-1">
              {t("product.placeOrder")}
            </button>
          </div>
        </div>
      </ActionBar>
    </div>
  );
}

function isOptionEnabled(opt: SpecOption, soldOutOptionIds: string[]): boolean {
  return opt.isAvailable && !soldOutOptionIds.includes(opt.id);
}

