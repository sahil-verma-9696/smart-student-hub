import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Menu, X, Briefcase, TrendingUp, Book } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // 🎯 THEME COLORS
  const COLORS = {
    primary: '#3b82f6', // Blue
    emerald: '#10b981',
    indigo: '#6366f1',
    amber: '#f59e0b',
    orangeDark: '#d97706',
    red: '#ef4444',
    bgLight: '#f3f4f6',
    card: '#ffffff',
    textDark: '#4b5563',
    textGray: '#6b7280',
  };

  // API ROUTES
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
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          role:
            selectedFeature === 'roadmap' || selectedFeature === 'interview'
              ? role
              : null,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data?.result || '⚠ No response from backend.' },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Backend Error! Check server.' },
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
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: darkMode ? '#111827' : COLORS.bgLight,
        color: darkMode ? '#f9fafb' : COLORS.textDark,
        transition: '0.3s',
      }}
    >
      {/* ───────── SIDEBAR ───────── */}
      <div
        style={{
          width: sidebarOpen ? '260px' : '0',
          backgroundColor: darkMode ? '#1f2937' : COLORS.card,
          transition: '0.3s',
          overflow: 'hidden',
          boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
        }}
      >
        <h2
          style={{
            padding: '20px',
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.primary,
          }}
        >
          MindPilot
        </h2>

        <button
          onClick={handleNewChat}
          style={{
            width: '90%',
            margin: '0 auto 15px',
            padding: '12px',
            backgroundColor: COLORS.primary,
            color: 'white',
            borderRadius: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 10px rgba(59,130,246,0.4)',
          }}
        >
          + New Chat
        </button>

        {/* Feature Buttons */}
        <div style={{ padding: '0 10px', display: 'grid', gap: '12px' }}>
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => {
                setSelectedFeature(feature.id);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: `🧠 Switched to **${feature.name}** mode.`,
                  },
                ]);
              }}
              style={{
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor:
                  selectedFeature === feature.id
                    ? COLORS.indigo
                    : darkMode
                    ? '#374151'
                    : COLORS.card,
                color:
                  selectedFeature === feature.id
                    ? 'white'
                    : darkMode
                    ? '#e5e7eb'
                    : COLORS.textDark,
                borderRadius: '16px',
                cursor: 'pointer',
                border: 'none',
                fontWeight: '500',
                boxShadow:
                  selectedFeature === feature.id
                    ? '0 4px 12px rgba(99,102,241,0.4)'
                    : '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <feature.icon size={18} /> {feature.name}
            </button>
          ))}
        </div>
      </div>

      {/* ───────── MAIN AREA ───────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            padding: '14px 20px',
            backgroundColor: darkMode ? '#1f2937' : COLORS.card,
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h3
            style={{
              margin: 'auto',
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
            }}
          >
            {selectedFeatureObj ? selectedFeatureObj.name : 'Select a Feature'}
          </h3>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {darkMode ? '☀' : '🌙'}
          </button>
        </div>

        {/* ROLE INPUT */}
        {(selectedFeature === 'roadmap' || selectedFeature === 'interview') && (
          <div style={{ padding: '16px' }}>
            <input
              type="text"
              placeholder="Enter role (e.g., Frontend Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                background: darkMode ? '#374151' : COLORS.card,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                color: darkMode ? '#f9fafb' : COLORS.textDark,
              }}
            />
          </div>
        )}

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: '14px' }}
            >
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '75%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  backgroundColor:
                    msg.role === 'user' ? COLORS.primary : darkMode ? '#1f2937' : COLORS.card,
                  color: msg.role === 'user' ? 'white' : COLORS.textDark,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT BAR */}
        {selectedFeature && (
          <div
            style={{
              display: 'flex',
              padding: '14px',
              backgroundColor: darkMode ? '#1f2937' : COLORS.card,
              boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: darkMode ? '#374151' : '#fff',
                color: darkMode ? '#f9fafb' : COLORS.textDark,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: '10px',
                padding: '14px 16px',
                borderRadius: '16px',
                backgroundColor: COLORS.indigo,
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
