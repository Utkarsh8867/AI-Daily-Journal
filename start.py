#!/usr/bin/env python3
"""
Startup script for AI Daily Journal Agent
Starts both backend and frontend servers
"""

import subprocess
import sys
import time
import os
from threading import Thread

def start_backend():
    """Start the FastAPI backend server"""
    print("🔄 Starting backend server...")
    try:
        os.chdir('backend')
        subprocess.run([sys.executable, 'api_server.py'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend server error: {e}")

def start_frontend():
    """Start the Next.js frontend server"""
    print("🔄 Starting frontend server...")
    time.sleep(3)  # Give backend time to start
    try:
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Frontend server error: {e}")

def main():
    print("🚀 Starting AI Daily Journal Agent")
    print("=" * 50)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please run 'python setup.py' first and add your Maestro API key")
        return
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Start frontend in main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        print("👋 Thanks for using AI Daily Journal!")

if __name__ == "__main__":
    main()