import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JournalInput from '../components/JournalInput'
import RecentEntries from '../components/RecentEntries'
import Analytics from '../components/Analytics'
import Settings from '../components/Settings'

export default function Home() {
  const [activeTab, setActiveTab] = useState('write')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEntryProcessed = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('entries') // Switch to entries tab after processing
  }

  return (
    <div className="container">
      {/* Animated Background Elements */}
      <motion.div
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            width: '128px',
            height: '128px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '160px',
            right: '80px',
            width: '96px',
            height: '96px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </motion.div>

      <motion.header
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          style={{
            background: 'linear-gradient(135deg, #f8fafc, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3.5rem',
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}
        >
          ✨ AI Daily Journal
        </motion.h1>
        <motion.p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Your intelligent companion for daily reflection, emotional growth, and mindful living
        </motion.p>
      </motion.header>

      <motion.nav
        style={{ marginBottom: '40px', position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { key: 'write', label: '✍️ Write', desc: 'New Entry' },
            { key: 'entries', label: '📚 Entries', desc: 'History' },
            { key: 'analytics', label: '📊 Insights', desc: 'Analytics' },
            { key: 'settings', label: '⚙️ Settings', desc: 'Customize' }
          ].map((tab, index) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn ${activeTab === tab.key ? '' : 'btn-secondary'}`}
              style={{
                background: activeTab === tab.key
                  ? 'var(--gradient-secondary)'
                  : 'rgba(99, 102, 241, 0.1)',
                color: activeTab === tab.key ? 'white' : 'var(--accent-primary)',
                border: `1px solid ${activeTab === tab.key ? 'transparent' : 'var(--border-accent)'}`,
                minWidth: '120px',
                position: 'relative',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{tab.label}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>{tab.desc}</div>
              </div>
              {activeTab === tab.key && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px'
                  }}
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      <main style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <JournalInput onEntryProcessed={handleEntryProcessed} />
            </motion.div>
          )}

          {activeTab === 'entries' && (
            <motion.div
              key="entries"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RecentEntries refreshTrigger={refreshTrigger} />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Analytics refreshTrigger={refreshTrigger} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer
        style={{
          textAlign: 'center',
          marginTop: '60px',
          color: 'var(--text-muted)',
          position: 'relative',
          zIndex: 10
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.p
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Built with ❤️ using <span style={{ color: 'var(--accent-primary)' }}>Maestro AI</span> • Hackathon 2024
        </motion.p>
      </motion.footer>
    </div>
  )
}