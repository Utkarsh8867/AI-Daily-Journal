#!/usr/bin/env python3
"""
Simple script to run both backend and frontend
"""
import subprocess
import sys
import time
import os
from threading import Thread

def run_backend():
    """Run the backend server"""
    print("🔄 Starting backend server on port 8000...")
    try:
        # Change to backend directory and run server
        env = os.environ.copy()
        result = subprocess.run([
            sys.executable, "backend/api_server.py"
        ], env=env, cwd=os.getcwd())
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend error: {e}")

def run_frontend():
    """Run the frontend server"""
    print("🔄 Starting frontend server on port 3000...")
    time.sleep(3)  # Give backend time to start
    try:
        result = subprocess.run(["npm", "run", "dev"], cwd=os.getcwd())
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Frontend error: {e}")

def main():
    print("🚀 Starting AI Daily Journal Application")
    print("=" * 50)
    
    # Start backend in background thread
    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Start frontend in main thread (so we can see the output)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down application...")
        print("👋 Thanks for using AI Daily Journal!")

if __name__ == "__main__":
    main()