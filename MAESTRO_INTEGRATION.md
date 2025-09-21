# 🤖 Maestro SDK Integration Guide

## 📋 Overview

This document provides a comprehensive guide for integrating the Maestro SDK into the AI Daily Journal application. The current implementation uses sophisticated mock AI responses that demonstrate the full capabilities, making it easy to switch to real Maestro agents.

---

## 🚀 Quick Integration Steps

### 1. Install Maestro SDK
```bash
# Install the Maestro SDK
pip install dantalabs

# Configure your credentials
dlm setup
```

### 2. Update Environment Variables
```bash
# Add to .env file
MAESTRO_API_KEY=your_maestro_api_key_here
MAESTRO_ORG_ID=your_organization_id
MAESTRO_BASE_URL=https://dantalabs.com
```

### 3. Switch from Mock to Real AI
```python
# In backend/journal_agent.py
class JournalAgent:
    def __init__(self):
        # Change this to False to use Maestro
        self.use_mock = False  # Switch to Maestro
        
        if not self.use_mock:
            from dantalabs.maestro import MaestroClient
            self.client = MaestroClient(
                token=os.getenv('MAESTRO_API_KEY'),
                organization_id=os.getenv('MAESTRO_ORG_ID')
            )
```

---

## 🏗️ Maestro Agent Architecture

### Agent Types Needed

#### 1. Journal Summarizer Agent
**Purpose**: Condense journal entries to key insights
```python
# Agent Definition
summary_agent_definition = """
def summarize_journal_entry(entry_text, max_sentences=2):
    '''
    Summarizes a journal entry while preserving emotional context
    
    Args:
        entry_text (str): The original journal entry
        max_sentences (int): Maximum sentences in summary
    
    Returns:
        dict: {"summary": str, "key_themes": list}
    '''
    # Extract main events and emotions
    # Preserve personal voice and tone
    # Return concise but meaningful summary
    
    return {
        "summary": processed_summary,
        "key_themes": extracted_themes
    }
"""
```

#### 2. Emotion Detection Agent
**Purpose**: Identify and categorize emotions from text
```python
# Agent Definition
emotion_agent_definition = """
def detect_emotions(entry_text, emotion_categories=None):
    '''
    Detects emotions from journal text with confidence scores
    
    Args:
        entry_text (str): The journal entry to analyze
        emotion_categories (list): Custom emotion categories
    
    Returns:
        dict: {"emotions": list, "confidence": dict, "intensity": dict}
    '''
    default_emotions = [
        'happy', 'sad', 'stressed', 'excited', 'tired', 
        'anxious', 'grateful', 'frustrated', 'proud', 
        'overwhelmed', 'calm', 'motivated'
    ]
    
    # Analyze text for emotional indicators
    # Consider context and intensity
    # Return top 2-3 emotions with confidence
    
    return {
        "emotions": detected_emotions,
        "confidence": confidence_scores,
        "intensity": intensity_levels
    }
"""
```

#### 3. Reflection Generator Agent
**Purpose**: Generate personalized, positive reflections
```python
# Agent Definition
reflection_agent_definition = """
def generate_reflection(entry_text, style='motivational', user_context=None):
    '''
    Generates personalized positive reflections based on journal content
    
    Args:
        entry_text (str): The journal entry
        style (str): Reflection style (motivational, gentle, analytical, wise)
        user_context (dict): User preferences and history
    
    Returns:
        dict: {"reflection": str, "style_used": str, "encouragement_level": int}
    '''
    styles = {
        'motivational': 'energetic_and_encouraging',
        'gentle': 'soft_and_nurturing', 
        'analytical': 'thoughtful_and_insightful',
        'wise': 'philosophical_and_deep'
    }
    
    # Analyze emotional context
    # Generate appropriate response based on style
    # Ensure positive, supportive tone
    # Include actionable insights when appropriate
    
    return {
        "reflection": generated_reflection,
        "style_used": style,
        "encouragement_level": calculated_level
    }
"""
```

---

## 🔧 Implementation Details

### 1. Create and Deploy Agents

```python
from dantalabs.maestro import MaestroClient
from dantalabs.maestro.models import AgentDefinitionCreate, AgentCreate

class MaestroJournalSetup:
    def __init__(self):
        self.client = MaestroClient()
        self.agent_ids = {}
    
    def create_agents(self):
        """Create all required agents for journal processing"""
        
        # 1. Create Summarizer Agent
        summary_definition = self.client.create_agent_definition(
            AgentDefinitionCreate(
                name="journal-summarizer",
                description="Summarizes journal entries preserving emotional context",
                definition=summary_agent_definition,
                definition_type="python",
                input_schema={
                    "type": "object",
                    "properties": {
                        "entry_text": {"type": "string"},
                        "max_sentences": {"type": "integer", "default": 2}
                    },
                    "required": ["entry_text"]
                },
                output_schema={
                    "type": "object", 
                    "properties": {
                        "summary": {"type": "string"},
                        "key_themes": {"type": "array", "items": {"type": "string"}}
                    }
                }
            )
        )
        
        summary_agent = self.client.create_agent(
            AgentCreate(
                name="journal-summarizer-instance",
                agent_type="script",
                agent_definition_id=summary_definition.id
            )
        )
        self.agent_ids['summarizer'] = summary_agent.id
        
        # 2. Create Emotion Detection Agent
        emotion_definition = self.client.create_agent_definition(
            AgentDefinitionCreate(
                name="emotion-detector",
                description="Detects emotions from journal text",
                definition=emotion_agent_definition,
                definition_type="python",
                input_schema={
                    "type": "object",
                    "properties": {
                        "entry_text": {"type": "string"},
                        "emotion_categories": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["entry_text"]
                }
            )
        )
        
        emotion_agent = self.client.create_agent(
            AgentCreate(
                name="emotion-detector-instance", 
                agent_type="script",
                agent_definition_id=emotion_definition.id
            )
        )
        self.agent_ids['emotion'] = emotion_agent.id
        
        # 3. Create Reflection Generator Agent
        reflection_definition = self.client.create_agent_definition(
            AgentDefinitionCreate(
                name="reflection-generator",
                description="Generates personalized positive reflections",
                definition=reflection_agent_definition,
                definition_type="python",
                input_schema={
                    "type": "object",
                    "properties": {
                        "entry_text": {"type": "string"},
                        "style": {"type": "string", "enum": ["motivational", "gentle", "analytical", "wise"]},
                        "user_context": {"type": "object"}
                    },
                    "required": ["entry_text"]
                }
            )
        )
        
        reflection_agent = self.client.create_agent(
            AgentCreate(
                name="reflection-generator-instance",
                agent_type="script", 
                agent_definition_id=reflection_definition.id
            )
        )
        self.agent_ids['reflection'] = reflection_agent.id
        
        return self.agent_ids

# Setup script
if __name__ == "__main__":
    setup = MaestroJournalSetup()
    agent_ids = setup.create_agents()
    print("Created agents:", agent_ids)
```

### 2. Update Journal Agent Class

```python
# Updated backend/journal_agent.py
import os
from datetime import datetime
from dantalabs.maestro import MaestroClient
from dotenv import load_dotenv
import sqlite3
import json

load_dotenv()

class JournalAgent:
    def __init__(self):
        self.use_mock = os.getenv('USE_MOCK_AI', 'true').lower() == 'true'
        
        if not self.use_mock:
            self.client = MaestroClient(
                token=os.getenv('MAESTRO_API_KEY'),
                organization_id=os.getenv('MAESTRO_ORG_ID')
            )
            
            # Agent IDs (store these after creation)
            self.agent_ids = {
                'summarizer': os.getenv('SUMMARIZER_AGENT_ID'),
                'emotion': os.getenv('EMOTION_AGENT_ID'), 
                'reflection': os.getenv('REFLECTION_AGENT_ID')
            }
        
        self.init_database()
    
    def process_journal_entry(self, entry_text, style='motivational'):
        """Process journal entry with Maestro or mock AI"""
        
        if self.use_mock:
            # Use existing mock implementation
            summary = self._mock_summarize(entry_text)
            emotions = self._mock_detect_emotions(entry_text)
            reflection = self._mock_generate_reflection(entry_text, style)
        else:
            # Use Maestro agents
            summary = self._maestro_summarize(entry_text)
            emotions = self._maestro_detect_emotions(entry_text)
            reflection = self._maestro_generate_reflection(entry_text, style)
        
        # Store and return results
        entry_data = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'original_entry': entry_text,
            'summary': summary,
            'emotions': emotions,
            'reflection': reflection
        }
        
        self.save_entry(entry_data)
        return {'success': True, 'data': entry_data}
    
    def _maestro_summarize(self, entry_text):
        """Summarize using Maestro agent"""
        try:
            response = self.client.execute_agent_code_sync(
                variables={
                    "entry_text": entry_text,
                    "max_sentences": 2
                },
                agent_id=self.agent_ids['summarizer']
            )
            return response.output.get('summary', entry_text)
        except Exception as e:
            print(f"Maestro summarization error: {e}")
            return self._mock_summarize(entry_text)  # Fallback
    
    def _maestro_detect_emotions(self, entry_text):
        """Detect emotions using Maestro agent"""
        try:
            response = self.client.execute_agent_code_sync(
                variables={
                    "entry_text": entry_text,
                    "emotion_categories": None
                },
                agent_id=self.agent_ids['emotion']
            )
            emotions = response.output.get('emotions', [])
            return ', '.join(emotions[:3])  # Top 3 emotions
        except Exception as e:
            print(f"Maestro emotion detection error: {e}")
            return self._mock_detect_emotions(entry_text)  # Fallback
    
    def _maestro_generate_reflection(self, entry_text, style='motivational'):
        """Generate reflection using Maestro agent"""
        try:
            response = self.client.execute_agent_code_sync(
                variables={
                    "entry_text": entry_text,
                    "style": style,
                    "user_context": {}
                },
                agent_id=self.agent_ids['reflection']
            )
            return response.output.get('reflection', 'Keep up the great work!')
        except Exception as e:
            print(f"Maestro reflection generation error: {e}")
            return self._mock_generate_reflection(entry_text, style)  # Fallback
```

### 3. Environment Configuration

```bash
# .env file for Maestro integration
USE_MOCK_AI=false
MAESTRO_API_KEY=your_maestro_api_key_here
MAESTRO_ORG_ID=your_organization_id
MAESTRO_BASE_URL=https://dantalabs.com

# Agent IDs (set after creating agents)
SUMMARIZER_AGENT_ID=agent_id_here
EMOTION_AGENT_ID=agent_id_here  
REFLECTION_AGENT_ID=agent_id_here
```

---

## 🧪 Testing Maestro Integration

### 1. Unit Tests
```python
# tests/test_maestro_integration.py
import pytest
from backend.journal_agent import JournalAgent

class TestMaestroIntegration:
    def setup_method(self):
        self.agent = JournalAgent()
    
    def test_summarization(self):
        entry = "Today was challenging but I learned a lot about resilience."
        result = self.agent._maestro_summarize(entry)
        assert len(result) > 0
        assert len(result) < len(entry)
    
    def test_emotion_detection(self):
        entry = "I felt happy and excited about my achievements today."
        emotions = self.agent._maestro_detect_emotions(entry)
        assert 'happy' in emotions.lower()
        assert 'excited' in emotions.lower()
    
    def test_reflection_generation(self):
        entry = "I struggled with anxiety today but managed to push through."
        reflection = self.agent._maestro_generate_reflection(entry, 'gentle')
        assert len(reflection) > 20
        assert any(word in reflection.lower() for word in ['gentle', 'kind', 'understanding'])
```

### 2. Integration Tests
```python
# tests/test_full_integration.py
def test_full_journal_processing():
    agent = JournalAgent()
    entry = "Today I completed a challenging project and felt proud of my work."
    
    result = agent.process_journal_entry(entry)
    
    assert result['success'] == True
    assert 'summary' in result['data']
    assert 'emotions' in result['data']
    assert 'reflection' in result['data']
    assert len(result['data']['summary']) > 0
```

---

## 📊 Performance Monitoring

### 1. Response Time Tracking
```python
import time
from functools import wraps

def monitor_performance(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        
        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper

class JournalAgent:
    @monitor_performance
    def _maestro_summarize(self, entry_text):
        # Implementation
        pass
```

### 2. Error Handling and Fallbacks
```python
def with_fallback(maestro_func, mock_func):
    """Decorator to provide mock fallback for Maestro functions"""
    def wrapper(*args, **kwargs):
        try:
            return maestro_func(*args, **kwargs)
        except Exception as e:
            print(f"Maestro error: {e}, falling back to mock")
            return mock_func(*args, **kwargs)
    return wrapper

# Usage
self._maestro_summarize = with_fallback(
    self._maestro_summarize_impl,
    self._mock_summarize
)
```

---

## 🚀 Deployment with Maestro

### 1. Container Deployment
```python
# Deploy agents as containers for better performance
def deploy_agents_as_containers(self):
    for agent_name, agent_id in self.agent_ids.items():
        try:
            self.client.deploy_service(agent_id)
            print(f"Deployed {agent_name} as container service")
        except Exception as e:
            print(f"Failed to deploy {agent_name}: {e}")
```

### 2. Production Configuration
```python
# production_config.py
MAESTRO_CONFIG = {
    'timeout': 30,  # seconds
    'retry_attempts': 3,
    'fallback_enabled': True,
    'cache_responses': True,
    'batch_processing': False
}
```

---

## 🔍 Debugging and Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors
```python
# Check credentials
def verify_maestro_connection(self):
    try:
        # Test connection
        agents = self.client.list_agents()
        print(f"Connected successfully. Found {len(agents)} agents.")
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False
```

#### 2. Agent Not Found
```python
# Verify agent exists
def check_agent_exists(self, agent_id):
    try:
        agent = self.client.get_agent(agent_id)
        print(f"Agent found: {agent.name}")
        return True
    except Exception as e:
        print(f"Agent {agent_id} not found: {e}")
        return False
```

#### 3. Timeout Issues
```python
# Add timeout handling
import asyncio

async def maestro_with_timeout(self, func, *args, timeout=30):
    try:
        return await asyncio.wait_for(func(*args), timeout=timeout)
    except asyncio.TimeoutError:
        print(f"Maestro request timed out after {timeout} seconds")
        return None
```

---

## 📈 Optimization Tips

### 1. Batch Processing
```python
def process_multiple_entries(self, entries):
    """Process multiple entries efficiently"""
    results = []
    
    # Batch similar operations
    summaries = self._batch_summarize([e['text'] for e in entries])
    emotions = self._batch_detect_emotions([e['text'] for e in entries])
    reflections = self._batch_generate_reflections([e['text'] for e in entries])
    
    for i, entry in enumerate(entries):
        results.append({
            'summary': summaries[i],
            'emotions': emotions[i], 
            'reflection': reflections[i]
        })
    
    return results
```

### 2. Caching
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=100)
def cached_maestro_call(self, text_hash, operation):
    """Cache Maestro responses to avoid duplicate calls"""
    # Implementation based on operation type
    pass

def get_text_hash(self, text):
    return hashlib.md5(text.encode()).hexdigest()
```

---

## 🎯 Best Practices

### 1. Error Handling
- Always provide fallback to mock AI
- Log all Maestro API errors
- Implement retry logic with exponential backoff
- Monitor API usage and costs

### 2. Performance
- Cache frequent requests
- Use batch processing when possible
- Implement request timeouts
- Monitor response times

### 3. Security
- Store API keys securely
- Use environment variables
- Implement rate limiting
- Validate all inputs

### 4. Monitoring
- Track API usage
- Monitor error rates
- Log performance metrics
- Set up alerts for failures

---

## 📚 Additional Resources

- [Maestro SDK Documentation](https://docs.dantalabs.com)
- [Agent Development Guide](https://docs.dantalabs.com/agents)
- [API Reference](https://docs.dantalabs.com/api)
- [Best Practices](https://docs.dantalabs.com/best-practices)

---

**Ready to integrate with Maestro? Follow this guide step by step and you'll have real AI processing in no time! 🚀**