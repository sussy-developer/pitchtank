import { useState, useRef, useEffect } from 'react';

const quickActions = [
  { label: 'My AI Score', message: 'What is my AI score?' },
  { label: 'Investors', message: 'Show me interested investors' },
  { label: 'Improve Pitch', message: 'How can I improve my pitch?' },
  { label: 'Help', message: 'What can you help me with?' },
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm PitchBot — your AI copilot for PitchTank. Ask me about your score, investors, or how to improve your pitch!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: messageText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://ventures01.app.n8n.cloud/webhook-test/chatbot-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.text();
      let reply = data;

      try {
        const json = JSON.parse(data);
        reply = json.response || json.text || json.message || json.output || data;
      } catch (e) {
        // plain text response — use as-is
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Error: ' + error.message,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // FAB button — shown when chat is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 54, height: 54, borderRadius: '50%',
          background: '#2563eb', border: 'none',
          color: '#111827', fontSize: 24, cursor: 'pointer',
          zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        💬
      </button>
    );
  }

  // Chat window — shown when open
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      width: 350, height: 500,
      background: '#ffffff', borderRadius: 16,
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', zIndex: 9999,
      fontFamily: 'sans-serif', color: '#111827',
      border: '1px solid rgba(0,0,0,0.08)'
    }}>

      {/* Chat Window Header */}
      <div style={{
        background: '#3B82F6', padding: '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#ffffff', fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#1e3a5f', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>
            🤖
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>PitchBot AI</div>
            <div style={{ fontSize: 11, color: '#22c55e' }}>● Online</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none', border: 'none',
            color: '#8892b0', cursor: 'pointer', fontSize: 20,
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 12,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              background: msg.role !== 'user' ? '#f3f4f6' : '#3B82F6',
              color: msg.role !== 'user' ? '#111827' : '#ffffff',
              padding: '10px 14px', borderRadius: '12px',
              borderBottomLeftRadius: msg.role !== 'user' ? 0 : 12,
              borderBottomRightRadius: msg.role === 'user' ? 0 : 12,
              maxWidth: '85%', fontSize: 14,
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: '#2a3045', padding: '10px 14px',
              borderRadius: '14px 14px 14px 4px',
              fontSize: 13, color: '#8892b0',
            }}>
              typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions — only show at start */}
      {messages.length <= 2 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          padding: '8px 12px', borderTop: '1px solid #2a3045',
          flexShrink: 0,
        }}>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.message)}
              style={{
                fontSize: 11, padding: '5px 10px',
                background: '#1e2a40', border: '1px solid #2a3045',
                borderRadius: 20, color: '#8892b0',
                cursor: 'pointer',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px',
        borderTop: '1px solid rgba(0,0,0,0.08)', background: '#ffffff',
        flexShrink: 0,
        alignItems: 'center'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask me anything..."
          style={{
            flex: 1, background: '#f3f4f6', border: 'none',
            padding: '10px 14px', borderRadius: 20, color: '#111827',
            fontSize: 14, outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          style={{
            padding: '10px 16px', background: '#3B82F6',
            border: 'none', borderRadius: 20,
            color: '#ffffff', cursor: 'pointer', fontSize: 14, fontWeight: 'bold',
            opacity: (!input.trim() || isTyping) ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}