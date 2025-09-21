# 🚀 AI Daily Journal - Complete Application

An intelligent journaling assistant that transforms daily reflection into an engaging, insightful experience using AI. Built for the Maestro Hackathon 2024.

## 🌟 **Live Demo**
**Production URL**: https://ai-daily-journal-mt6i62r5b-utkarsh-kadus-projects.vercel.app

## ✨ **Key Features**

### 🧠 **AI-Powered Intelligence**
- **Smart Summarization**: Condenses entries to key insights
- **Emotion Detection**: Identifies and tracks emotional patterns
- **Personalized Reflections**: 4 different AI personality styles
- **Mood Analytics**: Visual charts and trend analysis
- **Goal Tracking**: Streak counters and progress monitoring

### 🎨 **Beautiful User Experience**
- **Dark Theme UI**: Modern interface with glassmorphism effects
- **Framer Motion Animations**: Smooth, professional animations
- **Voice Input**: Speech-to-text functionality
- **Smart Prompts**: AI-suggested writing prompts
- **Responsive Design**: Works on all devices

### 📊 **Rich Analytics**
- **Mood Calendar**: Heat map of daily emotional patterns
- **Progress Tracking**: Journaling streaks and goals
- **Export Options**: Download data in multiple formats
- **Search & Filter**: Find specific entries

## 🏗️ **Project Structure**

```
AI-Daily-Journal/
├── frontend/                 # Next.js Frontend
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS styling
│   ├── package.json        # Frontend dependencies
│   └── next.config.js      # Next.js configuration
├── backend/                 # FastAPI Backend
│   ├── api_server.py       # Main API server
│   ├── journal_agent.py    # AI processing logic
│   ├── api/                # Serverless functions
│   ├── requirements.txt    # Python dependencies
│   └── package.json        # Backend metadata
├── docs/                   # Documentation
│   ├── DOCUMENTATION.md    # Complete technical docs
│   ├── MAESTRO_INTEGRATION.md  # Maestro SDK guide
│   ├── DEPLOYMENT_GUIDE.md # Vercel deployment guide
│   └── APPLICATION_OVERVIEW.md # Project overview
├── .env                    # Environment variables
├── package.json           # Root package.json
├── setup.py              # Setup script
└── README.md             # This file
```

## 🚀 **Quick Start**

### Prerequisites
- **Node.js 16+**: JavaScript runtime
- **Python 3.8+**: Backend runtime
- **Git**: Version control
- **Maestro Account**: API access (optional for demo)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Utkarsh8867/AI-Daily-Journal.git
cd AI-Daily-Journal

# 2. Install all dependencies
python setup.py

# 3. Configure environment
# Edit .env with your Maestro API key

# 4. Start both servers
npm run dev
```

### Individual Commands
```bash
# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:8000)
npm run dev:backend

# Build for production
npm run build

# Deploy to Vercel
npm run deploy
```

### Manual Setup
```bash
# Install backend dependencies
cd backend && pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend && npm install

# Start backend (Terminal 1)
cd backend && python api_server.py

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

## 🔧 **Technology Stack**

### Frontend
- **Next.js 14**: React framework with SSR
- **React 18**: UI library with hooks
- **Framer Motion**: Animation library
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Backend
- **FastAPI**: High-performance Python framework
- **SQLite**: Lightweight database
- **Maestro SDK**: AI processing platform
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

## 🤖 **AI Integration**

### Current Implementation
- **Mock AI System**: Sophisticated responses demonstrating capabilities
- **Ready for Maestro**: Easy integration with Maestro SDK
- **4 AI Personalities**: Motivational, Gentle, Analytical, Wise
- **Emotion Categories**: 12+ different emotions tracked

### Maestro SDK Integration
```python
# Switch from mock to real AI
USE_MOCK_AI=false  # in .env file

# The system automatically uses Maestro when configured
```

## 📊 **Features Overview**

### Journal Input
- Voice recognition for hands-free input
- Smart writing prompts to overcome writer's block
- Real-time character counting
- Beautiful animations during processing

### Analytics Dashboard
- Mood calendar with heat map visualization
- Emotion distribution charts
- Weekly and monthly insights
- Goal progress tracking

### Settings & Personalization
- Choose AI reflection style
- Add custom emotion categories
- Set daily reminder notifications
- Privacy controls and data export

## 🌐 **API Endpoints**

```http
POST /api/journal/process     # Process journal entries
GET  /api/journal/entries     # Get entry history
GET  /api/journal/analytics   # Get mood analytics
GET  /api/journal/goals       # Get progress tracking
GET  /                        # Health check
```

## 🚀 **Deployment**

### Vercel (Recommended)
```bash
# Deploy frontend to Vercel
cd frontend && vercel --prod

# Backend deploys automatically as serverless functions
```

### Local Development
```bash
# Start both servers
npm run dev

# Access points:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 📚 **Documentation**

- **[Complete Documentation](DOCUMENTATION.md)**: Technical details and architecture
- **[Maestro Integration Guide](MAESTRO_INTEGRATION.md)**: Step-by-step SDK integration
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)**: Vercel deployment instructions
- **[Application Overview](APPLICATION_OVERVIEW.md)**: Project overview and features

## 🔒 **Environment Variables**

```bash
# .env file
MAESTRO_API_KEY=your_maestro_api_key_here
MAESTRO_ORG_ID=your_organization_id
MAESTRO_BASE_URL=https://dantalabs.com
USE_MOCK_AI=true  # Set to false for Maestro integration
```

## 🧪 **Testing**

```bash
# Test backend API
curl http://localhost:8000/

# Test journal processing
curl -X POST http://localhost:8000/api/journal/process \
  -H "Content-Type: application/json" \
  -d '{"entry_text": "Today was amazing!"}'
```

## 🎯 **Hackathon Demo**

### Demo Highlights
1. **Voice Input**: Show speech-to-text functionality
2. **AI Analysis**: Demonstrate real-time processing
3. **Beautiful UI**: Showcase animations and dark theme
4. **Analytics**: Display mood tracking and insights
5. **Personalization**: Show different AI styles

### Key Selling Points
- **Technical Excellence**: Full-stack with modern technologies
- **AI Innovation**: Creative use of AI for emotional intelligence
- **User Experience**: Professional UI with smooth animations
- **Completeness**: Production-ready with comprehensive features

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Maestro Team**: For the amazing AI platform and hackathon
- **Next.js Team**: For the excellent React framework
- **FastAPI Team**: For the high-performance Python framework
- **Open Source Community**: For all the amazing libraries

## 📞 **Support**

- **GitHub Issues**: [Report bugs and request features](https://github.com/Utkarsh8867/AI-Daily-Journal/issues)
- **Documentation**: Complete guides in the `/docs` folder
- **Live Demo**: Try the application at the production URL above

---

**Built with ❤️ for Maestro Hackathon 2024**

*Transform your daily reflection with the power of AI!* ✨