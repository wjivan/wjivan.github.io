import { motion } from 'framer-motion'

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h1 className="title">About</h1>
      <p className="subtitle">Bio + experience will go here.</p>

      <div className="card wow">
        <p>
          I work on applied data science, AI engineering, and visualisation.
          This page is intentionally minimal while we build out the site.
        </p>
      </div>
    </motion.div>
  )
}
