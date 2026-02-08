import { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import * as d3 from 'd3'
import { AnimatePresence, motion } from 'framer-motion'

import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Writing from './pages/Writing.jsx'
import About from './pages/About.jsx'

import './App.css'

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function App() {
  const svgRef = useRef(null)
  const { w, h } = useWindowSize()
  const location = useLocation()

  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    const onMove = (e) => {
      setPointer({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const seed = useMemo(() => 0.42, [])

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const width = w
    const height = h

    const svg = d3.select(svgEl)
    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.selectAll('*').remove()

    const defs = svg.append('defs')

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', '3.2').attr('result', 'coloredBlur')
    const merge = filter.append('feMerge')
    merge.append('feMergeNode').attr('in', 'coloredBlur')
    merge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Background gradient that will parallax with pointer
    const grad = defs
      .append('radialGradient')
      .attr('id', 'bg')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '70%')

    grad.append('stop').attr('offset', '0%').attr('stop-color', '#132a53')
    grad.append('stop').attr('offset', '45%').attr('stop-color', '#0d1b2a')
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#070a14')

    const bg = svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bg)')

    // Particles
    const N = Math.min(260, Math.floor((width * height) / 8000))
    const rng = d3.randomNormal.source(d3.randomLcg(seed))(0, 1)

    const nodes = d3.range(N).map((i) => ({
      id: i,
      r: 1.2 + Math.random() * 2.8,
      x: width * (0.05 + 0.9 * Math.random()),
      y: height * (0.05 + 0.9 * Math.random()),
      vx: rng() * 0.45,
      vy: rng() * 0.45,
    }))

    const gLinks = svg
      .append('g')
      .attr('stroke', '#7aa2ff')
      .attr('stroke-opacity', 0.16)
      .attr('stroke-width', 1)

    const circles = svg
      .append('g')
      .attr('filter', 'url(#glow)')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', '#8be9fd')
      .attr('fill-opacity', 0.42)

    // Pointer attractor
    const attract = (n, tx, ty) => {
      const dx = tx - n.x
      const dy = ty - n.y
      const d2 = dx * dx + dy * dy
      const k = 0.0008
      n.vx += dx * k
      n.vy += dy * k
      // slight damping
      n.vx *= 0.995
      n.vy *= 0.995
      // cap speed
      const sp = Math.hypot(n.vx, n.vy)
      if (sp > 1.4) {
        n.vx = (n.vx / sp) * 1.4
        n.vy = (n.vy / sp) * 1.4
      }
      return d2
    }

    let raf
    const tick = () => {
      // Parallax background center
      const cx = 35 + pointer.x * 30
      const cy = 35 + pointer.y * 30
      grad.attr('cx', `${cx}%`).attr('cy', `${cy}%`)
      bg.attr('opacity', 1)

      const tx = pointer.x * width
      const ty = pointer.y * height

      for (const n of nodes) {
        attract(n, tx, ty)

        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = Math.max(0, Math.min(width, n.x))
        n.y = Math.max(0, Math.min(height, n.y))
      }

      circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

      // Dynamic links: sample pairs and draw those within a threshold
      const maxLinks = Math.floor(N * 1.6)
      const segs = []
      const thresh = Math.min(150 * 150, (width * width + height * height) / 210)

      for (let i = 0; i < maxLinks; i++) {
        const a = nodes[(i * 7) % N]
        const b = nodes[(i * 23 + 13) % N]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist2 = dx * dx + dy * dy
        if (dist2 < thresh) segs.push({ a, b, o: 1 - dist2 / thresh })
      }

      const sel = gLinks.selectAll('line').data(segs)
      sel
        .enter()
        .append('line')
        .merge(sel)
        .attr('x1', (d) => d.a.x)
        .attr('y1', (d) => d.a.y)
        .attr('x2', (d) => d.b.x)
        .attr('y2', (d) => d.b.y)
        .attr('stroke-opacity', (d) => 0.05 + d.o * 0.24)
      sel.exit().remove()

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [w, h, pointer.x, pointer.y, seed])

  return (
    <div className="app">
      <svg ref={svgRef} className="bg" aria-hidden="true" />

      <div className="chrome">
        <Nav />
        <div className="shell">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} className="route">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
