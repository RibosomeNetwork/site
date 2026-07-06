"use client"

import { SubpageShell, CtaBand } from "@/components/subpage-shell"
import { PageHeader } from "@/components/page-header"
import { ArchitectureDiagram } from "@/components/architecture-diagram"

const HW_TIERS = [
  {
    tier: "MIN",
    name: "Tier 1 — Reference",
    cpu: "Modern x86 (AVX2) or Apple Silicon",
    ram: "16 GB",
    storage: "100 GB SSD",
    network: "100 Mbps symmetric",
    expected: "Submit every few periods. Best for testing the prover pipeline.",
    color: "var(--fg-muted)",
  },
  {
    tier: "PRO",
    name: "Tier 2 — Prover",
    cpu: "16+ cores server-grade, AVX-512",
    ram: "64 GB ECC",
    storage: "1 TB NVMe",
    network: "1 Gbps symmetric",
    expected: "Submit multiple per period. Recommend baseline node operators.",
    color: "var(--accent)",
  },
  {
    tier: "MAX",
    name: "Tier 3 — Pool",
    cpu: "Multi-socket EPYC / Xeon, 64+ cores",
    ram: "256 GB ECC",
    storage: "4 TB NVMe (RAID)",
    network: "10 Gbps, low-latency",
    expected: "Pool-scale throughput. Required for high-volume submission across many beacon windows.",
    color: "var(--fg)",
  },
]

const STEPS = [
  {
    n: "01",
    title: "Install the RIBO prover",
    desc: "Pull the prebuilt binary or build from source. The prover bundles the canonical RNA verifier binary, the VDF evaluator, and the zkVM client.",
    code: "# macOS / Linux\ncurl -fsSL https://ribosome.network/install.sh | bash\nribo init --tier pro",
  },
  {
    n: "02",
    title: "Sync a full node (or use a public RPC)",
    desc: "You need a current view of the chain to read the active beacon. A pruned node is enough for mining; full archival is only needed for validators.",
    code: "ribo node --network mainnet --prune=light\n# exposes http://127.0.0.1:8545",
  },
  {
    n: "03",
    title: "Watch the beacon window",
    desc: "The prover polls for a fresh epoch_beacon (H of recent block hashes). The window is short: start as soon as a fresh beacon appears.",
    code: "ribo watch --beacon-window\n# LOG: beacon @ period 422 — opens for 0:32",
  },
  {
    n: "04",
    title: "Solve and prove",
    desc: "Find an RNA candidate that satisfies the verifier, then generate a zkVM execution proof bound to the beacon. Proof generation takes minutes on Tier 2 hardware.",
    code: "ribo solve \\\n  --instance 0xab12... \\\n  --beacon   0xef56... \\\n  --cycles   134217728",
  },
  {
    n: "05",
    title: "Submit",
    desc: "The signed submission is gossiped to the network. Valid submissions are counted toward k and contribute to δ(k) for that period.",
    code: "ribo submit proof.json \\\n  --fee 0.001 RIBO \\\n  --key ~/.ribo/keys/miner.sk",
  },
]

const REWARDS = [
  { label: "Block subsidy",      val: "12.5 $RIBO",     desc: "Halves every 210,000 blocks (Bitcoin-equivalent cadence)." },
  { label: "Useful-work share",  val: "δ(k) · subsidy", desc: "Per-period split among accepted submissions, weighted by √k concavity." },
  { label: "VDF evaluator fee",  val: "0.05 $RIBO",     desc: "Paid by the period's block producer to the VDF sequencer." },
  { label: "Submitter cap",      val: "1% of period k", desc: "Per-key cap recomputed each period. New keys → no advantage." },
]

export default function MinersPage() {
  return (
    <SubpageShell>
      <PageHeader
        eyebrow="FOR MINERS"
        title="Useful work,"
        highlight="bounded."
        description="Mine RIBO by generating knowledge-sound zkVM execution proofs of the canonical RNA verifier. The hard part is sequential (the VDF floor). The useful part is bounded (the discount off that floor). Here's how to run a prover that does both."
      />

      {/* Architecture quick-read */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
                ARCHITECTURE
              </div>
              <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight" style={{ color: "var(--fg)" }}>
                The two halves of your work.
              </h2>
            </div>
            <p className="font-sans text-sm max-w-md" style={{ color: "var(--fg-muted)" }}>
              You are paid for submitting <em>accepted</em> zkVM execution proofs. The VDF and the discount are applied by the protocol — not by your hardware.
            </p>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Hardware tiers */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            HARDWARE
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Pick a tier. You can upgrade later.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HW_TIERS.map(t => (
              <div
                key={t.tier}
                className="p-6 flex flex-col gap-3"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <div
                  className="font-mono text-[10px] tracking-widest px-2 py-0.5 self-start"
                  style={{ background: t.color, color: t.color === "var(--fg)" ? "var(--bg)" : "white" }}
                >
                  {t.tier}
                </div>
                <h3 className="font-sans font-bold text-lg" style={{ color: "var(--fg)" }}>{t.name}</h3>
                <dl className="font-mono text-xs space-y-1.5" style={{ color: "var(--fg-muted)" }}>
                  <div className="flex justify-between gap-2"><dt>CPU</dt><dd className="text-right" style={{ color: "var(--fg)" }}>{t.cpu}</dd></div>
                  <div className="flex justify-between gap-2"><dt>RAM</dt><dd className="text-right" style={{ color: "var(--fg)" }}>{t.ram}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Storage</dt><dd className="text-right" style={{ color: "var(--fg)" }}>{t.storage}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Network</dt><dd className="text-right" style={{ color: "var(--fg)" }}>{t.network}</dd></div>
                </dl>
                <p className="font-sans text-xs leading-relaxed pt-2 border-t" style={{ color: "var(--fg-muted)", borderColor: "var(--border)" }}>
                  {t.expected}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            WALKTHROUGH
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            Five commands. That's the whole loop.
          </h2>
          <div className="flex flex-col gap-6">
            {STEPS.map(s => (
              <div
                key={s.n}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <div className="md:col-span-1">
                  <div
                    className="w-10 h-10 flex items-center justify-center font-mono font-bold text-sm"
                    style={{ background: "var(--accent)", color: "var(--accent-on)" }}
                  >
                    {s.n}
                  </div>
                </div>
                <div className="md:col-span-11">
                  <h3 className="font-sans font-bold text-lg mb-2" style={{ color: "var(--fg)" }}>{s.title}</h3>
                  <p className="font-sans text-sm leading-relaxed mb-3" style={{ color: "var(--fg-muted)" }}>{s.desc}</p>
                  <pre
                    className="font-mono text-xs leading-6 p-3 overflow-x-auto"
                    style={{ background: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--fg)" }}
                  >{s.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-subtle)" }}>
            REWARDS
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-10" style={{ color: "var(--fg)" }}>
            What you earn, in plain terms.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REWARDS.map(r => (
              <div
                key={r.label}
                className="p-5"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "var(--fg-subtle)" }}>
                  {r.label}
                </div>
                <div className="font-mono font-bold text-2xl mb-2" style={{ color: "var(--accent)" }}>{r.val}</div>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <div
            className="mt-6 p-4 font-mono text-xs"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", color: "var(--fg)" }}
          >
            <strong style={{ color: "var(--accent)" }}>NOTE</strong> &nbsp; Concentration resistance: the marginal value of a single submission is strictly decreasing in j (your existing submission count). One actor's max contribution to √k is O(√c) where c is the per-key cap. New keys ≠ more reward.
          </div>
        </div>
      </section>

      <CtaBand
        title="Spin up a prover in 60 seconds."
        description="The reference prover runs on commodity hardware. Pool support is opt-in and routes the same way a direct submitter does."
        primary={{ label: "INSTALL NOW", href: "#" }}
        secondary={{ label: "Read whitepaper", href: "/RIBO_Whitepaper.pdf" }}
      />
    </SubpageShell>
  )
}
