#!/usr/bin/env python3
"""
Setup script for AI Daily Journal Agent
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def main():
    print("🚀 Setting up AI Daily Journal Agent")
    print("=" * 50)
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python installation"):
        print("Please install Python 3.7+ and try again")
        return
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("Failed to install Python dependencies")
        return
    
    # Check if Node.js is available
    if not run_command("node --version", "Checking Node.js installation"):
        print("Please install Node.js and try again")
        return
    
    # Install Node.js dependencies
    if not run_command("npm install", "Installing Node.js dependencies"):
        print("Failed to install Node.js dependencies")
        return
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        print("📝 Creating .env file...")
        with open('.env', 'w') as f:
            f.write("# Copy your Maestro API key from hack.dantalabs.com\n")
            f.write("MAESTRO_API_KEY=uXH51ikyOybs8CyBZffQHbRud2_MXfvSXtp8xSSia8c\n")
            f.write("MAESTRO_BASE_URL=https://api.dantalabs.com\n")
        print("✅ Created .env file - please add your Maestro API key")
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Add your Maestro API key to the .env file")
    print("2. Start the backend: python backend/api_server.py")
    print("3. Start the frontend: npm run dev")
    print("4. Open http://localhost:3000 in your browser")
    print("\nHappy journaling! 📝✨")

if __name__ == "__main__":
    main()