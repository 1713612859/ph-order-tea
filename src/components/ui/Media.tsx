import { useState } from "react";
import { TeaArtwork } from "./TeaArtwork";
import { getTeaArt } from "@/data/productArt";
import type { ImageAsset } from "@/types";
import { useT } from "@/lib/i18n";

interface MediaProps {
  image?: ImageAsset;
  /** When set (and glyph is "cup"), renders that SKU's distinct artwork. */
  productId?: string;
  accent?: string;
  className?: string;
  rounded?: string;
  glyph?: "cup" | "store" | "gift";
}

/** Product/store visual. Uses a real image when available, else per-SKU vector art. */
export function Media({ image, productId, accent = "#6E8B4E", className = "", rounded = "rounded-xl2", glyph = "cup" }: MediaProps) {
  const { tx } = useT();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (image?.url && image.url !== failedUrl) {
    return <img onError={() => setFailedUrl(image.url)} src={image.url} alt={tx(image.alt)} className={`${className} ${rounded} object-cover`} loading="lazy" />;
  }

  if (glyph === "cup" && productId) {
    const art = getTeaArt(productId);
    return (
      <div
        className={`${className} ${rounded} relative overflow-hidden`}
        style={{ background: art.wash }}
        role="img"
        aria-label={tx(image?.alt)}
      >
        <TeaArtwork art={art} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div
      className={`${className} ${rounded} relative flex items-center justify-center overflow-hidden`}
      style={{ background: `linear-gradient(150deg, ${accent}22 0%, ${accent}33 55%, ${accent}55 100%)` }}
      role="img"
      aria-label={tx(image?.alt)}
    >
      <GlyphMark kind={glyph} color={accent} />
    </div>
  );
}

function GlyphMark({ kind, color }: { kind: "cup" | "store" | "gift"; color: string }) {
  if (kind === "store") {
    return (
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2 opacity-70" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round">
        <path d="M8 20h32v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V20Z" />
        <path d="M6 20 9 9h30l3 11M18 40V28h12v12" />
      </svg>
    );
  }
  if (kind === "gift") {
    return (
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2 opacity-70" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round">
        <rect x="9" y="18" width="30" height="22" rx="2" />
        <path d="M9 25h30M24 18v22M24 18c-2-6-10-6-10-2s6 2 10 2Zm0 0c2-6 10-6 10-2s-6 2-10 2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-3/5 w-3/5 opacity-80" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round">
      <path d="M14 16h20l-2.5 22a3 3 0 0 1-3 2.6H19.5a3 3 0 0 1-3-2.6L14 16Z" />
      <rect x="12" y="12" width="24" height="4.5" rx="2" fill={color} stroke="none" opacity="0.85" />
      <path d="M20 10c-2-2 0-4 0-6M28 10c-2-2 0-4 0-6" />
    </svg>
  );
}
