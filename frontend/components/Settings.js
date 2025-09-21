import { useState, useEffect } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    reflectionStyle: 'motivational',
    reminderTime: '20:00',
    enableReminders: false,
    customEmotions: [],
    privacyMode: true,
    exportFormat: 'txt'
  })

  const [newEmotion, setNewEmotion] = useState('')

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('journalSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const saveSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('journalSettings', JSON.stringify(newSettings))
  }

  const addCustomEmotion = () => {
    if (newEmotion.trim() && !settings.customEmotions.includes(newEmotion.trim().toLowerCase())) {
      const updatedSettings = {
        ...settings,
        customEmotions: [...settings.customEmotions, newEmotion.trim().toLowerCase()]
      }
      saveSettings(updatedSettings)
      setNewEmotion('')
    }
  }

  const removeCustomEmotion = (emotion) => {
    const updatedSettings = {
      ...settings,
      customEmotions: settings.customEmotions.filter(e => e !== emotion)
    }
    saveSettings(updatedSettings)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        saveSettings({ ...settings, enableReminders: true })
        // Set up daily reminder
        scheduleReminder()
      }
    }
  }

  const scheduleReminder = () => {
    // This would typically use a service worker for persistent notifications
    // For demo purposes, we'll show a simple alert
    console.log('Reminder scheduled for', settings.reminderTime)
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
        ⚙️ Personalization Settings
      </h2>

      {/* Reflection Style */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#667eea', marginBottom: '16px' }}>💭 Reflection Style</h3>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          Choose how you'd like your AI reflections to be written
        </p>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { value: 'motivational', label: '🚀 Motivational', desc: 'Energetic and encouraging' },
            { value: 'gentle', label: '🌸 Gentle', desc: 'Soft and nurturing' },
            { value: 'analytical', label: '🧠 Analytical', desc: 'Thoughtful and insightful' },
            { value: 'wise', label: '🦉 Wise', desc: 'Philosophical and deep' }
          ].map(style => (
            <label key={style.value} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              border: settings.reflectionStyle === style.value ? '2px solid #667eea' : '1px solid #e1e5e9',
              borderRadius: '8px',
              cursor: 'pointer',
              background: settings.reflectionStyle === style.value ? '#f0f4ff' : 'white'
            }}>
              <input
                type="radio"
                name="reflectionStyle"
                value={style.value}
                checked={settings.reflectionStyle === style.value}
                onChange={(e) => saveSettings({ ...settings, reflectionStyle: e.target.value })}
                style={{ margin: 0 }}
              />
              <div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>{style.label}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{style.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Daily Reminders */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#667eea', marginBottom: '16px' }}>⏰ Daily Reminders</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={settings.enableReminders}
            onChange={(e) => {
              if (e.target.checked) {
                requestNotificationPermission()
              } else {
                saveSettings({ ...settings, enableReminders: false })
              }
            }}
          />
          <label>Enable daily journaling reminders</label>
        </div>

        {settings.enableReminders && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
              Reminder time:
            </label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => saveSettings({ ...settings, reminderTime: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #e1e5e9',
                borderRadius: '6px'
              }}
            />
          </div>
        )}
      </div>

      {/* Custom Emotions */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#667eea', marginBottom: '16px' }}>😊 Custom Emotions</h3>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          Add emotions that are important to you for better tracking
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={newEmotion}
            onChange={(e) => setNewEmotion(e.target.value)}
            placeholder="e.g., nostalgic, determined"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && addCustomEmotion()}
          />
          <button
            onClick={addCustomEmotion}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {settings.customEmotions.map(emotion => (
            <span
              key={emotion}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#f0f4ff',
                color: '#667eea',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            >
              {emotion}
              <button
                onClick={() => removeCustomEmotion(emotion)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Privacy & Export */}
      <div className="card">
        <h3 style={{ color: '#667eea', marginBottom: '16px' }}>🔒 Privacy & Export</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={settings.privacyMode}
              onChange={(e) => saveSettings({ ...settings, privacyMode: e.target.checked })}
            />
            <label>
              <strong>Privacy Mode</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Keep all data local, never sync to cloud
              </div>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
              Export format:
            </label>
            <select
              value={settings.exportFormat}
              onChange={(e) => saveSettings({ ...settings, exportFormat: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #e1e5e9',
                borderRadius: '6px'
              }}
            >
              <option value="txt">Plain Text (.txt)</option>
              <option value="json">JSON Data (.json)</option>
              <option value="csv">Spreadsheet (.csv)</option>
            </select>
          </div>

          <div style={{ 
            background: '#f0f9ff', 
            padding: '12px', 
            borderRadius: '8px',
            fontSize: '12px',
            color: '#0369a1'
          }}>
            <strong>🛡️ Your Privacy Matters:</strong> All journal data is stored locally on your device. 
            We never access, read, or store your personal thoughts.
          </div>
        </div>
      </div>
    </div>
  )
}