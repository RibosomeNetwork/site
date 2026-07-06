"use client"

import { useEffect, useRef } from "react"

export function DNACanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = (t: number) => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const BLUE = "#1A1AFF"
      const BLUE_MID = "rgba(26,26,255,0.4)"
      const BLUE_FAINT = "rgba(26,26,255,0.15)"

      const cols = 8
      const colW = W / cols
      const speed = t * 0.0008

      for (let c = 0; c < cols; c++) {
        const cx = colW * c + colW / 2
        const amplitude = colW * 0.38
        const phase = (c / cols) * Math.PI * 2

        // Draw helix strands
        const steps = Math.ceil(H / 8)
        const points1: [number, number][] = []
        const points2: [number, number][] = []

        for (let s = 0; s <= steps; s++) {
          const y = (s / steps) * H
          const angle = (s / steps) * Math.PI * 6 + speed + phase
          const x1 = cx + Math.cos(angle) * amplitude
          const x2 = cx - Math.cos(angle) * amplitude
          points1.push([x1, y])
          points2.push([x2, y])
        }

        // Strand 1
        ctx.beginPath()
        ctx.moveTo(...points1[0])
        for (let i = 1; i < points1.length; i++) ctx.lineTo(...points1[i])
        ctx.strokeStyle = BLUE_MID
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Strand 2
        ctx.beginPath()
        ctx.moveTo(...points2[0])
        for (let i = 1; i < points2.length; i++) ctx.lineTo(...points2[i])
        ctx.strokeStyle = BLUE_FAINT
        ctx.lineWidth = 1
        ctx.stroke()

        // Rungs (base pairs) at intervals
        const rungCount = 14
        for (let r = 0; r < rungCount; r++) {
          const s = Math.round((r / rungCount) * steps)
          const y = points1[s]?.[1]
          const x1 = points1[s]?.[0]
          const x2 = points2[s]?.[0]
          if (y === undefined) continue

          const angle = (s / steps) * Math.PI * 6 + speed + phase
          const opacity = 0.3 + 0.5 * ((Math.cos(angle) + 1) / 2)

          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.strokeStyle = `rgba(26,26,255,${opacity * 0.6})`
          ctx.lineWidth = 1
          ctx.stroke()

          // Pixel nodes at strand intersections
          const sz = 3
          ctx.fillStyle = `rgba(26,26,255,${opacity})`
          ctx.fillRect(x1 - sz / 2, y - sz / 2, sz, sz)
          ctx.fillRect(x2 - sz / 2, y - sz / 2, sz, sz)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  )
}
