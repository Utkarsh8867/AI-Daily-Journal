import os
from datetime import datetime
from dotenv import load_dotenv
import sqlite3
import json
import re

load_dotenv()

class JournalAgent:
    def __init__(self):
        # For hackathon demo - using mock AI responses
        # Replace with actual Maestro client when ready
        self.use_mock = True
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for journal entries"""
        # Use absolute path to ensure database is created in the right location
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'journal.db')
        self.db_path = os.path.abspath(db_path)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                original_entry TEXT NOT NULL,
                summary TEXT,
                emotions TEXT,
                reflection TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
        print(f"✅ Database initialized at: {self.db_path}")
    
    def process_journal_entry(self, entry_text: str):
        """Process a journal entry through AI analysis"""
        
        # Summarization prompt
        summary_prompt = f"""
        Summarize this journal entry in 1-2 short sentences, keeping the key points:
        
        "{entry_text}"
        
        Summary:"""
        
        # Emotion detection prompt
        emotion_prompt = f"""
        Analyze the emotions in this journal entry. List 2-3 main emotions from this list:
        [happy, sad, stressed, excited, tired, anxious, grateful, frustrated, proud, overwhelmed, calm, motivated]
        
        Journal entry: "{entry_text}"
        
        Emotions (comma-separated):"""
        
        # Positive reflection prompt
        reflection_prompt = f"""
        Based on this journal entry, provide a short, encouraging reflection or advice (2-3 sentences).
        Be supportive and focus on growth, resilience, or positivity.
        
        Journal entry: "{entry_text}"
        
        Positive reflection:"""
        
        try:
            if self.use_mock:
                # Mock AI responses for hackathon demo
                summary = self._mock_summarize(entry_text)
                emotions = self._mock_detect_emotions(entry_text)
                reflection = self._mock_generate_reflection(entry_text)
            else:
                # TODO: Replace with actual Maestro client calls
                # summary_response = self.client.chat(summary_prompt)
                # summary = summary_response.get('content', '').strip()
                pass
            
            # Store in database
            entry_data = {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'original_entry': entry_text,
                'summary': summary,
                'emotions': emotions,
                'reflection': reflection
            }
            
            self.save_entry(entry_data)
            
            return {
                'success': True,
                'data': entry_data
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def save_entry(self, entry_data):
        """Save processed entry to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO entries (date, original_entry, summary, emotions, reflection)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            entry_data['date'],
            entry_data['original_entry'],
            entry_data['summary'],
            entry_data['emotions'],
            entry_data['reflection']
        ))
        conn.commit()
        conn.close()
    
    def _mock_summarize(self, text):
        """Mock summarization for demo purposes"""
        words = text.split()
        if len(words) <= 10:
            return text
        # Simple extractive summary - take first and key sentences
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if len(sentences) <= 2:
            return text
        return f"{sentences[0]}. {sentences[-1]}."
    
    def _mock_detect_emotions(self, text):
        """Mock emotion detection based on keywords"""
        text_lower = text.lower()
        emotions = []
        
        # Positive emotions
        if any(word in text_lower for word in ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful']):
            emotions.append('happy')
        if any(word in text_lower for word in ['proud', 'accomplished', 'achieved', 'success']):
            emotions.append('proud')
        if any(word in text_lower for word in ['grateful', 'thankful', 'blessed', 'appreciate']):
            emotions.append('grateful')
        if any(word in text_lower for word in ['calm', 'peaceful', 'relaxed', 'serene']):
            emotions.append('calm')
        if any(word in text_lower for word in ['motivated', 'inspired', 'determined', 'focused']):
            emotions.append('motivated')
        if any(word in text_lower for word in ['excited', 'thrilled', 'enthusiastic']):
            emotions.append('excited')
            
        # Negative emotions
        if any(word in text_lower for word in ['sad', 'depressed', 'down', 'upset', 'disappointed']):
            emotions.append('sad')
        if any(word in text_lower for word in ['stressed', 'stress', 'pressure', 'overwhelmed', 'busy']):
            emotions.append('stressed')
        if any(word in text_lower for word in ['anxious', 'worried', 'nervous', 'anxiety']):
            emotions.append('anxious')
        if any(word in text_lower for word in ['tired', 'exhausted', 'fatigue', 'sleepy']):
            emotions.append('tired')
        if any(word in text_lower for word in ['frustrated', 'annoyed', 'irritated', 'angry']):
            emotions.append('frustrated')
        if any(word in text_lower for word in ['overwhelmed', 'too much', 'can\'t handle']):
            emotions.append('overwhelmed')
            
        # Default emotions if none detected
        if not emotions:
            if any(word in text_lower for word in ['work', 'study', 'exam', 'project']):
                emotions = ['focused', 'determined']
            else:
                emotions = ['reflective', 'thoughtful']
                
        return ', '.join(emotions[:3])  # Limit to 3 emotions
    
    def _mock_generate_reflection(self, text, style='motivational'):
        """Mock positive reflection generation with different styles"""
        text_lower = text.lower()
        
        # Determine reflection style (could be passed from frontend settings)
        reflection_styles = {
            'motivational': {
                'stressed': [
                    "🚀 Stress is your mind's way of saying you care deeply! Channel that energy into small, powerful actions.",
                    "💪 Every challenge you face is building your resilience muscle. You're stronger than you know!",
                    "⚡ Transform that stress into fuel for growth. You've overcome challenges before - you'll do it again!"
                ],
                'work': [
                    "🎯 Your dedication to excellence is inspiring! Every effort you make is an investment in your future self.",
                    "🌟 Success is built one focused day at a time. You're laying the foundation for something amazing!",
                    "🔥 Your work ethic is your superpower. Keep pushing boundaries and creating your own opportunities!"
                ],
                'tired': [
                    "🌙 Rest is not giving up - it's recharging for your next breakthrough. Honor your body's wisdom.",
                    "⚡ Even champions need recovery time. Tomorrow you'll return stronger and more focused!",
                    "🔋 Your energy is precious - invest it wisely. Rest today, conquer tomorrow!"
                ],
                'happy': [
                    "🎉 Your joy is magnetic! This positive energy will attract even more amazing experiences.",
                    "✨ Happiness is your natural state - you're remembering who you truly are. Keep shining!",
                    "🌈 These beautiful moments are proof that life is working in your favor. Celebrate every win!"
                ]
            },
            'gentle': {
                'stressed': [
                    "🌸 It's okay to feel overwhelmed sometimes. Take a gentle breath and remember - this too shall pass.",
                    "🤗 You're carrying a lot right now, and that takes courage. Be gentle with yourself today.",
                    "🌿 Like a tree bending in the wind, your flexibility in tough times shows your inner strength."
                ],
                'work': [
                    "🌱 Your efforts are like seeds planted in rich soil - growth takes time, but it's happening.",
                    "🕊️ There's beauty in your dedication. Remember to pause and appreciate how far you've come.",
                    "🌺 Your hard work is a form of self-care - you're nurturing your future with love."
                ],
                'tired': [
                    "🌙 Your body is whispering wisdom - listen with compassion. Rest is a gift you give yourself.",
                    "🤲 Tiredness is not weakness; it's your body asking for the care it deserves.",
                    "🌸 Like flowers that close at night, sometimes we need to turn inward and restore."
                ],
                'happy': [
                    "🌻 Your happiness is like sunshine - it warms not just you, but everyone around you.",
                    "🦋 These moments of joy are precious gifts. Hold them gently in your heart.",
                    "🌈 Your smile today is a reminder that beauty exists in simple moments."
                ]
            },
            'analytical': {
                'stressed': [
                    "🧠 Stress often indicates high engagement with meaningful goals. Consider breaking large tasks into smaller, manageable components.",
                    "📊 Your stress response shows you're pushing your comfort zone - a key indicator of personal growth.",
                    "🔍 This tension suggests you're at a learning edge. What specific skills is this situation developing?"
                ],
                'work': [
                    "📈 Your consistent effort is creating compound returns on your investment in yourself.",
                    "🎯 Each focused work session is building neural pathways that enhance your future performance.",
                    "⚙️ Your work patterns reveal a commitment to mastery - a trait shared by high achievers."
                ],
                'tired': [
                    "🔋 Fatigue is data - your system is signaling the need for recovery to optimize performance.",
                    "⚖️ Balancing effort with rest is a skill that separates sustainable achievers from burnout cases.",
                    "🧪 Your body's feedback loop is functioning perfectly - listen to this valuable information."
                ],
                'happy': [
                    "📊 Positive emotions broaden your cognitive capacity and enhance creative problem-solving abilities.",
                    "🔬 This happiness is evidence of alignment between your actions and values - a key predictor of life satisfaction.",
                    "📈 Joy creates an upward spiral effect, improving your resilience and decision-making quality."
                ]
            },
            'wise': {
                'stressed': [
                    "🦉 In the depths of winter, I finally learned that within me there lay an invincible summer. Your strength runs deeper than your stress.",
                    "🌊 Like a river that finds its way around rocks, you too will navigate through this challenge with grace.",
                    "🏔️ Mountains are not moved by worry, but by persistent, patient effort. Trust your journey."
                ],
                'work': [
                    "🌱 The bamboo that bends is stronger than the oak that resists. Your adaptability in work is wisdom in action.",
                    "⭐ Every master was once a beginner. Every pro was once an amateur. Honor where you are in your journey.",
                    "🎨 Work becomes art when you bring your whole self to it. You're crafting something meaningful."
                ],
                'tired': [
                    "🌙 Even the moon takes time to wax and wane. Your rhythms are part of a larger, beautiful cycle.",
                    "🍃 The tree that would grow tall must sink its roots deep. Rest is how you deepen your foundation.",
                    "🌊 The ocean is powerful not because it never rests, but because it knows when to be still."
                ],
                'happy': [
                    "☀️ Happiness is not a destination, but a way of traveling. You're walking the path with wisdom.",
                    "🌸 Joy shared is joy doubled. Your happiness ripples out into the world in ways you may never know.",
                    "💎 These moments of contentment are diamonds in the rough of daily life. Treasure them."
                ]
            }
        }
        
        # Determine category
        if any(word in text_lower for word in ['stressed', 'anxiety', 'worried', 'overwhelmed']):
            category = 'stressed'
        elif any(word in text_lower for word in ['study', 'exam', 'work', 'project']):
            category = 'work'
        elif any(word in text_lower for word in ['tired', 'exhausted', 'sleepy']):
            category = 'tired'
        elif any(word in text_lower for word in ['happy', 'great', 'amazing', 'good', 'excited', 'grateful']):
            category = 'happy'
        else:
            category = 'happy'  # Default to positive
            
        import random
        return random.choice(reflection_styles.get(style, reflection_styles['motivational']).get(category, reflection_styles['motivational']['happy']))

    def get_recent_entries(self, limit=10):
        """Get recent journal entries"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM entries 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (limit,))
        
        entries = cursor.fetchall()
        conn.close()
        
        return [
            {
                'id': entry[0],
                'date': entry[1],
                'original_entry': entry[2],
                'summary': entry[3],
                'emotions': entry[4],
                'reflection': entry[5],
                'created_at': entry[6]
            }
            for entry in entries
        ]

# Test the agent
if __name__ == "__main__":
    journal = JournalAgent()
    
    # Test entry
    test_entry = "Today I studied for my exam, but I felt tired and stressed. I'm worried about tomorrow's test."
    
    result = journal.process_journal_entry(test_entry)
    print("Processing result:", json.dumps(result, indent=2))
    
    # Get recent entries
    recent = journal.get_recent_entries(5)
    print("Recent entries:", json.dumps(recent, indent=2))