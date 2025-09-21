import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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
async def get_entries(limit: int = 10):
    """Get recent journal entries"""
    try:
        if journal_agent is None:
            raise HTTPException(status_code=500, detail="Journal agent not initialized")
            
        entries = journal_agent.get_recent_entries(limit)
        return {"success": True, "entries": entries}
    except Exception as e:
        print(f"❌ Error getting entries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Vercel handler
def handler(request, context):
    return app