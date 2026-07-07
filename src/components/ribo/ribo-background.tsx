"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ──────────────────────────────────────────────────────────────────────────
   RIBO BC-UPoW 3D Visualization
   ──────────────────────────────────────────────────────────────────────────
   The scene visualizes how Bounded-Composition Useful Proof-of-Work flows:

   1. DNA HELIX (center)        → the useful work layer (RNA inverse design).
                                   Solvers search for sequences that fold
                                   into target structures.
   2. BLOCK RING (outer torus)  → the sequential VDF floor. Cubes are blocks
                                   chained together; the ring rotates slowly
                                   to convey sequential time.
   3. PARTICLE STREAMS          → zkVM execution proofs. Particles travel
                                   from the DNA outward to specific blocks,
                                   visually binding each discovered sequence
                                   to a block on the public ledger.
   4. CEILING PLANE (top)       → the δ_max bound. A translucent disc at the
                                   top of the scene represents the maximum
                                   discount ceiling — the ceiling that attack
                                   cost can never breach.
   5. BEACON PULSE              → the epoch beacon. A periodic flash at the
                                   center marks the start of each epoch,
                                   binding all proofs to fresh randomness.

   No interaction needed — it loops forever as an ambient visualization.
   ─────────────────────────────────────────────────────────────────────── */

// ── Config ────────────────────────────────────────────────────────────────
const HELIX_TURNS    = 3.5
const HELIX_RADIUS   = 1.4
const HELIX_HEIGHT   = 5.6
const HELIX_SEGMENTS = 80          // nucleotides per strand
const RUNG_COUNT     = 22          // base-pair rungs
const BLOCK_COUNT    = 14          // blocks in the VDF ring
const BLOCK_RING_R   = 4.2
const PARTICLE_COUNT = 260
const CEILING_Y      = 3.6

// RIBO blue palette
const COLOR_ACCENT       = new THREE.Color("#5C5CFF")
const COLOR_ACCENT_BRIGHT= new THREE.Color("#9B9BFF")
const COLOR_ACCENT_DEEP  = new THREE.Color("#1A1AFF")
const COLOR_FAINT        = new THREE.Color("#3B3BCC")
const COLOR_WHITE        = new THREE.Color("#F4F4FF")
const COLOR_WARNING      = new THREE.Color("#FBBF24") // δ_max ceiling

/* ── DNA Helix ─────────────────────────────────────────────────────────── */
function DnaHelix() {
  const groupRef = useRef<THREE.Group>(null)
  const beaconRef = useRef<THREE.Mesh>(null)

  // Two strands: positions computed via parametric helix equation.
  const strands = useMemo(() => {
    const out: { positions: Float32Array; colors: Float32Array }[] = []
    for (let strand = 0; strand < 2; strand++) {
      const positions = new Float32Array(HELIX_SEGMENTS * 3)
      const colors    = new Float32Array(HELIX_SEGMENTS * 3)
      for (let i = 0; i < HELIX_SEGMENTS; i++) {
        const t = i / (HELIX_SEGMENTS - 1)
        const angle = t * HELIX_TURNS * Math.PI * 2 + strand * Math.PI
        const x = Math.cos(angle) * HELIX_RADIUS
        const y = (t - 0.5) * HELIX_HEIGHT
        const z = Math.sin(angle) * HELIX_RADIUS
        positions[i * 3]     = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        // Strand 0: deep accent; strand 1: brighter accent
        const col = strand === 0 ? COLOR_ACCENT : COLOR_ACCENT_BRIGHT
        colors[i * 3]     = col.r
        colors[i * 3 + 1] = col.g
        colors[i * 3 + 2] = col.b
      }
      out.push({ positions, colors })
    }
    return out
  }, [])

  // Rung endpoints — each rung connects strand 0 to strand 1 at the same t.
  const rungs = useMemo(() => {
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = []
    for (let r = 0; r < RUNG_COUNT; r++) {
      const t = r / (RUNG_COUNT - 1)
      const angle = t * HELIX_TURNS * Math.PI * 2
      arr.push({
        a: new THREE.Vector3(
          Math.cos(angle) * HELIX_RADIUS,
          (t - 0.5) * HELIX_HEIGHT,
          Math.sin(angle) * HELIX_RADIUS
        ),
        b: new THREE.Vector3(
          Math.cos(angle + Math.PI) * HELIX_RADIUS,
          (t - 0.5) * HELIX_HEIGHT,
          Math.sin(angle + Math.PI) * HELIX_RADIUS
        ),
      })
    }
    return arr
  }, [])

  // Beacon ring (epoch beacon) — pulses periodically.
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25
    }
    if (beaconRef.current) {
      const phase = (t % 4) / 4 // 4-second epoch cycle
      const visible = phase < 0.15
      const scale = visible ? 1 + phase * 8 : 0.01
      beaconRef.current.scale.setScalar(scale)
      const mat = beaconRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = visible ? 0.6 * (1 - phase / 0.15) : 0
    }
  })

  return (
    <group ref={groupRef}>
      {/* Strand 0 — spheres */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={HELIX_SEGMENTS}
            array={strands[0].positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={HELIX_SEGMENTS}
            array={strands[0].colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Strand 1 — spheres */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={HELIX_SEGMENTS}
            array={strands[1].positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={HELIX_SEGMENTS}
            array={strands[1].colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Rungs (base pairs) — thin cylinders between strands */}
      {rungs.map((rung, i) => {
        const midpoint = rung.a.clone().add(rung.b).multiplyScalar(0.5)
        const dir = rung.b.clone().sub(rung.a)
        const len = dir.length()
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        )
        return (
          <mesh key={i} position={midpoint} quaternion={quat}>
            <cylinderGeometry args={[0.015, 0.015, len, 6]} />
            <meshBasicMaterial
              color={COLOR_FAINT}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )
      })}

      {/* Beacon ring — pulses every "epoch" */}
      <mesh ref={beaconRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.04, 8, 64]} />
        <meshBasicMaterial
          color={COLOR_WHITE}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ── VDF Block Ring ─────────────────────────────────────────────────────── */
function BlockRing() {
  const groupRef = useRef<THREE.Group>(null)

  const blocks = useMemo(() => {
    const arr: { pos: THREE.Vector3; idx: number }[] = []
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const angle = (i / BLOCK_COUNT) * Math.PI * 2
      arr.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * BLOCK_RING_R,
          0,
          Math.sin(angle) * BLOCK_RING_R
        ),
        idx: i,
      })
    }
    return arr
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Slow clockwise rotation — conveys sequential time
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer ring guide (faint torus) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BLOCK_RING_R, 0.012, 8, 128]} />
        <meshBasicMaterial
          color={COLOR_ACCENT}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Blocks */}
      {blocks.map((b, i) => (
        <group key={i} position={b.pos}>
          {/* Block cube */}
          <mesh>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshBasicMaterial
              color={COLOR_ACCENT_DEEP}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Bright edge frame */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.34, 0.34, 0.34)]} />
            <lineBasicMaterial color={COLOR_ACCENT_BRIGHT} transparent opacity={0.9} />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

/* ── zkVM Proof Particles (DNA → blocks) ────────────────────────────────── */
function ProofParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  // Each particle is bound to a random block on the ring and a random height
  // on the DNA helix. It travels from the DNA outward to the block, then
  // resets to a new origin — visually binding sequences to blocks.
  const { positions, targets, origins, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const targets   = new Float32Array(PARTICLE_COUNT * 3)
    const origins   = new Float32Array(PARTICLE_COUNT * 3)
    const speeds    = new Float32Array(PARTICLE_COUNT)
    const offsets   = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const blockAngle = Math.random() * Math.PI * 2
      const target = new THREE.Vector3(
        Math.cos(blockAngle) * BLOCK_RING_R,
        0,
        Math.sin(blockAngle) * BLOCK_RING_R
      )
      const origin = new THREE.Vector3(
        (Math.random() - 0.5) * HELIX_RADIUS * 1.5,
        (Math.random() - 0.5) * HELIX_HEIGHT,
        (Math.random() - 0.5) * HELIX_RADIUS * 1.5
      )
      targets[i * 3]     = target.x
      targets[i * 3 + 1] = target.y
      targets[i * 3 + 2] = target.z
      origins[i * 3]     = origin.x
      origins[i * 3 + 1] = origin.y
      origins[i * 3 + 2] = origin.z
      positions[i * 3]     = origin.x
      positions[i * 3 + 1] = origin.y
      positions[i * 3 + 2] = origin.z
      speeds[i]  = 0.15 + Math.random() * 0.35
      offsets[i] = Math.random()
    }
    return { positions, targets, origins, speeds, offsets }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Progress 0 → 1, repeating with per-particle offset
      const progress = ((t * speeds[i]) + offsets[i]) % 1
      // Ease in-out
      const e = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2
      const ox = origins[i * 3],     oy = origins[i * 3 + 1], oz = origins[i * 3 + 2]
      const tx = targets[i * 3],     ty = targets[i * 3 + 1], tz = targets[i * 3 + 2]
      arr[i * 3]     = ox + (tx - ox) * e
      arr[i * 3 + 1] = oy + (ty - oy) * e
      arr[i * 3 + 2] = oz + (tz - oz) * e
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={COLOR_ACCENT_BRIGHT}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      {/* Hidden attributes used by useFrame — kept on geometry for ref */}
      <bufferAttribute
        attach="attributes-target"
        count={PARTICLE_COUNT}
        array={targets}
        itemSize={3}
        visible={false}
      />
      <bufferAttribute
        attach="attributes-origin"
        count={PARTICLE_COUNT}
        array={origins}
        itemSize={3}
        visible={false}
      />
    </points>
  )
}

/* ── δ_max Ceiling Plane ────────────────────────────────────────────────── */
function CeilingPlane() {
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      // Gentle opacity pulse
      mat.opacity = 0.15 + 0.05 * Math.sin(state.clock.elapsedTime * 0.8)
    }
  })
  return (
    <group position={[0, CEILING_Y, 0]}>
      {/* Translucent disc — the δ_max bound */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 3.2, 64]} />
        <meshBasicMaterial
          color={COLOR_WARNING}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Inner faint disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial
          color={COLOR_WARNING}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Dashed perimeter line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={(() => {
              const pts = new Float32Array(64 * 3)
              for (let i = 0; i < 64; i++) {
                const a = (i / 64) * Math.PI * 2
                pts[i * 3]     = Math.cos(a) * 3.2
                pts[i * 3 + 1] = 0
                pts[i * 3 + 2] = Math.sin(a) * 3.2
              }
              return pts
            })()}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLOR_WARNING} transparent opacity={0.6} />
      </line>
    </group>
  )
}

/* ── Ambient orbiting stars (depth) ─────────────────────────────────────── */
function Starfield() {
  const ref = useRef<THREE.Points>(null)
  const { positions } = useMemo(() => {
    const N = 200
    const positions = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 8 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return { positions }
  }, [])
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={COLOR_FAINT}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ── Scene wrapper (slow auto-rotation via group, not camera) ──────────── */
function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    // Rotate the whole scene group slowly for parallax — keeps the camera
    // static (avoids mutating camera returned from useThree, which trips
    // the React 19 immutability lint rule).
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.05
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={0.5} color={COLOR_ACCENT} />
      <group ref={groupRef}>
        <Starfield />
        <DnaHelix />
        <BlockRing />
        <ProofParticles />
        <CeilingPlane />
      </group>
    </>
  )
}

/* ── Exported component ─────────────────────────────────────────────────── */
export function RiboBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.8, 9.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
