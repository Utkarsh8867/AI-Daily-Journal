import { useState } from 'react'

export default function SimpleJournal() {
  const [entryText, setEntryText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [entries, setEntries] = useState([])

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
      console.log('Sending request to backend...')
      const response = await fetch('/api/journal/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entry_text: entryText
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setResult(data.data)
        setEntryText('')
        loadEntries() // Refresh entries
      } else {
        setError(data.error || 'Failed to process entry')
      }
    } catch (err) {
      console.error('Request error:', err)
      setError(`Failed to connect to server: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const loadEntries = async () => {
    try {
      // Only load entries on client side
      if (typeof window === 'undefined') return

      const response = await fetch('/api/journal/entries')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setEntries(data.entries)
        }
      }
    } catch (err) {
      console.error('Failed to load entries:', err)
    }
  }

  const handleNewEntry = () => {
    setResult(null)
    setError(null)
  }

  // Load entries on component mount
  useEffect(() => {
    loadEntries()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            📝 AI Daily Journal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Simple version for testing
          </p>
        </header>

        {/* Journal Input */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          {!result ? (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                How was your day? 💭
              </h2>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="Write about your day, feelings, thoughts, or anything on your mind..."
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#666' }}>
                    {entryText.length} characters
                  </small>

                  <button
                    type="submit"
                    disabled={isProcessing || !entryText.trim()}
                    style={{
                      background: isProcessing ? '#ccc' : '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isProcessing ? '🤔 Processing...' : '✨ Analyze Entry'}
                  </button>
                </div>
              </form>

              {error && (
                <div style={{
                  marginTop: '16px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #dc2626'
                }}>
                  {error}
                </div>
              )}
            </>
          ) : (
            <div>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                ✨ Your Journal Analysis
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '8px' }}>📝 Summary</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{result.summary}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '8px' }}>😊 Emotions Detected</h3>
                <div>
                  {result.emotions.split(',').map((emotion, index) => (
                    <span key={index} style={{
                      display: 'inline-block',
                      background: '#f0f4ff',
                      color: '#667eea',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      margin: '2px'
                    }}>
                      {emotion.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '8px' }}>💡 Positive Reflection</h3>
                <div style={{
                  background: '#f8fffe',
                  borderLeft: '4px solid #10b981',
                  padding: '16px',
                  borderRadius: '8px',
                  fontStyle: 'italic',
                  color: '#065f46'
                }}>
                  {result.reflection}
                </div>
              </div>

              <button
                onClick={handleNewEntry}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                📝 Write Another Entry
              </button>
            </div>
          )}
        </div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              📚 Recent Entries ({entries.length})
            </h2>

            {entries.slice(0, 3).map((entry, index) => (
              <div key={entry.id} style={{
                borderBottom: index < 2 ? '1px solid #eee' : 'none',
                paddingBottom: '16px',
                marginBottom: index < 2 ? '16px' : '0'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  {entry.date}
                </div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                  {entry.original_entry}
                </div>
                <div style={{ fontSize: '14px', color: '#667eea' }}>
                  Emotions: {entry.emotions}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}