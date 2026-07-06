"use client"

import { useState } from "react"

const FIELDS = [
  { key: "program_id",      label: "program_id",       type: "H(canonical_verifier_binary)",  critical: true,  note: "Binds the proof to a specific verifier. Any change to the verifier binary invalidates every existing proof." },
  { key: "instance_commit", label: "instance_commit",  type: "H(targets, anti_targets, states)", critical: true, note: "Ties the submission to one specific problem instance. Replay across near-duplicate instances is ruled out by collision resistance." },
  { key: "epoch_beacon",    label: "epoch_beacon",     type: "H(block_hashes[t−w .. t])",      critical: true,  note: "Unpredictable to submitters before the period opens. Stale beacons fail to verify against current period's window." },
  { key: "claimed_output",  label: "claimed_output",   type: "accept",                         critical: false, note: "The verifier either accepted the candidate or did not. No ambiguity." },
  { key: "proof",           label: "proof",            type: "π_zk (zkVM execution proof)",   critical: true,  note: "Knowledge-sound: a verifying proof implies a witness existed and c_min cycles were spent." },
  { key: "cycle_bound",     label: "cycle_bound",      type: "c_min",                          critical: true,  note: "Enforced inside π_zk. Cannot be forged without breaking zkVM soundness." },
  { key: "submitter_pubkey",label: "submitter_pubkey", type: "pk (post-quantum signature)",    critical: false, note: "Per-key submission cap is enforced using this key. Sybils cost real proving time." },
  { key: "sig",             label: "sig",              type: "Sign(sk, H(above))",             critical: false, note: "Binds the submission to a single submitter. Unforgeable under the post-quantum signature assumption." },
]

export function SubmissionFlow() {
  const [active, setActive] = useState<string | null>(FIELDS[0].key)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Submission message card */}
      <div
        className="lg:col-span-3 p-5"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--success)", animation: "pulse-blue 1.4s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--accent)" }}>
            SUBMISSION MESSAGE
          </span>
        </div>
        <pre
          className="font-mono text-xs leading-7 overflow-x-auto p-4"
          style={{ background: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--fg)" }}
        >{`Submission := {
`}{FIELDS.map(f => (
          <div
            key={f.key}
            onMouseEnter={() => setActive(f.key)}
            onMouseLeave={() => setActive(null)}
            className="px-2 py-0.5 cursor-pointer transition-colors"
            style={{
              background: active === f.key ? "var(--accent-soft)" : "transparent",
              borderLeft: active === f.key ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            <span style={{ color: "var(--fg-subtle)" }}>  </span>
            <span style={{ color: f.critical ? "var(--accent)" : "var(--fg-muted)" }}>{f.key.padEnd(18, " ")}</span>
            <span style={{ color: "var(--fg-subtle)" }}>: </span>
            <span style={{ color: "var(--fg)" }}>{f.type}</span>
            {f.critical && <span style={{ color: "var(--accent)" }}>  ◀</span>}
          </div>
        ))}{`}`}</pre>
        <div className="mt-3 font-mono text-[10px] tracking-widest" style={{ color: "var(--fg-subtle)" }}>
          ◀ = critical (binds to a freshness or soundness assumption)
        </div>
      </div>

      {/* Detail panel */}
      <div
        className="lg:col-span-2 p-5"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <div className="font-mono text-[10px] tracking-widest mb-3" style={{ color: "var(--fg-subtle)" }}>
          FIELD DETAIL
        </div>
        {FIELDS.map(f => (
          <div
            key={f.key}
            className="p-3 mb-2"
            style={{
              background: active === f.key ? "var(--accent-soft)" : "var(--bg-inset)",
              border: `1px solid ${active === f.key ? "var(--accent)" : "var(--border)"}`,
              display: active === f.key || active === null ? "block" : "none",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>
                {f.label}
              </span>
              {f.critical && (
                <span
                  className="font-mono text-[9px] tracking-widest px-1.5 py-0.5"
                  style={{ background: "var(--accent)", color: "var(--accent-on)" }}
                >
                  CRITICAL
                </span>
              )}
            </div>
            <div className="font-mono text-[10px] mb-1" style={{ color: "var(--fg-subtle)" }}>
              {f.type}
            </div>
            <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {f.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
