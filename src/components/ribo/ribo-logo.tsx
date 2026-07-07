/**
 * RiboLogo — the official RIBO mark.
 *
 * Concept #14f "Wave Strips Converging" (vertical): three sine-wave strips
 * that run vertically and converge to a single point at the bottom —
 * three RNA strands pinning into a single consensus block. Selected as the
 * official RIBO logo on 2026-07-06.
 *
 * Why vertical + converging (not the original horizontal #14):
 *   The horizontal 3-stripe version was too similar to the Libra/Diem logo
 *   (3 horizontal blue wavy lines / tildes). Rotating 90° alone wasn't
 *   enough — VLM still flagged it as Libra-like. The converging variant
 *   breaks the "3 parallel stripes" silhouette entirely while keeping the
 *   wave-strips motif the user liked. The convergence also carries a
 *   stronger RIBO-specific metaphor: useful-work strands being bound into
 *   one consensus output.
 *
 * Usage:
 *   <RiboLogo />                       // 32×32, currentColor (default)
 *   <RiboLogo size={64} />             // 64×64
 *   <RiboLogo variant="light" />       // fixed light-bg variant
 *   <RiboLogo variant="dark" />        // fixed dark-bg variant
 *   <RiboLogo animated />              // gentle vertical wave drift
 */

"use client"

type Variant = "auto" | "light" | "dark"

interface RiboLogoProps {
  size?: number
  variant?: Variant
  animated?: boolean
  className?: string
  title?: string
}

export function RiboLogo({
  size = 32,
  variant = "auto",
  animated = false,
  className,
  title = "RIBO",
}: RiboLogoProps) {
  // Unique gradient id per instance to avoid collisions when multiple logos
  // are rendered on the same page.
  const gradId = `ribo-logo-v4-grad-${variant}-${size}-${animated ? "anim" : "static"}`

  // For "auto" we use currentColor so the logo inherits text color (works on
  // any background). For "light"/"dark" we use the fixed RIBO blue gradient.
  const useGradient = variant !== "auto"
  const stroke = useGradient ? `url(#${gradId})` : "currentColor"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {useGradient && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A1AFF" />
            <stop offset="100%" stopColor="#5C5CFF" />
          </linearGradient>
        </defs>
      )}
      {/* Left strand — converges to (200, 360) at the bottom */}
      <path
        d="M 60 40 Q 40 200, 200 360"
        stroke={stroke}
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
        style={animated ? { animation: "ribo-vwave-left 4s ease-in-out infinite" } : undefined}
      />
      {/* Middle strand — converges to (200, 360), 75% opacity */}
      <path
        d="M 200 40 Q 180 200, 200 360"
        stroke={stroke}
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
        style={animated ? { animation: "ribo-vwave-mid 4s ease-in-out infinite 0.2s" } : undefined}
      />
      {/* Right strand — converges to (200, 360), 50% opacity */}
      <path
        d="M 340 40 Q 320 200, 200 360"
        stroke={stroke}
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
        style={animated ? { animation: "ribo-vwave-right 4s ease-in-out infinite 0.4s" } : undefined}
      />
      {/* Convergence point — small bright dot at the bottom anchor */}
      <circle cx="200" cy="360" r="10" fill={stroke} />
    </svg>
  )
}

/**
 * Inline <style> block to register the vertical wave animations. Include this
 * once at the page root if you use animated RiboLogo instances.
 */
export function RiboLogoAnimations() {
  return (
    <style>{`
      @keyframes ribo-vwave-left {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-6px); }
      }
      @keyframes ribo-vwave-mid {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(6px); }
      }
      @keyframes ribo-vwave-right {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-6px); }
      }
    `}</style>
  )
}
