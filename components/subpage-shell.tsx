"use client"

import Link from "next/link"
import { SiteNav } from "./site-nav"
import { SiteFooter } from "./site-footer"
import { LiveStats } from "./live-stats"

export function SubpageShell({
  children,
  showStats = true,
}: {
  children: React.ReactNode
  showStats?: boolean
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <SiteNav />
      {showStats && (
        <div className="pt-14">
          <LiveStats />
        </div>
      )}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

export function CtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: string
  description: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section
      className="py-20 px-4 md:px-8 relative overflow-hidden"
      style={{ background: "var(--accent)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative max-w-4xl mx-auto text-center">
        <h2
          className="font-sans font-bold text-3xl md:text-5xl leading-tight tracking-tight text-white mb-4"
        >
          {title}
        </h2>
        <p className="font-sans text-base md:text-lg leading-relaxed text-white/75 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={primary.href}
            className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm font-bold tracking-widest transition-all duration-150"
            style={{ background: "white", color: "var(--accent)" }}
          >
            {primary.label} ↗
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm font-bold tracking-widest transition-all duration-150"
              style={{ background: "transparent", color: "white", border: "2px solid white" }}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
