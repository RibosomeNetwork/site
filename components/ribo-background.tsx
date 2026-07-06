"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// ── Vertex shader: DNA helix geometry via position displacement ──────────────
const helixVertexShader = `
  attribute float aIndex;
  attribute float aStrand;
  attribute float aPhase;

  uniform float uTime;
  uniform float uCount;

  varying float vIndex;
  varying float vStrand;
  varying float vPhase;
  varying float vDepth;

  void main() {
    vIndex  = aIndex;
    vStrand = aStrand;
    vPhase  = aPhase;

    float t      = aIndex / uCount;
    float angle  = t * 3.14159265 * 14.0 + aStrand * 3.14159265 + aPhase;
    float radius = 1.6 + sin(uTime * 0.4 + t * 2.0) * 0.08;
    float y      = (t - 0.5) * 14.0;

    float x = cos(angle) * radius;
    float z = sin(angle) * radius;

    vDepth = (z + 2.5) / 5.0;

    vec4 mvPos = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Node size: bigger at front, pulse on "block nodes"
    float blockNode = step(0.98, sin(aIndex * 0.8));
    float baseSize  = 5.0 + blockNode * 12.0;
    gl_PointSize = baseSize * (1.0 + 0.25 * sin(uTime * 3.0 + aIndex));
  }
`

const helixFragmentShader = `
  uniform float uTime;
  varying float vIndex;
  varying float vStrand;
  varying float vDepth;

  void main() {
    // Circular point
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float blockNode = step(0.98, sin(vIndex * 0.8));

    // Color: strand 0 = pure blue, strand 1 = lighter blue-white
    vec3 col0 = mix(vec3(0.1, 0.1, 1.0), vec3(0.4, 0.4, 1.0), vDepth);
    vec3 col1 = mix(vec3(0.5, 0.5, 1.0), vec3(0.9, 0.9, 1.0), vDepth);
    vec3 base  = mix(col0, col1, vStrand);

    // Block nodes glow bright white-blue
    vec3 blockCol = vec3(0.8, 0.85, 1.0);
    vec3 color    = mix(base, blockCol, blockNode);

    // Soft glow falloff
    float glow    = 1.0 - smoothstep(0.2, 0.5, d);
    float alpha   = glow * (0.55 + 0.35 * vDepth);

    // Pulse on block nodes
    alpha += blockNode * 0.4 * (0.5 + 0.5 * sin(uTime * 4.0 + vIndex));

    gl_FragColor = vec4(color, alpha);
  }
`

// ── Rungs (base pairs) ────────────────────────────────────────────────────────
const rungVertexShader = `
  attribute float aT;
  attribute float aAlpha;

  uniform float uTime;
  uniform float uCount;

  varying float vAlpha;
  varying float vT;

  void main() {
    vAlpha = aAlpha;
    vT     = aT;

    float t      = aT;
    float angle  = t * 3.14159265 * 14.0;
    float radius = 1.6 + sin(uTime * 0.4 + t * 2.0) * 0.08;
    float y      = (t - 0.5) * 14.0;

    // aAlpha encodes which end: 0.0 = strand 0, 1.0 = strand 1
    float strandAngle = angle + aAlpha * 3.14159265;
    float x = cos(strandAngle) * radius;
    float z = sin(strandAngle) * radius;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
  }
`

const rungFragmentShader = `
  uniform float uTime;
  varying float vAlpha;
  varying float vT;

  void main() {
    // Base pair color cycling: AUGC — blue shades
    float cycle = mod(vT * 28.0, 4.0);
    vec3 colA = vec3(0.1, 0.1, 1.0);
    vec3 colU = vec3(0.2, 0.4, 0.9);
    vec3 colG = vec3(0.4, 0.2, 0.8);
    vec3 colC = vec3(0.05, 0.05, 0.7);

    vec3 color;
    if (cycle < 1.0)      color = colA;
    else if (cycle < 2.0) color = colU;
    else if (cycle < 3.0) color = colG;
    else                  color = colC;

    float pulse = 0.35 + 0.25 * sin(uTime * 2.0 + vT * 20.0);
    gl_FragColor = vec4(color, pulse);
  }
`

// ── Thermodynamic particles ───────────────────────────────────────────────────
const particleVertexShader = `
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec3  aAxis;

  uniform float uTime;

  varying float vLife;

  void main() {
    // Drift: each particle orbits the helix axis
    float t     = mod(uTime * aSpeed + aOffset, 1.0);
    vLife       = sin(t * 3.14159265);

    float orbitR = 2.5 + aAxis.x * 1.8;
    float angle  = aAxis.y * 6.28 + uTime * aSpeed * 1.5;
    float y      = (aAxis.z - 0.5) * 14.0 + sin(uTime * aSpeed + aAxis.x * 10.0) * 0.8;

    float x = cos(angle) * orbitR;
    float z = sin(angle) * orbitR;

    gl_Position  = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
    gl_PointSize = 2.5 + aAxis.x * 2.0;
  }
`

const particleFragmentShader = `
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;
    gl_FragColor = vec4(0.35, 0.35, 1.0, vLife * 0.5);
  }
`

// ── BlockChain connection lines ────────────────────────────────────────────────
const lineVertexShader = `
  attribute float aIndex;
  attribute float aEndpoint; // 0 = start, 1 = end of each block-to-block line

  uniform float uTime;
  uniform float uCount;

  void main() {
    float t      = aIndex / uCount;
    float angle  = t * 3.14159265 * 14.0;
    float radius = 1.6;
    float y      = (t - 0.5) * 14.0;

    float x = cos(angle) * radius;
    float z = sin(angle) * radius;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
  }
`

const lineFragmentShader = `
  uniform float uTime;
  void main() {
    gl_FragColor = vec4(0.1, 0.1, 0.9, 0.18);
  }
`

// ── Node count ────────────────────────────────────────────────────────────────
const NODE_COUNT = 180
const RUNG_COUNT = 40
const PARTICLE_COUNT = 220

function RiboScene() {
  const { camera } = useThree()

  // Camera setup
  useMemo(() => {
    camera.position.set(0, 0, 10)
    ;(camera as THREE.PerspectiveCamera).fov = 55
    ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
  }, [camera])

  // ── Helix points geometry ──────────────────────────────────────────────────
  const helixGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const count = NODE_COUNT * 2 // two strands
    const indices = new Float32Array(count)
    const strands  = new Float32Array(count)
    const phases   = new Float32Array(count)

    for (let i = 0; i < NODE_COUNT; i++) {
      // strand 0
      indices[i]             = i
      strands[i]             = 0
      phases[i]              = 0
      // strand 1
      indices[i + NODE_COUNT] = i
      strands[i + NODE_COUNT] = 1
      phases[i + NODE_COUNT]  = 0
    }

    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute("aIndex",  new THREE.BufferAttribute(indices, 1))
    geo.setAttribute("aStrand", new THREE.BufferAttribute(strands, 1))
    geo.setAttribute("aPhase",  new THREE.BufferAttribute(phases, 1))
    return geo
  }, [])

  const helixMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: helixVertexShader,
    fragmentShader: helixFragmentShader,
    uniforms: {
      uTime:  { value: 0 },
      uCount: { value: NODE_COUNT },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  // ── Rungs geometry ─────────────────────────────────────────────────────────
  const rungGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const verts: number[] = []
    const ts: number[] = []
    const alphas: number[] = []

    for (let r = 0; r < RUNG_COUNT; r++) {
      const t = r / RUNG_COUNT
      // Two vertices per rung (line segment)
      verts.push(0, 0, 0, 0, 0, 0)
      ts.push(t, t)
      alphas.push(0, 1) // 0 = strand A, 1 = strand B end
    }

    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3))
    geo.setAttribute("aT",       new THREE.BufferAttribute(new Float32Array(ts), 1))
    geo.setAttribute("aAlpha",   new THREE.BufferAttribute(new Float32Array(alphas), 1))
    return geo
  }, [])

  const rungMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: rungVertexShader,
    fragmentShader: rungFragmentShader,
    uniforms: { uTime: { value: 0 }, uCount: { value: RUNG_COUNT } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  // Build rung index pairs
  const rungIndices = useMemo(() => {
    const idx: number[] = []
    for (let r = 0; r < RUNG_COUNT; r++) {
      idx.push(r * 2, r * 2 + 1)
    }
    return new THREE.BufferAttribute(new Uint16Array(idx), 1)
  }, [])

  // ── Thermodynamic particles ────────────────────────────────────────────────
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds    = new Float32Array(PARTICLE_COUNT)
    const offsets   = new Float32Array(PARTICLE_COUNT)
    const axes      = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      speeds[i]   = 0.08 + Math.random() * 0.18
      offsets[i]  = Math.random()
      axes[i * 3]     = Math.random()
      axes[i * 3 + 1] = Math.random()
      axes[i * 3 + 2] = Math.random()
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute("aOffset",  new THREE.BufferAttribute(offsets, 1))
    geo.setAttribute("aAxis",    new THREE.BufferAttribute(axes, 3))
    return geo
  }, [])

  const particleMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  // ── Refs ───────────────────────────────────────────────────────────────────
  const helixRef    = useRef<THREE.Points>(null)
  const rungRef     = useRef<THREE.LineSegments>(null)
  const particleRef = useRef<THREE.Points>(null)
  const groupRef    = useRef<THREE.Group>(null)

  // ── Animation loop ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.elapsedTime

    helixMat.uniforms.uTime.value    = t
    rungMat.uniforms.uTime.value     = t
    particleMat.uniforms.uTime.value = t

    // Slow Y-axis rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Strand nodes */}
      <points ref={helixRef} geometry={helixGeo} material={helixMat} />

      {/* Base-pair rungs */}
      <lineSegments ref={rungRef} geometry={rungGeo} material={rungMat}>
        <primitive object={rungGeo} attach="geometry" />
      </lineSegments>

      {/* Thermodynamic particle cloud */}
      <points ref={particleRef} geometry={particleGeo} material={particleMat} />
    </group>
  )
}

export function RiboBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
      >
        <RiboScene />
      </Canvas>
      {/* Vignette — bottom */}
      <div
        className="absolute inset-0"
      />
      {/* Edge fade */}
      <div
        className="absolute inset-0"
      />
    </div>
  )
}
