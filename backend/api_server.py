from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import datetime, timedelta
from collections import Counter
import json
import os

app = FastAPI(title="AI Journal API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize journal agent - import here to avoid circular imports
try:
    from journal_agent import JournalAgent
    journal_agent = JournalAgent()
    print("✅ Journal agent initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize journal agent: {e}")
    journal_agent = None

class JournalEntry(BaseModel):
    entry_text: str

@app.post("/api/journal/process")
async def process_entry(entry: JournalEntry):
    """Process a new journal entry"""
    try:
        if journal_agent is None:
            print("❌ Journal agent is None")
            raise HTTPException(status_code=500, detail="Journal agent not initialized")
        
        print(f"🔄 Processing entry: {entry.entry_text[:50]}...")
        result = journal_agent.process_journal_entry(entry.entry_text)
        print(f"✅ Successfully processed entry")
        return result
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error processing entry: {e}")
        print(f"❌ Full traceback: {error_details}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/api/journal/entries")
async def get_entries(limit: int = 10):
    """Get recent journal entries"""
    try:
        if journal_agent is None:
            raise HTTPException(status_code=500, detail="Journal agent not initialized")
            
        entries = journal_agent.get_recent_entries(limit)
        print(f"✅ Retrieved {len(entries)} entries")
        return {"success": True, "entries": entries}
    except Exception as e:
        print(f"❌ Error getting entries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/journal/analytics")
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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/journal/goals")
async def get_goals():
    """Get journaling goals and progress"""
    try:
        if journal_agent is None:
            raise HTTPException(status_code=500, detail="Journal agent not initialized")
            
        conn = sqlite3.connect(journal_agent.db_path)
        cursor = conn.cursor()
        
        # Get total entries
        cursor.execute('SELECT COUNT(*) FROM entries')
        total_entries = cursor.fetchone()[0]
        
        # Get entries this week
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        cursor.execute('SELECT COUNT(*) FROM entries WHERE date >= ?', (week_ago,))
        week_entries = cursor.fetchone()[0]
        
        # Get streak (consecutive days with entries)
        cursor.execute('''
            SELECT date FROM entries 
            ORDER BY date DESC
        ''')
        dates = [row[0] for row in cursor.fetchall()]
        
        streak = 0
        current_date = datetime.now().date()
        for date_str in dates:
            entry_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            if entry_date == current_date or entry_date == current_date - timedelta(days=streak):
                if entry_date == current_date - timedelta(days=streak):
                    streak += 1
                current_date = entry_date
            else:
                break
        
        conn.close()
        
        # Calculate goals
        goals = {
            "daily_streak": {
                "current": streak,
                "target": 7,
                "progress": min(streak / 7 * 100, 100)
            },
            "weekly_entries": {
                "current": week_entries,
                "target": 5,
                "progress": min(week_entries / 5 * 100, 100)
            },
            "total_entries": {
                "current": total_entries,
                "target": 30,
                "progress": min(total_entries / 30 * 100, 100)
            }
        }
        
        return {"success": True, "goals": goals}
        
    except Exception as e:
        print(f"❌ Error getting goals: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI Journal API is running! 🚀"}

# Vercel serverless handler
def handler(request, context):
    return app

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Journal API server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)