"use client"

import { useRef, useEffect, useState } from "react"

const AUDIENCES = [
  {
    id: "miners",
    tag: "FOR MINERS",
    headline: "Useful work. Bounded cost.",
    subhead: "Run the canonical RNA verifier, generate a knowledge-sound zkVM execution proof, submit it bound to a fresh beacon. The protocol's security is sequential; the useful part earns a bounded discount.",
    points: [
      "CUDA / Apple Silicon / modern x86",
      "Proof generation: minutes to tens of minutes",
      "Verification by any full node: milliseconds",
      "Block reward: 12.5 $RIBO, halving every 210,000 blocks",
      "Per-key submission cap — concentration-resistant by design",
    ],
    stat: { v: "142", l: "Active Provers" },
    color: "var(--accent)",
    img: "/gpu.png",
  },
  {
    id: "institutions",
    tag: "FOR INSTITUTIONS",
    headline: "R&D compute, on-chain verified.",
    subhead: "Pharmaceutical companies, research hospitals, and biotech firms submit computational tasks directly. The verifier is fixed, the proof is knowledge-sound, the result is permanent.",
    points: [
      "Submit RNA inverse design jobs via REST or on-chain",
      "Every accepted result carries a zkVM execution proof",
      "Permanent on-chain record — cite the block, not the institution",
      "Per-key submission caps prevent single-actor dominance",
      "Direct integration with your AlphaFold-style pipeline",
    ],
    stat: { v: "$2.4M", l: "Escrow Volume" },
    color: "var(--fg)",
    img: "/blockchain.png",
  },
  {
    id: "academics",
    tag: "FOR ACADEMICS",
    headline: "Publish computation. Earn $RIBO.",
    subhead: "Submit open research problems to the network. Verified solutions are immutably anchored on-chain — timestamped proof of discovery. The ceiling on coupling means the reward never silently erodes security.",
    points: [
      "Submit biological computation problems as transactions",
      "On-chain immutable timestamping of discoveries",
      "Cite block hash as permanent proof-of-record",
      "DAO governance over research priority queue",
      "Grant allocation via community vote",
    ],
    stat: { v: "847", l: "Open Problems" },
    color: "var(--accent)",
    img: "/rna.png",
  },
]

function AudienceCard({ a, index }: { a: typeof AUDIENCES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
      style={{
        border: "2px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Image panel — kept dark for visual contrast in both themes */}
      <div
        className={`relative overflow-hidden min-h-[320px] ${isEven ? "lg:order-first" : "lg:order-last"}`}
        style={{ background: "#0D0D2B" }}
      >
        <img
          src={a.img}
          alt={a.tag}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? "linear-gradient(to right, rgba(13,13,43,0.4), transparent)"
              : "linear-gradient(to left, rgba(13,13,43,0.4), transparent)",
          }}
        />
        {/* Stat badge */}
        <div className="absolute bottom-6 left-6">
          <div
            className="px-4 py-3"
            style={{ background: a.color, border: "2px solid white", boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}
          >
            <div className="font-mono font-bold text-3xl text-white">{a.stat.v}</div>
            <div className="font-mono text-xs tracking-widest text-white/70">{a.stat.l}</div>
          </div>
        </div>
        {/* Tag */}
        <div className="absolute top-6 left-6">
          <div
            className="px-3 py-1 font-mono text-xs font-bold tracking-widest"
            style={{ background: "rgba(244,244,255,0.95)", color: a.color === "var(--fg)" ? "#0D0D2B" : "var(--accent)" }}
          >
            {a.tag}
          </div>
        </div>
      </div>

      {/* Text panel */}
      <div
        className="p-8 md:p-12 flex flex-col justify-center"
        style={{ background: "var(--bg-elevated)" }}
      >
        <h3
          className="font-sans font-bold text-3xl md:text-4xl leading-tight mb-4"
          style={{ color: "var(--fg)" }}
        >
          {a.headline}
        </h3>
        <p
          className="font-sans text-base leading-relaxed mb-8"
          style={{ color: "var(--fg-muted)" }}
        >
          {a.subhead}
        </p>
        <ul className="flex flex-col gap-3 mb-8">
          {a.points.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className="w-4 h-4 shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: a.color }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
                {p}
              </span>
            </li>
          ))}
        </ul>
        <a
          href={a.id === "miners" ? "/miners" : a.id === "institutions" ? "/researchers" : "/RIBO_Whitepaper.pdf"}
          target={a.id === "academics" ? "_blank" : undefined}
          className="inline-flex self-start items-center gap-2 px-5 py-3 font-mono text-xs font-bold tracking-widest transition-all duration-150"
          style={{
            background: a.color,
            border: `2px solid ${a.color}`,
            boxShadow: `3px 3px 0 var(--fg)`,
            color: a.color === "var(--fg)" ? "var(--fg-inverse)" : "var(--accent-on)",
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"
            ;(e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 var(--fg)"
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.transform = "none"
            ;(e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 var(--fg)"
          }}
        >
          {a.id === "miners" ? "START MINING →" : a.id === "institutions" ? "SUBMIT JOB →" : "READ WHITEPAPER →"}
        </a>
      </div>
    </div>
  )
}

export function AudienceSection() {
  return (
    <section
      id="mine"
      className="py-24 px-4 md:px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-4"
              style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
            >
              WHO RUNS RIBO
            </div>
            <h2
              className="font-sans font-bold text-4xl md:text-6xl leading-tight tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Built for every<br />type of operator.
            </h2>
          </div>
          <p
            className="font-sans text-base leading-relaxed max-w-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            Whether you're running a prover farm or a research lab, the Ribosome Network turns your compute into a bounded, verifiable claim on chain.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {AUDIENCES.map((a, i) => (
            <AudienceCard key={a.id} a={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
