"use client"

const MARQUEE_ITEMS_1 = [
  "$RIBO", "BC-UPoW", "RNA FOLDING", "zkVM PROOFS", "21M SUPPLY",
  "VDF SEQUENTIAL", "DESCI", "RIBOSOME NETWORK", "SPEC v1.0",
  "IN DEVELOPMENT", "ZUKER-STIEGLER", "McCASKILL", "BOUNDED DISCOUNT",
]

const MARQUEE_ITEMS_2 = [
  "OPEN SOURCE", "OPEN COMMONS", "INVERSE FOLDING", "ZERO-DISCOUNT DEFAULT",
  "PUBLIC REPOSITORY", "12.5 $RIBO/BLOCK (PLANNED)", "VERIFIED ON-CHAIN",
  "ANTI-TARGET EXCLUSION", "PARTITION FUNCTION", "CEILING INVARIANCE",
  "PRE-TESTNET",
]

export function MarqueeBand() {
  return (
    <div
      className="overflow-hidden select-none"
      style={{ borderTop: "2px solid var(--accent)", borderBottom: "2px solid var(--accent)", background: "var(--accent)" }}
    >
      {/* Row 1 */}
      <div
        className="flex py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div
          className="flex gap-6 whitespace-nowrap"
          style={{ animation: "marqueeLeft 25s linear infinite" }}
        >
          {[...MARQUEE_ITEMS_1, ...MARQUEE_ITEMS_1].map((item, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <div className="w-1 h-1" style={{ background: "rgba(255,255,255,0.6)" }} />
              <span className="font-mono font-bold text-xs tracking-widest text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — reversed */}
      <div className="flex py-2.5">
        <div
          className="flex gap-6 whitespace-nowrap"
          style={{ animation: "marqueeRight 20s linear infinite" }}
        >
          {[...MARQUEE_ITEMS_2, ...MARQUEE_ITEMS_2].map((item, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <div className="w-1 h-1" style={{ background: "rgba(255,255,255,0.4)" }} />
              <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
