// NEW CHATBOT UI (NO SIDEBAR)
// ✔ Always white theme
// ✔ MindPilot heading only
// ✔ Features shown above chat window
// ✔ Role field + message field at bottom

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Briefcase, TrendingUp, Book } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(false);

  const COLORS = {
    primary: '#3b82f6',
    indigo: '#6366f1',
    bgLight: '#f3f4f6',
    card: '#ffffff',
    textDark: '#4b5563',
  };

  const API_ROUTES = {
    skill: '/skill',
    roadmap: '/roadmap',
    interview: '/interview',
    'gap-finder': '/skill',
    guidance: '/skill',
  };

  const features = [
    { id: 'interview', name: 'Interview Preparation', icon: Briefcase },
    { id: 'skill', name: 'Skill Analysis', icon: TrendingUp },
    { id: 'roadmap', name: 'Roadmap Provider', icon: Book },
  ];

  const callBackendAPI = async (userMessage) => {
    setLoading(true);
    try {
      const endpoint = API_ROUTES[selectedFeature] || '/analyze';

      let userData = null;
      const mpUser = JSON.parse(localStorage.getItem('mp_user') || '{}');
      if (mpUser && Object.keys(mpUser).length > 0) userData = mpUser;
      else {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userDetails = JSON.parse(localStorage.getItem('user-details') || '{}');
        userData = storedUser && Object.keys(storedUser).length > 0 ? storedUser : userDetails;
      }

      if (!userData || Object.keys(userData).length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '⚠️ Please log in first to use Mind Pilot features.' },
        ]);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          role: selectedFeature === 'roadmap' || selectedFeature === 'interview' ? role : null,
          user: userData,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data?.result || data?.error || '⚠ No response from backend.' },
      ]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Backend Error! Check if Python server is running.' },
      ]);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedFeature) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    await callBackendAPI(input);
    setInput('');
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setRole('');
    setSelectedFeature(null);
  };

  const selectedFeatureObj = features.find((f) => f.id === selectedFeature);

  return (
    <div style={{ height: '100vh', backgroundColor: COLORS.bgLight, color: COLORS.textDark, display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '16px', backgroundColor: COLORS.card, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>MindPilot</h2>
        <button onClick={handleNewChat} style={{ marginTop: '10px', padding: '10px 14px', backgroundColor: COLORS.primary, color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
          + New Chat
        </button>
      </div>

      {/* FEATURE BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', padding: '10px', flexWrap: 'wrap', backgroundColor: COLORS.card }}>
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => {
              setSelectedFeature(feature.id);
              setMessages((prev) => [...prev, { role: 'assistant', content: `🧠 Switched to **${feature.name}** mode.` }]);
            }}
            style={{ padding: '10px 14px', backgroundColor: selectedFeature === feature.id ? COLORS.indigo : COLORS.card, color: selectedFeature === feature.id ? 'white' : COLORS.textDark, borderRadius: '12px', border: '1px solid #ddd', cursor: 'pointer' }}
          >
            {feature.name}
          </button>
        ))}
      </div>

      {/* CHAT WINDOW */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: '14px' }}>
            <div style={{ display: 'inline-block', maxWidth: '75%', padding: '14px 18px', borderRadius: '16px', backgroundColor: msg.role === 'user' ? COLORS.primary : COLORS.card, color: msg.role === 'user' ? 'white' : COLORS.textDark }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT + ROLE */}
      {selectedFeature && (
        <div style={{ display: 'flex', gap: '10px', padding: '14px', backgroundColor: COLORS.card }}>
          {(selectedFeature === 'roadmap' || selectedFeature === 'interview') && (
            <input type="text" placeholder="Enter role..." value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #ddd' }} />
          )}

          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid #ddd' }} />

          <button onClick={handleSendMessage} style={{ padding: '14px 16px', borderRadius: '16px', backgroundColor: COLORS.indigo, color: 'white', border: 'none', cursor: 'pointer' }}>
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
