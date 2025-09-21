from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add the api directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Import our serverless journal processor
try:
    from journal_processor import ServerlessJournalProcessor
    journal_processor = ServerlessJournalProcessor()
except Exception as e:
    print(f"Error importing journal processor: {e}")
    journal_processor = None

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JournalEntry(BaseModel):
    entry_text: str

@app.post("/")
async def process_entry(entry: JournalEntry):
    """Process a new journal entry"""
    try:
        if journal_processor is None:
            raise HTTPException(status_code=500, detail="Journal processor not initialized")
        
        result = journal_processor.process_journal_entry(entry.entry_text)
        return result
    except Exception as e:
        print(f"❌ Error processing entry: {e}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

# Vercel handler
def handler(request, context):
    return app