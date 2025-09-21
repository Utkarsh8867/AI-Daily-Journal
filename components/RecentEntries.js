import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

export default function RecentEntries({ refreshTrigger }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEmotion, setFilterEmotion] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchEntries()
  }, [refreshTrigger])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const backendUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000/api/journal/entries?limit=10'
        : '/api/journal/entries?limit=10'
      const response = await axios.get(backendUrl)
      
      if (response.data.success) {
        setEntries(response.data.entries)
      } else {
        setError('Failed to load entries')
      }
    } catch (err) {
      setError('Failed to connect to the server')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const exportToPDF = () => {
    const printContent = entries.map(entry => `
      Date: ${formatDate(entry.date)}
      Entry: ${entry.original_entry}
      Summary: ${entry.summary}
      Emotions: ${entry.emotions}
      Reflection: ${entry.reflection}
      ---
    `).join('\n')
    
    const blob = new Blob([`AI Daily Journal Export\n\n${printContent}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getUniqueEmotions = () => {
    const emotions = new Set()
    entries.forEach(entry => {
      entry.emotions.split(',').forEach(emotion => {
        emotions.add(emotion.trim().toLowerCase())
      })
    })
    return Array.from(emotions).sort()
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.original_entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reflection.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEmotion = !filterEmotion || 
                          entry.emotions.toLowerCase().includes(filterEmotion.toLowerCase())
    
    return matchesSearch && matchesEmotion
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date)
    }
    return 0
  })

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading your journal entries...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button onClick={fetchEntries} className="btn" style={{ marginTop: '16px' }}>
          Try Again
        </button>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>📝 No entries yet</h3>
          <p>Start journaling to see your entries here!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
        📚 Your Journal Entries ({entries.length})
      </h2>

      {/* Search and Filter Controls */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
              🔍 Search entries
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your thoughts..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
              😊 Filter by emotion
            </label>
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All emotions</option>
              {getUniqueEmotions().map(emotion => (
                <option key={emotion} value={emotion}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
              📊 Export
            </label>
            <button
              onClick={exportToPDF}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📄 Export All
            </button>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {filteredEntries.length} of {entries.length} entries
        </div>
      </div>
      
      {filteredEntries.map((entry, index) => (
        <div key={entry.id} className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#667eea', margin: 0 }}>
              Entry #{entry.id}
            </h3>
            <span style={{ color: '#666', fontSize: '14px' }}>
              {formatDate(entry.date)}
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ color: '#333', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Original Entry
            </h4>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
              {entry.original_entry}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '8px', fontSize: '14px' }}>
                📝 Summary
              </h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{entry.summary}</p>
            </div>

            <div>
              <h4 style={{ color: '#667eea', marginBottom: '8px', fontSize: '14px' }}>
                😊 Emotions
              </h4>
              <div>
                {entry.emotions.split(',').map((emotion, idx) => (
                  <span key={idx} className="emotion-tag" style={{ fontSize: '12px' }}>
                    {emotion.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#667eea', marginBottom: '8px', fontSize: '14px' }}>
              💡 Reflection
            </h4>
            <div className="reflection-box" style={{ fontSize: '14px' }}>
              {entry.reflection}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}