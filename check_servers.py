import requests
import time

def check_servers():
    print("🔍 Checking server status...")
    
    # Check backend
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running on port 8000")
        else:
            print(f"❌ Backend server returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Backend server is not responding: {e}")
    
    # Check frontend
    try:
        response = requests.get("http://localhost:3000/", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend server is running on port 3000")
        else:
            print(f"❌ Frontend server returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend server is not responding: {e}")
    
    # Test API endpoint directly
    try:
        response = requests.post(
            "http://localhost:8000/api/journal/process",
            json={"entry_text": "Test entry for server check"},
            timeout=10
        )
        if response.status_code == 200:
            print("✅ Backend API is working correctly")
        else:
            print(f"❌ Backend API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Backend API is not working: {e}")

if __name__ == "__main__":
    check_servers()
    print("\n🎯 If both servers are running, visit: http://localhost:3000")
    print("📖 Backend API docs: http://localhost:8000/docs")