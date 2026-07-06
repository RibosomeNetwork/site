"use client"

import { SubpageShell, CtaBand } from "@/components/subpage-shell"
import { PageHeader } from "@/components/page-header"
import { SubmissionFlow } from "@/components/submission-flow"

const FLOW = [
  { actor: "You", action: "Specify target structures, anti-targets, conditions", output: "Instance commit" },
  { actor: "Escrow", action: "Lock payment in $RIBO against the instance", output: "Job opened" },
  { actor: "Solvers", action: "Find candidate sequences, generate zkVM proofs", output: "Valid submissions" },
  { actor: "Consensus", action: "Count distinct fresh proofs → k; apply δ(k)", output: "Discount" },
  { actor: "Period", action: "Results attached to accepted submissions; escrow released", output: "Pay-out" },
]

const API_EXAMPLES = [
  {
    title: "Submit a job",
    code: `POST /v1/jobs
Authorization: Bearer <RIBO_API_KEY>
Content-Type: application/json

{
  "title": "siRNA targeting exon-12 skipping",
  "kind": "rna.inverse_fold",
  "targets": ["((((...))))....."],
  "anti_targets": ["..((..)).."],
  "conditions": ["37C", "1mM_Mg"],
  "budget": "50000 RIBO",
  "deadline_blocks": 2016
}`,
  },
  {
    title: "Fetch results",
    code: `GET /v1/jobs/job_0xab12.../results
Authorization: Bearer <RIBO_API_KEY>

{
  "job_id": "job_0xab12...",
  "accepted": 142,
  "results": [
    {
      "submission_id": "0x...",
      "candidate_sequence": "AUGCGAAUUCGGCUAGCUAG...",
      "energy_kcal": -42.7,
      "binding_probability": 0.94,
      "submitter": "ribo1q...2f4e",
      "block": 847291
    }
  ]
}`,
  },
  {
    title: "Webhook on completion",
    code: `POST https://your.lab/webhooks/ribo
Content-Type: application/json
X-RIBO-Signature: ed25519:...

{
  "event": "job.completed",
  "job_id": "job_0xab12...",
  "accepted_count": 142,
  "delta_max_reached": false,
  "summary_url": "https://ribosome.network/jobs/0xab12..."
}`,
  },
]

const PRICING = [
  { tier: "RESEARCH",   cap: "10K RIBO / job",  features: ["Standard escrow", "Public results", "REST + Webhook"] },
  { tier: "INSTITUTE",  cap: "250K RIBO / job", features: ["Priority queue", "Private results", "REST + Webhook + gRPC", "SLA"] },
  { tier: "PHARMA",     cap: "Uncapped",        features: ["Custom challenge class", "On-prem verifier", "Direct line to core team", "Audit trail"] },
]

export default function ResearchersPage() {
  return (
    <SubpageShell>
      <PageHeader
        eyebrow="FOR RESEARCHERS"
        title="Get RNA candidates."
        highlight="On-chain verified."
        description="Submit RNA inverse design tasks to the Ribosome Network. Solvers race to find candidates, generate zkVM execution proofs of the canonical verifier, and earn a share of your escrow. You get a permanent on-chain record of every accepted result."
      />

      {/* Job flow */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            JOB LIFECYCLE
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            From problem statement to verified result.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {FLOW.map((f, i) => (
              <div
                key={i}
                className="p-4"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: "var(--accent)" }}>
                  {f.actor.toUpperCase()}
                </div>
                <p className="font-sans text-xs leading-snug mb-2" style={{ color: "var(--fg)" }}>{f.action}</p>
                <div
                  className="font-mono text-[10px] px-1.5 py-0.5"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  → {f.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission format */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            ON-CHIN SUBMISSION
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>
            What every accepted result looks like.
          </h2>
          <p className="font-sans text-sm mb-8 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
            Hover any field to see why it matters. Critical fields bind to freshness, soundness, or replay-resistance assumptions.
          </p>
          <SubmissionFlow />
        </div>
      </section>

      {/* API */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            INTEGRATION
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Three endpoints. Production-ready.
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {API_EXAMPLES.map(e => (
              <div key={e.title} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <div
                  className="px-4 py-2 font-mono text-[10px] tracking-widest"
                  style={{ borderBottom: "1px solid var(--border)", color: "var(--accent)" }}
                >
                  {e.title}
                </div>
                <pre
                  className="font-mono text-xs leading-6 p-4 overflow-x-auto"
                  style={{ color: "var(--fg)" }}
                >{e.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            PRICING
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Pay per accepted result. No subscription.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING.map(p => (
              <div
                key={p.tier}
                className="p-6"
                style={{ background: "var(--bg)", border: `1px solid ${p.tier === "INSTITUTE" ? "var(--accent)" : "var(--border)"}` }}
              >
                <div
                  className="font-mono text-[10px] tracking-widest mb-1"
                  style={{ color: p.tier === "INSTITUTE" ? "var(--accent)" : "var(--fg-subtle)" }}
                >
                  {p.tier}
                </div>
                <div className="font-mono font-bold text-xl mb-4" style={{ color: "var(--fg)" }}>{p.cap}</div>
                <ul className="space-y-2">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 font-sans text-xs" style={{ color: "var(--fg-muted)" }}>
                      <span
                        className="w-3 h-3 mt-1 shrink-0 flex items-center justify-center"
                        style={{ background: p.tier === "INSTITUTE" ? "var(--accent)" : "var(--fg-subtle)" }}
                      >
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                          <path d="M1 3L2.5 4.5L5 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Submit your first job this week."
        description="Beta access includes a $5K RIBO credit for academic labs. Production escrow and SLA available for pharma and biotech."
        primary={{ label: "GET API KEY", href: "#" }}
        secondary={{ label: "Talk to a researcher", href: "#" }}
      />
    </SubpageShell>
  )
}
