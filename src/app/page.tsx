"use client"

import { SiteNav } from "@/components/ribo/site-nav"
import { HeroSection } from "@/components/ribo/hero-section"
import { MarqueeBand } from "@/components/ribo/marquee-band"
import { AudienceSection } from "@/components/ribo/audience-section"
import { ProtocolSection } from "@/components/ribo/protocol-section"
import { ScienceSection } from "@/components/ribo/science-section"
import { TokenomicsSection } from "@/components/ribo/tokenomics-section"
import { RoadmapSection } from "@/components/ribo/roadmap-section"
import { FAQSection } from "@/components/ribo/faq-section"
import { CTASection } from "@/components/ribo/cta-section"
import { SiteFooter } from "@/components/ribo/site-footer"
import { LiveStats } from "@/components/ribo/live-stats"

export default function RiboPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      <SiteNav />
      <HeroSection />
      <div
        className="halftone-bg-sm border-y"
        style={{ borderColor: "var(--border)" }}
      >
        <MarqueeBand />
      </div>
      <LiveStats />
      <AudienceSection />
      <ProtocolSection />
      <ScienceSection />
      <MarqueeBand />
      <TokenomicsSection />
      <RoadmapSection />
      <FAQSection />
      <CTASection />
      <SiteFooter />
    </div>
  )
}
