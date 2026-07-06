"use client"

import { SiteNav } from "@/components/site-nav"
import { HeroSection } from "@/components/hero-section"
import { MarqueeBand } from "@/components/marquee-band"
import { AudienceSection } from "@/components/audience-section"
import { ProtocolSection } from "@/components/protocol-section"
import { ScienceSection } from "@/components/science-section"
import { TokenomicsSection } from "@/components/tokenomics-section"
import { RoadmapSection } from "@/components/roadmap-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { LiveStats } from "@/components/live-stats"

export default function RiboPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <SiteNav />
      <HeroSection />
      <div className="halftone-bg-sm border-y" style={{ borderColor: "var(--border)" }}>
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
