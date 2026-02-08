import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
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

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const width = w
    const height = h

    const svg = d3.select(svgEl)
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    svg.selectAll('*').remove()

    const defs = svg.append('defs')
    const grad = defs
      .append('linearGradient')
      .attr('id', 'bg')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    grad.append('stop').attr('offset', '0%').attr('stop-color', '#0b1020')
    grad.append('stop').attr('offset', '50%').attr('stop-color', '#0d1b2a')
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#0a0f1f')

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bg)')

    const N = Math.min(220, Math.floor((width * height) / 9000))
    const rng = d3.randomNormal.source(d3.randomLcg(0.42))(0, 1)

    const nodes = d3.range(N).map((i) => ({
      id: i,
      r: 1.2 + Math.random() * 2.8,
      x: width * (0.05 + 0.9 * Math.random()),
      y: height * (0.05 + 0.9 * Math.random()),
      vx: rng() * 0.4,
      vy: rng() * 0.4,
    }))

    const circles = svg
      .append('g')
      .attr('opacity', 0.9)
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', '#8be9fd')
      .attr('fill-opacity', 0.35)

    const links = svg
      .append('g')
      .attr('stroke', '#7aa2ff')
      .attr('stroke-opacity', 0.12)
      .attr('stroke-width', 1)

    const tick = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = Math.max(0, Math.min(width, n.x))
        n.y = Math.max(0, Math.min(height, n.y))
      }

      circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

      const maxLinks = Math.floor(N * 1.3)
      const segs = []
      for (let i = 0; i < maxLinks; i++) {
        const a = nodes[(i * 7) % N]
        const b = nodes[(i * 19 + 11) % N]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist2 = dx * dx + dy * dy
        const thresh = Math.min(140 * 140, (width * width + height * height) / 180)
        if (dist2 < thresh) segs.push({ a, b })
      }

      const sel = links.selectAll('line').data(segs)
      sel
        .enter()
        .append('line')
        .merge(sel)
        .attr('x1', (d) => d.a.x)
        .attr('y1', (d) => d.a.y)
        .attr('x2', (d) => d.b.x)
        .attr('y2', (d) => d.b.y)
      sel.exit().remove()

      raf = requestAnimationFrame(tick)
    }

    let raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [w, h])

  return (
    <div className="app">
      <svg ref={svgRef} className="bg" />

      <div className="content">
        <div className="badge">Under construction</div>
        <h1>Wen Jian</h1>
        <p className="subtitle">Data science • AI engineering • data visualisation</p>

        <div className="grid">
          <div className="card">
            <h3>Coming soon</h3>
            <p>Interactive portfolio built with React + D3.</p>
          </div>
          <div className="card">
            <h3>Focus</h3>
            <ul>
              <li>Applied ML/LLM systems</li>
              <li>Reliable pipelines & evaluation</li>
              <li>Animated, decision-grade visualisations</li>
            </ul>
          </div>
          <div className="card">
            <h3>Links</h3>
            <p>
              <a href="https://github.com/wjivan" target="_blank" rel="noreferrer">GitHub</a>
              {' · '}
              <a href="mailto:wen.jian@cantab.net">Email</a>
            </p>
          </div>
        </div>

        <p className="foot">If you’re seeing this, the new site is deploying — content will follow.</p>
      </div>
    </div>
  )
}
