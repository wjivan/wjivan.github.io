import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h1 className="title">Wen Jian</h1>
      <p className="subtitle">Data science • AI engineering • data visualisation</p>

      <div className="grid">
        <div className="card wow">
          <h3>Under construction</h3>
          <p>
            This portfolio is being rebuilt in React + D3 with animated case studies.
          </p>
        </div>
        <div className="card wow">
          <h3>What you’ll find</h3>
          <ul>
            <li>Interactive project write-ups</li>
            <li>Model/system design notes</li>
            <li>Visual storytelling & dashboards</li>
          </ul>
        </div>
        <div className="card wow">
          <h3>Quick links</h3>
          <p>
            <a href="https://github.com/wjivan" target="_blank" rel="noreferrer">GitHub</a>
            {' · '}
            <a href="mailto:wen.jian@cantab.net">Email</a>
          </p>
        </div>
      </div>

      <p className="foot">Tip: move your mouse—background responds.</p>
    </motion.div>
  )
}
