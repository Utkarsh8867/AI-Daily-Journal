import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime, timedelta
from collections import Counter

# Import our journal agent
try:
    from backend.journal_agent import JournalAgent
    journal_agent = JournalAgent()
except Exception as e:
    print(f"Error importing journal agent: {e}")
    journal_agent = None

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_analytics():
    """Get mood analytics and insights"""
    try:
        if journal_agent is None:
            raise HTTPException(status_code=500, detail="Journal agent not initialized")
            
        conn = sqlite3.connect(journal_agent.db_path)
        cursor = conn.cursor()
        
        # Get entries from last 7 days
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        cursor.execute('''
            SELECT date, emotions FROM entries 
            WHERE date >= ? 
            ORDER BY date
        ''', (week_ago,))
        
        entries = cursor.fetchall()
        conn.close()
        
        # Process mood data
        daily_moods = {}
        all_emotions = []
        
        for date, emotions_str in entries:
            if emotions_str:
                emotions = [e.strip().lower() for e in emotions_str.split(',')]
                daily_moods[date] = emotions
                all_emotions.extend(emotions)
        
        # Count emotion frequencies
        emotion_counts = Counter(all_emotions)
        top_emotions = dict(emotion_counts.most_common(5))
        
        return {
            "success": True,
            "analytics": {
                "daily_moods": daily_moods,
                "top_emotions": top_emotions,
                "total_entries": len(entries),
                "week_summary": f"You've journaled {len(entries)} times this week!"
            }
        }
        
    except Exception as e:
        print(f"❌ Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Vercel handler
def handler(request, context):
    return app