"use client"

export function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string
  title: string
  highlight: string
  description: string
}) {
  return (
    <section
      className="relative pt-32 pb-16 px-4 md:px-8 overflow-hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute top-0 right-0 w-[50%] h-[80%] pointer-events-none"
        style={{ background: "linear-gradient(225deg, var(--accent-soft) 0%, transparent 70%)" }}
      />
      <div className="relative max-w-5xl mx-auto page-fade">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
          style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
        >
          {eyebrow}
        </div>
        <h1
          className="font-sans font-bold leading-[0.98] tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
            color: "var(--fg)",
          }}
        >
          {title} <span style={{ color: "var(--accent)" }}>{highlight}</span>
        </h1>
        <p
          className="font-sans text-lg leading-relaxed max-w-3xl"
          style={{ color: "var(--fg-muted)" }}
        >
          {description}
        </p>
      </div>
    </section>
  )
}
