import requests
import json

def test_backend():
    base_url = "http://localhost:8002"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Health check: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test journal processing
    try:
        test_entry = {
            "entry_text": "Today was a good day. I felt happy and accomplished after finishing my project."
        }
        response = requests.post(f"{base_url}/api/journal/process", json=test_entry)
        print(f"✅ Process entry: {response.json()}")
    except Exception as e:
        print(f"❌ Process entry failed: {e}")
        return False
    
    # Test getting entries
    try:
        response = requests.get(f"{base_url}/api/journal/entries")
        print(f"✅ Get entries: {response.json()}")
    except Exception as e:
        print(f"❌ Get entries failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🧪 Testing backend API...")
    if test_backend():
        print("🎉 All tests passed!")
    else:
        print("❌ Some tests failed!")