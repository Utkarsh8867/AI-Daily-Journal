# AI Daily Journal Agent - Hackathon Guide

## 🎯 Project Overview

An intelligent journaling assistant that transforms daily reflection into an engaging, insightful experience using Maestro AI.

### Key Features
- ✍️ **Smart Journal Processing**: AI-powered summarization, emotion detection, and positive reflections
- 📊 **Mood Analytics**: Visual insights into emotional patterns and trends
- 🎨 **Beautiful Interface**: Clean, responsive design with intuitive navigation
- 💾 **Local Storage**: SQLite database for privacy and offline capability

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js 16+
- Maestro API key from hack.dantalabs.com

### Installation
```bash
# 1. Clone/download the project
# 2. Run setup
python setup.py

# 3. Add your Maestro API key to .env file
# Edit .env and replace 'your_maestro_api_key_here' with your actual key

# 4. Start the application
python start.py
```

### Manual Setup (Alternative)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Start backend (Terminal 1)
cd backend
python api_server.py

# Start frontend (Terminal 2)
npm run dev
```

## 🏗️ Architecture

### Backend (Python + Maestro)
- **journal_agent.py**: Core AI processing with Maestro SDK
- **api_server.py**: FastAPI REST API server
- **journal.db**: SQLite database for entries

### Frontend (Next.js + React)
- **pages/index.js**: Main application with tab navigation
- **components/JournalInput.js**: Entry input and AI processing
- **components/RecentEntries.js**: Historical entries display
- **components/Analytics.js**: Mood tracking and insights

### Key API Endpoints
- `POST /api/journal/process`: Process new journal entry
- `GET /api/journal/entries`: Retrieve recent entries
- `GET /api/journal/analytics`: Get mood analytics

## 🤖 Maestro Integration

### AI Prompts Used
1. **Summarization**: Condenses entries to key points
2. **Emotion Detection**: Identifies 2-3 main emotions
3. **Positive Reflection**: Generates encouraging insights

### Example Maestro Usage
```python
from dantalabs import Agent

agent = Agent(
    name="journal_processor",
    instructions="You are a compassionate AI journal assistant..."
)

summary = agent.chat(f"Summarize this journal entry: {entry_text}")
emotions = agent.chat(f"Detect emotions in: {entry_text}")
reflection = agent.chat(f"Provide positive reflection for: {entry_text}")
```

## 📊 Demo Flow

1. **User Input**: "Today I studied for my exam, but I felt tired and stressed."
2. **AI Processing**:
   - Summary: "Studied for exam, feeling stressed and tired"
   - Emotions: "stressed, tired"
   - Reflection: "Take breaks while studying - your effort shows dedication!"
3. **Storage**: Entry saved with AI analysis
4. **Analytics**: Updates mood tracking charts

## 🎨 Hackathon Presentation Tips

### What Makes This Special
- **Real-world Problem**: Addresses common journaling barriers
- **AI-First Approach**: Leverages Maestro for meaningful insights
- **Complete Solution**: Full-stack app with beautiful UI
- **Scalable**: Easy to add features like voice input, sharing, etc.

### Demo Script
1. Show the clean, welcoming interface
2. Enter a sample journal entry
3. Highlight AI processing and insights
4. Navigate to analytics showing mood trends
5. Emphasize the positive, encouraging tone

### Potential Extensions
- 🎤 Voice input with speech-to-text
- 📱 Mobile app version
- 🔗 Social sharing of insights (anonymized)
- 📈 Goal tracking and habit formation
- 🌍 Multi-language support

## 🛠️ Troubleshooting

### Common Issues
1. **Backend won't start**: Check Maestro API key in .env
2. **Frontend errors**: Ensure backend is running on port 8000
3. **Database issues**: Delete journal.db to reset

### Development Tips
- Use browser dev tools to debug API calls
- Check backend logs for Maestro API errors
- Test with various journal entry types

## 📝 Hackathon Submission Checklist

- [ ] Project runs successfully
- [ ] Maestro integration working
- [ ] All features demonstrated
- [ ] Code is clean and documented
- [ ] README updated with setup instructions
- [ ] Demo video/screenshots prepared

## 🏆 Winning Strategy

This project showcases:
- **Technical Excellence**: Full-stack implementation with AI integration
- **User Experience**: Intuitive design solving real problems
- **Innovation**: Creative use of Maestro for emotional intelligence
- **Completeness**: Production-ready features and polish

Good luck with your hackathon! 🚀✨