"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { RiboLogo } from "./ribo-logo"

// SSR-safe "is mounted" flag without calling setState inside an effect.
function subscribe() {
  return () => {}
}
function getClientSnapshot() {
  return true
}
function getServerSnapshot() {
  return false
}

const NAV_LINKS = [
  { label: "Protocol",   href: "/#protocol" },
  { label: "Science",    href: "/#science" },
  { label: "Settings",   href: "/#settings" },
  { label: "Tokenomics", href: "/#tokenomics" },
  { label: "Roadmap",    href: "/#roadmap" },
  { label: "FAQ",        href: "/#faq" },
  { label: "Whitepaper", href: "/RIBO_Whitepaper.pdf", external: true },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  // useSyncExternalStore avoids the React 19 "setState in effect" warning for
  // the mounted flag.
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href.startsWith("/#")) {
      if (typeof window === "undefined") return false
      return window.location.hash === href.substring(1)
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--bg-elevated) 88%, transparent)"
          : "transparent",
        borderBottom: scrolled ? `1px solid var(--border)` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <RiboLogo size={36} variant="dark" animated title="RIBO — Bounded-Composition Useful Proof-of-Work" />
          <span
            className="font-mono font-bold text-sm tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            RIBOSOME
          </span>
          <span
            className="hidden sm:inline font-mono text-xs px-1.5 py-0.5"
            style={{ background: "var(--accent)", color: "var(--accent-on)", fontSize: "9px" }}
          >
            $RIBO
          </span>
        </Link>

        {/* Status badge (desktop) — IN DEVELOPMENT */}
        <Link
          href="#roadmap"
          className="hidden xl:flex items-center gap-2 px-3 py-1 font-mono text-xs transition-colors"
          style={{ border: "1px solid var(--border)", color: "var(--accent)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--warning)", animation: "pulse-blue 1.8s ease-in-out infinite" }}
          />
          IN DEVELOPMENT · PRE-TESTNET
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(l => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.label}
                href={l.href}
                className="px-2.5 py-1.5 font-mono text-[11px] tracking-widest transition-all duration-150"
                style={{
                  color: active ? "var(--accent)" : "var(--fg-muted)",
                  background: active ? "var(--accent-soft)" : "transparent",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    ;(e.currentTarget as HTMLElement).style.color = "var(--accent)"
                    ;(e.currentTarget as HTMLElement).style.background = "var(--accent-soft)"
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    ;(e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"
                    ;(e.currentTarget as HTMLElement).style.background = "transparent"
                  }
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Right cluster: theme + CTA */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center transition-all duration-150"
              style={{
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
                background: "transparent",
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"
                ;(e.currentTarget as HTMLElement).style.color = "var(--accent)"
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                ;(e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"
              }}
            >
              {resolvedTheme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          <a
            href="#roadmap"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-widest text-white transition-all duration-150"
            style={{
              background: "var(--accent)",
              border: "2px solid var(--accent)",
              boxShadow: "3px 3px 0 var(--fg)",
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.transform = "translate(-1px,-1px)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--fg)"
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.transform = "none"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 var(--fg)"
            }}
          >
            TRACK DEVELOPMENT
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(v => !v)}
            className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="menu"
          >
            <span
              className="block h-0.5 transition-all duration-300"
              style={{
                width: "20px",
                background: "var(--accent)",
                transform: open ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-0.5 transition-all duration-300"
              style={{ width: "20px", background: "var(--accent)", opacity: open ? 0 : 1 }}
            />
            <span
              className="block h-0.5 transition-all duration-300"
              style={{
                width: "20px",
                background: "var(--accent)",
                transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "560px" : "0" }}
      >
        <div
          className="px-4 py-3 flex flex-col gap-0.5"
          style={{
            background: "color-mix(in srgb, var(--bg-elevated) 96%, transparent)",
            borderTop: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 font-mono text-xs tracking-widest transition-colors"
              style={{
                color: isActive(l.href) ? "var(--accent)" : "var(--fg-muted)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#roadmap"
            onClick={() => setOpen(false)}
            className="mt-3 px-4 py-3 font-mono text-xs font-bold tracking-widest text-center"
            style={{ background: "var(--accent)", color: "var(--accent-on)" }}
          >
            TRACK DEVELOPMENT →
          </a>
        </div>
      </div>
    </header>
  )
}
