import random
from datetime import datetime
from .database import ServerlessDatabase

class ServerlessJournalProcessor:
    def __init__(self):
        self.db = ServerlessDatabase()
    
    def process_journal_entry(self, entry_text):
        """Process a journal entry with mock AI"""
        try:
            # Mock AI processing
            summary = self._mock_summarize(entry_text)
            emotions = self._mock_detect_emotions(entry_text)
            reflection = self._mock_generate_reflection(entry_text)
            
            # Store in database
            entry_data = {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'original_entry': entry_text,
                'summary': summary,
                'emotions': emotions,
                'reflection': reflection
            }
            
            self.db.save_entry(entry_data)
            
            return {
                'success': True,
                'data': entry_data
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_recent_entries(self, limit=10):
        """Get recent journal entries"""
        return self.db.get_recent_entries(limit)
    
    def _mock_summarize(self, text):
        """Mock summarization"""
        words = text.split()
        if len(words) <= 10:
            return text
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if len(sentences) <= 2:
            return text
        return f"{sentences[0]}. {sentences[-1]}."
    
    def _mock_detect_emotions(self, text):
        """Mock emotion detection"""
        text_lower = text.lower()
        emotions = []
        
        # Positive emotions
        if any(word in text_lower for word in ['happy', 'joy', 'excited', 'great', 'amazing']):
            emotions.append('happy')
        if any(word in text_lower for word in ['proud', 'accomplished', 'achieved']):
            emotions.append('proud')
        if any(word in text_lower for word in ['grateful', 'thankful', 'blessed']):
            emotions.append('grateful')
            
        # Negative emotions
        if any(word in text_lower for word in ['sad', 'depressed', 'down', 'upset']):
            emotions.append('sad')
        if any(word in text_lower for word in ['stressed', 'stress', 'pressure', 'overwhelmed']):
            emotions.append('stressed')
        if any(word in text_lower for word in ['tired', 'exhausted', 'fatigue']):
            emotions.append('tired')
            
        # Default emotions if none detected
        if not emotions:
            emotions = ['reflective', 'thoughtful']
                
        return ', '.join(emotions[:3])
    
    def _mock_generate_reflection(self, text):
        """Mock positive reflection generation"""
        reflections = [
            "Your self-awareness through journaling shows incredible wisdom and growth.",
            "Every thought you capture is a step toward understanding yourself better.",
            "The fact that you're reflecting on your experiences shows real emotional intelligence.",
            "Your willingness to explore your feelings demonstrates courage and self-compassion.",
            "Taking time for self-reflection is one of the most valuable gifts you can give yourself."
        ]
        return random.choice(reflections)