import { cn } from "@/lib/utils";

// Branded placeholder artwork. Renders a stylised "gel ash tray" or "beeswax
// wrap" tinted to the product hue, so cards look designed (not broken) until the
// client uploads real photography. Swap-in is trivial: real image URLs in product
// data render via <img> instead (see ProductImage below).

const HUES: Record<string, { glass: string; gel: string; rim: string }> = {
  emerald: { glass: "#bfe6d4", gel: "#1c8160", rim: "#0e4234" },
  sky: { glass: "#cfe7fb", gel: "#5aa9e6", rim: "#1f5f8b" },
  graphite: { glass: "#c9cdcb", gel: "#2a2e2c", rim: "#101211" },
  rose: { glass: "#f8d4dd", gel: "#e8728f", rim: "#9c3350" },
  honey: { glass: "#f7e7c2", gel: "#e8a33d", rim: "#b9711a" },
  "honey-deep": { glass: "#f3d79b", gel: "#d98e22", rim: "#95561a" },
};

function HexPattern({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} width="22" height="38" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
      <path
        d="M11 0L22 6v13L11 25 0 19V6zM11 25l11 6v7M11 25L0 31v7"
        fill="none"
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
    </pattern>
  );
}

function AshTrayArt({ hue }: { hue: string }) {
  const c = HUES[hue] ?? HUES.emerald;
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img">
      <defs>
        <radialGradient id={`bg-${hue}`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1ece1" />
        </radialGradient>
        <HexPattern id={`hex-${hue}`} color={c.rim} />
        <linearGradient id={`glass-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.glass} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.glass} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#bg-${hue})`} />
      {/* shadow */}
      <ellipse cx="200" cy="300" rx="120" ry="26" fill="#000" opacity="0.07" />
      {/* glass body */}
      <ellipse cx="200" cy="232" rx="128" ry="58" fill={`url(#glass-${hue})`} />
      <path d="M72 232 Q72 188 200 188 Q328 188 328 232 L328 232 Q328 276 200 276 Q72 276 72 232 Z" fill={`url(#glass-${hue})`} opacity="0.85" />
      {/* gel surface with honeycomb */}
      <ellipse cx="200" cy="200" rx="120" ry="50" fill={c.gel} />
      <ellipse cx="200" cy="200" rx="120" ry="50" fill={`url(#hex-${hue})`} />
      <ellipse cx="200" cy="200" rx="120" ry="50" fill="none" stroke={c.rim} strokeWidth="3" strokeOpacity="0.5" />
      {/* rim highlight */}
      <ellipse cx="170" cy="186" rx="46" ry="14" fill="#fff" opacity="0.25" />
      {/* cigarette rests */}
      <path d="M150 180 q10 -10 30 0" stroke={c.rim} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M250 180 q-10 -10 -30 0" stroke={c.rim} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function WrapArt({ hue }: { hue: string }) {
  const c = HUES[hue] ?? HUES.honey;
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img">
      <defs>
        <radialGradient id={`wbg-${hue}`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#f3e8cf" />
        </radialGradient>
        <HexPattern id={`whex-${hue}`} color={c.rim} />
      </defs>
      <rect width="400" height="400" fill={`url(#wbg-${hue})`} />
      <ellipse cx="200" cy="312" rx="130" ry="24" fill="#000" opacity="0.06" />
      {/* stacked folded sheets */}
      {[
        { x: 70, y: 210, r: -8, fill: c.glass },
        { x: 96, y: 168, r: 6, fill: c.gel },
        { x: 120, y: 130, r: -4, fill: c.rim },
      ].map((s, i) => (
        <g key={i} transform={`rotate(${s.r} 200 ${s.y + 50})`}>
          <rect x={s.x} y={s.y} width="210" height="120" rx="14" fill={s.fill} />
          <rect x={s.x} y={s.y} width="210" height="120" rx="14" fill={`url(#whex-${hue})`} opacity="0.5" />
          <rect x={s.x} y={s.y} width="210" height="120" rx="14" fill="none" stroke={c.rim} strokeOpacity="0.3" strokeWidth="2" />
        </g>
      ))}
      {/* little bee */}
      <g transform="translate(300 96)">
        <ellipse cx="0" cy="0" rx="13" ry="9" fill="#2a2421" />
        <path d="M-6 -8 Q-3 -14 3 -8" stroke="#e8a33d" strokeWidth="3" fill="none" />
        <ellipse cx="-9" cy="-4" rx="9" ry="6" fill="#fff" opacity="0.85" transform="rotate(-25)" />
        <line x1="-6" y1="-4" x2="6" y2="-4" stroke="#f3cf86" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function ProductVisual({
  src,
  family,
  className,
}: {
  src: string; // either "visual:<hue>" or a real image URL
  family: "ash-tray" | "honey-comb-wrap";
  className?: string;
}) {
  const isVisual = src.startsWith("visual:");
  if (!isVisual) {
    // Real photography path.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={cn("h-full w-full object-cover", className)} />;
  }
  const hue = src.replace("visual:", "");
  return (
    <div className={cn("h-full w-full", className)}>
      {family === "ash-tray" ? <AshTrayArt hue={hue} /> : <WrapArt hue={hue} />}
    </div>
  );
}
