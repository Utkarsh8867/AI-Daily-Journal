import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function JournalInput({ onEntryProcessed }) {
  const [entryText, setEntryText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [currentPrompt, setCurrentPrompt] = useState('')

  const journalPrompts = [
    "What made you smile today?",
    "What challenged you and how did you handle it?",
    "What are you grateful for right now?",
    "How are you feeling about your progress lately?",
    "What's one thing you learned about yourself today?",
    "What would you like to focus on tomorrow?",
    "Describe a moment that brought you peace today.",
    "What are you most proud of this week?"
  ]

  useEffect(() => {
    // Set random prompt on component mount
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])

    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setEntryText(prev => prev + ' ' + finalTranscript)
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setError('Voice input error. Please try again.')
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!entryText.trim()) {
      setError('Please write something in your journal entry')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      // Try direct connection to backend first, then fallback to proxy
      const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/api/journal/process'
        : '/api/journal/process'

      const response = await axios.post(backendUrl, {
        entry_text: entryText
      })

      if (response.data.success) {
        setResult(response.data.data)
        setEntryText('') // Clear the input
        onEntryProcessed() // Notify parent component
      } else {
        setError(response.data.error || 'Failed to process entry')
      }
    } catch (err) {
      setError('Failed to connect to the server. Make sure the backend is running.')
      console.error('Error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewEntry = () => {
    setResult(null)
    setError(null)
    // Set new random prompt
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])
  }

  const startVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      setError(null)
      recognition.start()
    }
  }

  const stopVoiceInput = () => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const usePrompt = () => {
    setEntryText(currentPrompt + ' ')
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              style={{
                marginBottom: '24px',
                color: 'var(--text-primary)',
                fontSize: '1.8rem',
                fontWeight: '600',
                textAlign: 'center'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              How was your day? 💭
            </motion.h2>

            {/* Smart Prompt Suggestion */}
            <motion.div
              style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid var(--border-accent)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: 'blur(10px)'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <small style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>
                  💡 Suggested prompt:
                </small>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  marginTop: '4px'
                }}>
                  "{currentPrompt}"
                </div>
              </div>
              <motion.button
                type="button"
                onClick={usePrompt}
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
              >
                Use This
              </motion.button>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.textarea
                className="journal-input"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Write about your day, feelings, thoughts, or anything on your mind..."
                disabled={isProcessing}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              <motion.div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <small style={{ color: 'var(--text-muted)', fontWeight: '500' }}>
                    {entryText.length} characters
                  </small>

                  {/* Voice Input Button */}
                  {recognition && (
                    <motion.button
                      type="button"
                      onClick={isListening ? stopVoiceInput : startVoiceInput}
                      disabled={isProcessing}
                      style={{
                        background: isListening
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '500'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isListening ? {
                        boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)']
                      } : {}}
                      transition={isListening ? {
                        duration: 1,
                        repeat: Infinity
                      } : { type: "spring", stiffness: 300 }}
                    >
                      {isListening ? '🛑 Stop' : '🎤 Voice'}
                    </motion.button>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="btn"
                  disabled={isProcessing || !entryText.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isProcessing ? { opacity: [1, 0.7, 1] } : {}}
                  transition={isProcessing ? {
                    duration: 1.5,
                    repeat: Infinity
                  } : { type: "spring", stiffness: 300 }}
                >
                  {isProcessing ? '🤔 Processing...' : '✨ Analyze Entry'}
                </motion.button>
              </motion.div>
            </motion.form>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="error"
                  style={{ marginTop: '20px' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2
              style={{
                marginBottom: '24px',
                color: 'var(--text-primary)',
                fontSize: '1.8rem',
                fontWeight: '600',
                textAlign: 'center'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              ✨ Your Journal Analysis
            </motion.h2>

            <motion.div
              style={{ marginBottom: '24px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                📝 Summary
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                background: 'rgba(99, 102, 241, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-accent)'
              }}>
                {result.summary}
              </p>
            </motion.div>

            <motion.div
              style={{ marginBottom: '24px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                😊 Emotions Detected
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.emotions.split(',').map((emotion, index) => (
                  <motion.span
                    key={index}
                    className="emotion-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {emotion.trim()}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ marginBottom: '24px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                💡 Positive Reflection
              </h3>
              <div className="reflection-box">
                {result.reflection}
              </div>
            </motion.div>

            <motion.button
              onClick={handleNewEntry}
              className="btn"
              style={{ width: '100%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📝 Write Another Entry
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}