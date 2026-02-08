import { motion } from 'framer-motion'

export default function Writing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h1 className="title">Writing</h1>
      <p className="subtitle">Short notes and deep dives (placeholder).</p>

      <div className="card wow">
        <h3>Planned topics</h3>
        <ul>
          <li>Practical evals for LLM products</li>
          <li>Model/version control that actually works</li>
          <li>Animated data stories (D3 + scroll)</li>
        </ul>
      </div>
    </motion.div>
  )
}
