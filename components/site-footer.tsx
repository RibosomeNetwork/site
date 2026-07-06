"use client"

import Link from "next/link"

const SECTIONS = [
  {
    title: "PROTOCOL",
    links: [
      { label: "Architecture",    href: "/#protocol" },
      { label: "Science",         href: "/#science" },
      { label: "Tokenomics",      href: "/#tokenomics" },
      { label: "Roadmap",         href: "/#roadmap" },
    ],
  },
  {
    title: "BUILD",
    links: [
      { label: "Miners",          href: "/miners" },
      { label: "Researchers",     href: "/researchers" },
      { label: "Developers",      href: "/developers" },
      { label: "Glossary",        href: "/glossary" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Whitepaper",      href: "/RIBO_Whitepaper.pdf", ext: true },
      { label: "GitHub",          href: "#", ext: true },
      { label: "Documentation",   href: "#" },
      { label: "Block Explorer",  href: "#" },
      { label: "Discord",         href: "#", ext: true },
      { label: "Twitter",         href: "#", ext: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--bg-inset)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center font-mono font-bold text-base"
                style={{ background: "var(--accent)", border: "2px solid var(--accent)", color: "var(--accent-on)" }}
              >
                R
              </div>
              <span className="font-mono font-bold text-base tracking-widest" style={{ color: "var(--fg)" }}>
                RIBOSOME NETWORK
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed max-w-sm mb-6" style={{ color: "var(--fg-muted)" }}>
              Bounded-Composition Useful Proof-of-Work. Security from sequential time. Useful work earns a bounded discount — never more.
            </p>
            <Link
              href="/RIBO_Whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold tracking-widest transition-all duration-150"
              style={{
                border: "1px solid var(--border-strong)",
                color: "var(--fg)",
                background: "transparent",
              }}
            >
              DOWNLOAD WHITEPAPER ↗
            </Link>
          </div>

          {SECTIONS.map(s => (
            <div key={s.title}>
              <div
                className="font-mono text-xs tracking-widest mb-5"
                style={{ color: "var(--fg-subtle)" }}
              >
                {s.title}
              </div>
              <div className="flex flex-col gap-3">
                {s.links.map(l => (
                  <Link
                    key={l.label}
                    href={l.href}
                    target={l.ext ? "_blank" : undefined}
                    rel={l.ext ? "noopener noreferrer" : undefined}
                    className="font-mono text-xs transition-colors duration-150"
                    style={{ color: "var(--fg-muted)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)" }}
                  >
                    {l.label} {l.ext ? "↗" : ""}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span className="font-mono text-xs" style={{ color: "var(--fg-subtle)" }}>
          © 2025 Ribosome Network. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Audit"].map(l => (
            <a
              key={l}
              href="#"
              className="font-mono text-xs transition-colors duration-150"
              style={{ color: "var(--fg-subtle)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)" }}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5" style={{ background: "var(--success)", animation: "pulse-blue 2s ease-in-out infinite" }} />
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            MAINNET LIVE
          </span>
        </div>
      </div>
    </footer>
  )
}
