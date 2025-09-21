# 🎨 AI Daily Journal - Frontend

Beautiful, responsive Next.js frontend for the AI Daily Journal application.

## ✨ Features

- **Dark Theme UI**: Modern, professional interface with glassmorphism effects
- **Framer Motion Animations**: Smooth, engaging animations throughout
- **Voice Input**: Speech-to-text functionality for hands-free journaling
- **Smart Prompts**: AI-suggested writing prompts to overcome writer's block
- **Analytics Dashboard**: Visual mood tracking and insights
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── components/          # React components
│   ├── JournalInput.js  # Main journal entry interface
│   ├── RecentEntries.js # Entry history and management
│   ├── Analytics.js     # Data visualization and insights
│   └── Settings.js      # Personalization options
├── pages/               # Next.js pages
│   ├── index.js         # Main application
│   ├── simple.js        # Simplified demo version
│   └── _app.js          # App configuration
├── styles/              # CSS styling
│   └── globals.css      # Global styles and dark theme
└── next.config.js       # Next.js configuration
```

## 🎯 Key Components

### JournalInput
- Voice input with speech recognition
- Smart prompt suggestions
- Real-time character counting
- Animated processing states

### Analytics
- Mood calendar heat map
- Emotion distribution charts
- Goal progress tracking
- AI-generated insights

### Settings
- Reflection style selection
- Custom emotion management
- Notification preferences
- Privacy controls

## 🌐 API Integration

The frontend communicates with the backend through REST API calls:

- `POST /api/journal/process` - Process journal entries
- `GET /api/journal/entries` - Retrieve entry history
- `GET /api/journal/analytics` - Get mood analytics

## 🎨 Styling

- **CSS Variables**: Custom design system with dark theme
- **Framer Motion**: Professional animations and transitions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant interface

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development|production
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
```

### Next.js Config
- API rewrites for backend communication
- Image optimization
- Build optimization for Vercel deployment

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

The frontend is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel --prod
```

Built with ❤️ using Next.js and React