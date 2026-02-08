import { motion } from 'framer-motion'

const placeholder = [
  { title: 'LLM workflow reliability', desc: 'Evals, versioning, CI/CD, monitoring.', tags: ['LLMs', 'MLOps'] },
  { title: 'Data visualisation case study', desc: 'Animated charts built for decision-making.', tags: ['D3', 'Design'] },
  { title: 'Applied modelling project', desc: 'From raw data to insight and deployment.', tags: ['Python', 'Analytics'] },
]

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h1 className="title">Projects</h1>
      <p className="subtitle">Selected work — placeholders for now.</p>

      <div className="stack">
        {placeholder.map((p) => (
          <div key={p.title} className="card wow">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
