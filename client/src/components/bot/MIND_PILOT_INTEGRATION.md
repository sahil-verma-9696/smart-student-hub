# Mind Pilot Frontend Integration Guide

## Overview

This guide explains how to integrate Mind Pilot features in the React frontend using the new authenticated endpoints with student context.

## Setting Up Authentication

### 1. Store JWT Token After Login

In your login component or auth service:

```jsx
// After successful login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

// Store token for later use
localStorage.setItem('auth_token', data.token);
localStorage.setItem('user_profile', JSON.stringify(data.user));
```

### 2. Create Auth Service

Create `src/services/authService.js`:

```javascript
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
```

## Using Mind Pilot Endpoints

### 1. Get Student Skill Profile

Create `src/services/mindPilotService.js`:

```javascript
import { getAuthHeaders } from './authService';

const API_BASE = 'http://localhost:3000';

export const getMindPilotSkillProfile = async () => {
  try {
    const response = await fetch(`${API_BASE}/mind-piolet/me/skills`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching skill profile:', error);
    throw error;
  }
};
```

### 2. Get Complete Mind Pilot Data

```javascript
export const getMindPilotData = async () => {
  try {
    const response = await fetch(`${API_BASE}/mind-piolet/me/data`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Mind Pilot data:', error);
    throw error;
  }
};
```

### 3. Chat with Mind Pilot

```javascript
export const chatWithMindPilot = async (
  message,
  feature,
  role = 'student'
) => {
  if (!['skill', 'roadmap', 'interview', 'gap-finder', 'guidance'].includes(feature)) {
    throw new Error('Invalid feature');
  }

  try {
    const response = await fetch(`${API_BASE}/mind-piolet/me/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message,
        feature,
        role
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error chatting with Mind Pilot:', error);
    throw error;
  }
};
```

## Updated Bot Component

Here's how to update `Bot.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Menu, X, Briefcase, TrendingUp, Book } from 'lucide-react';
import {
  chatWithMindPilot,
  getMindPilotSkillProfile,
  getMindPilotData
} from '../services/mindPilotService';
import { isAuthenticated } from '../services/authService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('student');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login or show auth required message
      window.location.href = '/login';
    } else {
      // Load student profile when authenticated
      loadStudentProfile();
    }
  }, []);

  const loadStudentProfile = async () => {
    try {
      const profile = await getMindPilotSkillProfile();
      setStudentProfile(profile);
    } catch (error) {
      console.error('Failed to load student profile:', error);
    }
  };

  const features = [
    { id: 'interview', name: 'Interview Preparation', icon: Briefcase },
    { id: 'skill', name: 'Skill Analysis', icon: TrendingUp },
    { id: 'roadmap', name: 'Roadmap Provider', icon: Book },
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedFeature) {
      alert('Please select a feature and enter a message');
      return;
    }

    setLoading(true);

    try {
      // Add user message to chat
      setMessages((prev) => [...prev, { role: 'user', content: input }]);

      // Send to Mind Pilot with student context
      const response = await chatWithMindPilot(
        input,
        selectedFeature,
        role
      );

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.result || response.message || 'No response'
        }
      ]);

      setInput('');
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${error.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setRole('student');
    setSelectedFeature(null);
  };

  const selectedFeatureObj = features.find((f) => f.id === selectedFeature);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with features */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
        overflowX: 'hidden',
        transition: 'width 0.3s'
      }}>
        {sidebarOpen && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: darkMode ? '#fff' : '#000', marginBottom: '20px' }}>
              Mind Pilot
            </h2>

            {/* Display student profile info */}
            {studentProfile && (
              <div style={{
                backgroundColor: darkMode ? '#111827' : '#fff',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                <p><strong>{studentProfile.name}</strong></p>
                <p>{studentProfile.institute}</p>
                <p>Roll: {studentProfile.rollNumber}</p>
              </div>
            )}

            {/* Skills display */}
            {studentProfile && studentProfile.skills && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: darkMode ? '#fff' : '#000', fontSize: '14px' }}>
                  Your Skills
                </h3>
                <div style={{ marginTop: '10px' }}>
                  {studentProfile.skills.slice(0, 5).map((skill) => (
                    <div key={skill.name} style={{
                      display: 'inline-block',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginRight: '5px',
                      marginBottom: '5px',
                      fontSize: '12px'
                    }}>
                      {skill.name} <span style={{ opacity: 0.7 }}>({skill.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature selection */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: darkMode ? '#fff' : '#000', marginBottom: '15px' }}>
                Select Feature
              </h3>
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    setSelectedFeature(feature.id);
                    setMessages([]);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: selectedFeature === feature.id ? '#3b82f6' : 'transparent',
                    color: darkMode ? '#fff' : '#000',
                    border: selectedFeature === feature.id ? 'none' : `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s'
                  }}
                >
                  {feature.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleNewChat}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              New Chat
            </button>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: darkMode ? '#111827' : '#fff'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: darkMode ? '#fff' : '#000'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 style={{ color: darkMode ? '#fff' : '#000' }}>
            {selectedFeatureObj?.name || 'Mind Pilot'}
          </h1>

          <div></div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: darkMode ? '#9ca3af' : '#6b7280',
              marginTop: '40px'
            }}>
              <p>Select a feature and start chatting!</p>
              {studentProfile && (
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  Your profile is loaded. I'll provide personalized recommendations based on your skills.
                </p>
              )}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: msg.role === 'user' ? '#3b82f6' : '#374151',
                  color: '#fff'
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))
          )}
          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              Mind Pilot is thinking...
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{
          padding: '15px',
          borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask Mind Pilot..."
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
              color: darkMode ? '#fff' : '#000'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
```

## Context Hook (Optional)

For managing user authentication state globally:

```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_profile');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

Use in App.jsx:

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your routes */}
    </AuthProvider>
  );
}
```

## Data Flow Diagram

```
┌─────────────┐
│   Student   │
│  Logs In    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  JWT Token Stored   │
│  in localStorage    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Select Mind Pilot Feature  │
│  (Skill, Interview, etc.)    │
└──────┬───────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  Send Message to Mind Pilot        │
│  + Auth Token                      │
│  + Student ID                      │
│  + Feature Type                    │
└──────┬─────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Backend (NestJS)                  │
│   - Validate JWT                    │
│   - Fetch Student Data              │
│   - Aggregate Skills from Activities│
│   - Build Student Profile           │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│   Python Backend                     │
│   - Process with AI/LLM              │
│   - Generate Response                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│   Response Display in Chat           │
│   - Personalized Recommendations     │
│   - Based on Student Skills          │
└──────────────────────────────────────┘
```

## Common Errors and Solutions

### 401 Unauthorized
- Token missing or expired
- Solution: Re-login or refresh token

### 400 Bad Request
- Invalid feature or missing message
- Solution: Check request body parameters

### Student not found
- User ID doesn't match any student
- Solution: Ensure user is logged in as a student

## Testing the Integration

```javascript
// Test in browser console
const token = localStorage.getItem('auth_token');

// Test skill profile
fetch('http://localhost:3000/mind-piolet/me/skills', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// Test chat
fetch('http://localhost:3000/mind-piolet/me/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'How can I improve?',
    feature: 'skill'
  })
})
.then(r => r.json())
.then(console.log);
```
