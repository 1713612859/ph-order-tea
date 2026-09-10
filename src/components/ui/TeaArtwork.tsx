import { useId } from "react";
import type { Garnish, TeaArt } from "@/data/productArt";

interface TeaArtworkProps {
  /** Full per-SKU descriptor. Omit for decorative use and pass `color` instead. */
  art?: TeaArt;
  /** Decorative shorthand: tints a plain clear cup. Ignored when `art` is given. */
  color?: string;
  className?: string;
  showWash?: boolean;
}

/** Local vector product artwork: scalable, offline, and distinct per SKU. */
export function TeaArtwork({ art: artProp, color, className = "", showWash = false }: TeaArtworkProps) {
  const raw = useId();
  const id = raw.replace(/:/g, "");
  const art: TeaArt = artProp ?? {
    cup: "clear",
    liquid: [color ?? "#9DBE72", color ?? "#7C9E55"],
    cap: null,
    garnish: "none",
    wash: "#EAEFDD",
  };
  const [top, bottom] = art.liquid;
  const porcelain = art.cup === "porcelain";

  // Cup silhouette (tapered tumbler)
  const BODY = "M64 74 L80 236 Q120 250 160 236 L176 74 Z";

  return (
    <svg viewBox="0 0 240 280" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}liq`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`${id}gloss`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#fff" stopOpacity=".55" />
          <stop offset=".28" stopColor="#fff" stopOpacity="0" />
          <stop offset=".82" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity=".45" />
        </linearGradient>
        <linearGradient id={`${id}porc`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3F5E8C" />
          <stop offset=".45" stopColor="#2C4670" />
          <stop offset="1" stopColor="#1E3357" />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <path d={BODY} />
        </clipPath>
        <filter id={`${id}blur`}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {showWash && <rect width="240" height="280" fill={art.wash} />}

      {/* garnish sits behind the cup */}
      <GarnishArt kind={art.garnish} />

      <ellipse cx="122" cy="252" rx="60" ry="9" fill="#26361f" opacity=".2" filter={`url(#${id}blur)`} />

      {/* body */}
      <g clipPath={`url(#${id}clip)`}>
        {porcelain ? (
          <>
            <rect x="50" y="60" width="150" height="200" fill={`url(#${id}porc)`} />
            <PorcelainPattern />
          </>
        ) : (
          <>
            <rect x="50" y="60" width="150" height="200" fill="#F7F5EC" />
            {/* liquid fill, leaving headroom when a cap is present */}
            <rect x="50" y={art.cap ? 112 : 78} width="150" height="180" fill={`url(#${id}liq)`} />
            {art.cap && <rect x="50" y="74" width="150" height="42" fill={art.cap === "snow" ? "#FBFAF3" : "#F3E7D2"} />}
            {art.garnish === "pearls" && <PearlCluster />}
          </>
        )}
        <rect x="50" y="60" width="150" height="200" fill={`url(#${id}gloss)`} />
      </g>

      {/* rim + lid */}
      {porcelain ? (
        <>
          <path d="M58 74 Q120 58 182 74 L180 88 Q120 74 60 88 Z" fill="#20304C" />
          <ellipse cx="120" cy="72" rx="62" ry="13" fill="#2B3D5C" />
          <ellipse cx="120" cy="70" rx="55" ry="10" fill="#16233B" />
        </>
      ) : (
        <>
          <ellipse cx="120" cy="74" rx="56" ry="12" fill={art.cap ? "#FBFAF3" : top} opacity=".95" />
          <ellipse cx="120" cy="74" rx="56" ry="12" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="2" />
          {/* straw */}
          <path d="M138 72 152 24" stroke="#E9E4D2" strokeWidth="9" strokeLinecap="round" />
          <path d="M136 72 150 24" stroke="#fff" strokeWidth="2.4" opacity=".7" strokeLinecap="round" />
        </>
      )}

      <path d={BODY} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" />

      {/* brand medallion */}
      <g opacity={porcelain ? 0.95 : 0.92}>
        <circle cx="120" cy="152" r="27" fill={porcelain ? "#F4F2E6" : "#FBFAF2"} fillOpacity={porcelain ? 0.92 : 0.85} />
        <path d="M111 145q2-16 18-14-1 15-18 14m0 0 11-9" fill="none" stroke="#3A5238" strokeWidth="1.7" />
        <text x="120" y="161" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fill="#27412C">
          ChaTea
        </text>
        <text x="120" y="171" textAnchor="middle" fontFamily="sans-serif" fontSize="4.2" letterSpacing="1.6" fill="#55694E">
          PURE AT HEART
        </text>
      </g>

      <path d="M78 100 87 220" stroke="#fff" strokeWidth="3" opacity=".4" strokeLinecap="round" />
    </svg>
  );
}

/** Blue-and-white motif for porcelain-style paper cups. */
function PorcelainPattern() {
  return (
    <g fill="none" stroke="#DCE6F2" strokeOpacity=".55" strokeWidth="2">
      <path d="M58 96q18-14 34 0t34 0 34 0" />
      <path d="M54 214q20-13 36 0t36 0 34 0" />
      <circle cx="86" cy="126" r="11" />
      <circle cx="156" cy="196" r="9" />
      <path d="M150 118q10-9 18 2-9 9-18-2Z" />
      <path d="M80 186q11-8 18 3-10 8-18-3Z" />
      <path d="M120 108q6 10 0 20-6-10 0-20Z" />
    </g>
  );
}

function PearlCluster() {
  const pearls: [number, number, number][] = [
    [92, 222, 8], [110, 228, 9], [130, 226, 8], [148, 220, 7],
    [101, 210, 7], [122, 212, 8], [140, 208, 7], [113, 196, 6],
  ];
  return (
    <g>
      {pearls.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#3B2A1E" opacity=".9" />
      ))}
    </g>
  );
}

function GarnishArt({ kind }: { kind: Garnish }) {
  switch (kind) {
    case "leaf":
      return (
        <g>
          <path d="M40 150q28-30 56-14-16 32-56 14Z" fill="#5E8A44" />
          <path d="M42 150q26-16 52-12" stroke="#3F6B31" strokeWidth="1.6" fill="none" />
          <path d="M198 176q-28-28-54-10 18 30 54 10Z" fill="#6E9B4F" />
          <path d="M196 176q-26-15-50-10" stroke="#4A7538" strokeWidth="1.6" fill="none" />
        </g>
      );
    case "matcha":
      return (
        <g>
          <ellipse cx="58" cy="212" rx="34" ry="13" fill="#E4E9D2" />
          <path d="M30 210q26-22 54-2-24 12-54 2Z" fill="#7FA24E" />
          <path d="M188 196q22-20 42-2-20 14-42 2Z" fill="#8DAE5C" />
          <path d="M196 168q16-16 30-2-14 12-30 2Z" fill="#6F9243" />
        </g>
      );
    case "peach":
      return (
        <g>
          <circle cx="56" cy="186" r="34" fill="#F2A88C" />
          <path d="M56 152q-10 18 0 34 10-16 0-34Z" fill="#E58C6C" opacity=".7" />
          <path d="M60 152q10-16 26-10-12 14-26 10Z" fill="#6E9B4F" />
        </g>
      );
    case "mango":
      return (
        <g>
          <ellipse cx="54" cy="190" rx="36" ry="27" fill="#F5B93F" transform="rotate(-18 54 190)" />
          <path d="M30 178q22-12 44 2" stroke="#E0A02A" strokeWidth="2.5" fill="none" />
          <ellipse cx="196" cy="204" rx="24" ry="18" fill="#F7C75C" transform="rotate(14 196 204)" />
        </g>
      );
    case "lychee":
      return (
        <g>
          <circle cx="54" cy="188" r="28" fill="#E8CFC0" />
          <circle cx="54" cy="188" r="28" fill="none" stroke="#D0A98F" strokeWidth="2" strokeDasharray="3 4" />
          <circle cx="196" cy="200" r="20" fill="#F0DDD0" />
          <path d="M60 158q12-14 26-8-12 12-26 8Z" fill="#6E9B4F" />
        </g>
      );
    case "passion":
      return (
        <g>
          <circle cx="54" cy="188" r="30" fill="#C87A3C" />
          <circle cx="54" cy="188" r="20" fill="#F2C35A" />
          <g fill="#7A4B1E">
            {[[48, 182], [60, 186], [52, 194], [62, 196], [44, 190]].map(([cx, cy], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx="3" ry="4" />
            ))}
          </g>
          <circle cx="196" cy="204" r="16" fill="#D08A45" />
        </g>
      );
    case "cookie":
      return (
        <g>
          <circle cx="52" cy="196" r="26" fill="#4A3628" />
          <circle cx="52" cy="196" r="26" fill="none" stroke="#3A2A20" strokeWidth="3" />
          <ellipse cx="52" cy="196" rx="26" ry="7" fill="#EFE7D6" opacity=".9" />
          <g fill="#3E2C21">
            {[[186, 190], [200, 200], [192, 210], [204, 184]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 ? 5 : 7} />
            ))}
          </g>
        </g>
      );
    case "grain":
      return (
        <g fill="#C29A5E">
          {[[36, 200], [50, 214], [64, 202], [44, 186], [190, 206], [204, 194], [198, 218]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="9" ry="5" transform={`rotate(${i * 35} ${cx} ${cy})`} />
          ))}
        </g>
      );
    case "pearls":
      return (
        <g fill="#4A3324">
          {[[40, 214], [58, 224], [74, 212], [196, 216], [208, 204]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="9" />
          ))}
        </g>
      );
    default:
      return null;
  }
}
