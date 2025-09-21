import sqlite3
import os
from datetime import datetime
import tempfile

class ServerlessDatabase:
    def __init__(self):
        # Use a temporary file for serverless environment
        self.db_path = os.path.join(tempfile.gettempdir(), 'journal.db')
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for journal entries"""
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