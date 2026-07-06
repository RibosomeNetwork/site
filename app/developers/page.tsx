"use client"

import { SubpageShell, CtaBand } from "@/components/subpage-shell"
import { PageHeader } from "@/components/page-header"
import { SubmissionFlow } from "@/components/submission-flow"
import { AttackStrategyExplorer } from "@/components/attack-strategy"

const NODE_TIERS = [
  { name: "Pruned (light)", disk: "< 5 GB",   ram: "2 GB", cpu: "1 vCPU",  role: "Wallet, RPC client, monitoring" },
  { name: "Full (default)", disk: "~50 GB",   ram: "8 GB", cpu: "4 vCPU",  role: "Validating node, gossip relay" },
  { name: "Archival",       disk: "~1.5 TB",  ram: "32 GB",cpu: "8 vCPU",  role: "Historical queries, block explorer backend" },
]

const RPC = [
  { method: "ribo_getBeacon", desc: "Returns the current period's epoch_beacon and the window it is valid within." },
  { method: "ribo_getDiscount", desc: "Returns δ(k) and δ_max for a given period. δ(k) updates as accepted submissions land." },
  { method: "ribo_getSubmission", desc: "Returns a full Submission object by its identifier." },
  { method: "ribo_submitProof", desc: "Accepts a signed Submission. Returns acceptance status and inclusion height." },
  { method: "ribo_getVDFState", desc: "Returns current VDF step, sequencer, and last finalized output." },
]

const STACK = [
  { layer: "Consensus",       tech: "Class Group VDF + VDF/Hash merge-mine", link: "#" },
  { layer: "Execution Proof", tech: "RISC Zero / SP1 (zkVM)",                  link: "#" },
  { layer: "Verifier Binary", tech: "Zuker-Stiegler + McCaskill, fixed-point int", link: "/glossary" },
  { layer: "Challenge Class", tech: "RNA inverse design (rotates with future classes)", link: "/glossary" },
  { layer: "Mempool",         tech: "Gossip v2 with per-key submission caps",  link: "#" },
  { layer: "Wallet / Sig",    tech: "Post-quantum signature keypair",         link: "#" },
]

export default function DevelopersPage() {
  return (
    <SubpageShell>
      <PageHeader
        eyebrow="FOR DEVELOPERS"
        title="Build on a"
        highlight="bounded protocol."
        description="Every primitive in RIBO is a published cryptographic construction. Every assumption is named. The interface is small. The security model is honest. This page is the engineering entry point."
      />

      {/* Stack overview */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            STACK
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Six layers, each with a known primitive.
          </h2>
          <div className="flex flex-col">
            {STACK.map((s, i) => (
              <div
                key={s.layer}
                className="grid grid-cols-12 gap-3 items-center px-4 py-3"
                style={{
                  background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: i === STACK.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span className="col-span-1 font-mono text-[10px] tracking-widest" style={{ color: "var(--fg-subtle)" }}>
                  L{STACK.length - i}
                </span>
                <span className="col-span-3 font-mono text-xs font-bold tracking-widest" style={{ color: "var(--accent)" }}>
                  {s.layer}
                </span>
                <span className="col-span-7 font-sans text-sm" style={{ color: "var(--fg)" }}>{s.tech}</span>
                <a
                  href={s.link}
                  className="col-span-1 font-mono text-[10px] text-right"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {s.link === "#" ? "GH ↗" : "REF →"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Node setup */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            NODE SETUP
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Pick a tier. Run it yourself.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {NODE_TIERS.map(t => (
              <div key={t.name} className="p-5" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <h3 className="font-sans font-bold text-base mb-3" style={{ color: "var(--fg)" }}>{t.name}</h3>
                <dl className="font-mono text-xs space-y-1 mb-3" style={{ color: "var(--fg-muted)" }}>
                  <div className="flex justify-between"><dt>Disk</dt><dd style={{ color: "var(--fg)" }}>{t.disk}</dd></div>
                  <div className="flex justify-between"><dt>RAM</dt><dd style={{ color: "var(--fg)" }}>{t.ram}</dd></div>
                  <div className="flex justify-between"><dt>CPU</dt><dd style={{ color: "var(--fg)" }}>{t.cpu}</dd></div>
                </dl>
                <p className="font-sans text-xs" style={{ color: "var(--fg-muted)" }}>{t.role}</p>
              </div>
            ))}
          </div>
          <pre
            className="font-mono text-xs leading-6 p-4 overflow-x-auto"
            style={{ background: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >{`# Build from source
git clone https://github.com/ribosome-network/ribo.git
cd ribo && cargo build --release --features full-node

# Run
./target/release/ribo node \\
  --network mainnet \\
  --data-dir /var/lib/ribo \\
  --rpc 127.0.0.1:8545 \\
  --tier full

# Or via Docker
docker run -d --name ribo-node \\
  -p 8545:8545 -p 30303:30303 \\
  -v /var/lib/ribo:/data \\
  ribosome/ribo:latest --tier full`}</pre>
        </div>
      </section>

      {/* Submission spec */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            PROTOCOL MESSAGE
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>
            Submission format, exact.
          </h2>
          <p className="font-sans text-sm mb-8 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
            The wire format is intentionally minimal. A submission is counted if and only if the beacon is fresh, the per-key cap is respected, and the zkVM proof verifies.
          </p>
          <SubmissionFlow />
        </div>
      </section>

      {/* RPC */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            JSON-RPC
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Five custom methods. Standard transport.
          </h2>
          <div className="flex flex-col">
            {RPC.map((m, i) => (
              <div
                key={m.method}
                className="grid grid-cols-12 gap-3 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? "var(--bg)" : "var(--bg-inset)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: i === RPC.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span className="col-span-4 font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>{m.method}</span>
                <span className="col-span-8 font-sans text-sm" style={{ color: "var(--fg-muted)" }}>{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attack surface */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            SECURITY CHECKLIST
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>
            The 7 attacks a complete proof must rule out.
          </h2>
          <p className="font-sans text-sm mb-8 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
            The ceiling invariance is unconditional. The strategy-proofness argument is what a full implementation must close. Each row is a public bug bounty target.
          </p>
          <AttackStrategyExplorer />
        </div>
      </section>

      <CtaBand
        title="Open bounty. Real money. Real proofs."
        description="$250K RIBO is allocated to any contributor who closes one of the open items in the security checklist above. Independent review is built into the claim process."
        primary={{ label: "OPEN BOUNTY", href: "#" }}
        secondary={{ label: "GitHub", href: "#" }}
      />
    </SubpageShell>
  )
}
