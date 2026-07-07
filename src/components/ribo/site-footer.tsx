"use client"

import Link from "next/link"
import { RiboLogo } from "./ribo-logo"

const SECTIONS = [
  {
    title: "PROTOCOL",
    links: [
      { label: "Architecture",  href: "/#protocol" },
      { label: "Science",       href: "/#science" },
      { label: "Settings",      href: "/#settings" },
      { label: "Tokenomics",    href: "/#tokenomics" },
      { label: "Roadmap",       href: "/#roadmap" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "FAQ",           href: "/#faq" },
      { label: "GitHub",        href: "https://github.com/RibosomeNetwork/site", ext: true },
      { label: "Documentation", href: "/#protocol" },
      { label: "Whitepaper",    href: "/RIBO_Whitepaper.pdf", ext: true },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      { label: "Discord",       href: "#", ext: true },
      { label: "Twitter / X",   href: "#", ext: true },
      { label: "Mailing List",  href: "/#mine" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--bg-inset)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <RiboLogo size={44} variant="dark" animated title="RIBO" />
              <span className="font-mono font-bold text-base tracking-widest" style={{ color: "var(--fg)" }}>
                RIBOSOME NETWORK
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed max-w-sm mb-6" style={{ color: "var(--fg-muted)" }}>
              Bounded-Composition Useful Proof-of-Work. Security from sequential time. Useful work earns a bounded discount — never more. Currently in active development; no token has been deployed.
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs tracking-widest"
              style={{ border: "1px solid var(--warning)", color: "var(--warning)", background: "color-mix(in srgb, var(--warning) 8%, transparent)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--warning)", animation: "pulse-blue 1.6s ease-in-out infinite" }}
              />
              IN DEVELOPMENT — NO TOKEN DEPLOYED
            </div>
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
          {["Privacy", "Terms"].map(l => (
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
          <div className="w-1.5 h-1.5" style={{ background: "var(--warning)", animation: "pulse-blue 2s ease-in-out infinite" }} />
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            IN DEVELOPMENT
          </span>
        </div>
      </div>
    </footer>
  )
}
