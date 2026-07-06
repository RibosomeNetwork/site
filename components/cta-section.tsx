"use client"

import { useState } from "react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [role, setRole] = useState<"miner" | "institution" | "researcher">("miner")

  return (
    <section
      className="py-24 px-4 md:px-8 relative overflow-hidden"
      style={{ background: "var(--accent)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className="absolute top-0 right-0 w-[60%] h-full pointer-events-none overflow-hidden"
        style={{ opacity: 0.07 }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              height: "2px",
              width: "200%",
              background: "white",
              top: `${i * 7}%`,
              transform: "rotate(-30deg)",
              transformOrigin: "left center",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-8"
          style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
        >
          EARLY MINER PROGRAM
        </div>

        <h2 className="font-sans font-bold text-5xl md:text-7xl leading-[0.95] tracking-tight text-white mb-6">
          Useful work.<br />Bounded reward.
        </h2>

        <p className="font-sans text-lg leading-relaxed text-white/80 mb-10 max-w-2xl mx-auto">
          Join 14,298 provers already contributing to RNA inverse design, off-target avoidance, and partition-function analysis. The same rig. A bounded purpose.
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {(["miner", "institution", "researcher"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="px-4 py-2 font-mono text-xs font-bold tracking-widest transition-all duration-150"
              style={{
                background: role === r ? "white" : "transparent",
                color: role === r ? "var(--accent)" : "rgba(255,255,255,0.7)",
                border: "2px solid",
                borderColor: role === r ? "white" : "rgba(255,255,255,0.3)",
                boxShadow: role === r ? "3px 3px 0 rgba(0,0,0,0.2)" : "none",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {!submitted ? (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 font-mono text-sm"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.35)",
                color: "white",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="px-6 py-3 font-mono text-sm font-bold tracking-widest transition-all duration-150"
              style={{
                background: "white",
                color: "var(--accent)",
                border: "2px solid white",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 rgba(0,0,0,0.2)"
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.transform = "none"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 rgba(0,0,0,0.2)"
              }}
            >
              JOIN EARLY →
            </button>
          </form>
        ) : (
          <div
            className="inline-flex items-center gap-3 px-6 py-4 font-mono text-sm"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.4)",
              color: "white",
            }}
          >
            <div className="w-2 h-2" style={{ background: "var(--success)" }} />
            You're in. We'll send setup instructions to {email}.
          </div>
        )}

        <div className="mt-10 grid grid-cols-3 gap-0 max-w-md mx-auto">
          {[
            { v: "14,298", l: "Miners" },
            { v: "847K",   l: "Blocks" },
            { v: "15%",    l: "Max Discount" },
          ].map((s, i) => (
            <div
              key={i}
              className="py-3 text-center"
              style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }}
            >
              <div className="font-mono font-bold text-xl text-white">{s.v}</div>
              <div className="font-mono text-xs tracking-widest text-white/65 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
