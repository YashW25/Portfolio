import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../../store/useChatStore';
import './SammChatbot.css';

const SUGGESTIONS = [
  "Who is Yash Warulkar?",
  "Tell me about Innovara Dynamics.",
  "What projects have you built?",
  "I want to hire you."
];

export default function SammChatbot() {
  const { isOpen, setIsOpen, messages, addMessage, updateLastMessage, clearHistory, sessionId } = useChatStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (messages.length > 0) {
      timeout = setTimeout(() => {
        clearHistory();
      }, 60000); // 1 minute
    }
    return () => clearTimeout(timeout);
  }, [messages, clearHistory]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    // Add User Message
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    });

    setInput('');
    setIsTyping(true);

    // Add Empty Assistant Message to stream into
    const assistantMsgId = crypto.randomUUID();
    addMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsTyping(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                updateLastMessage(fullText);
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
          boundary = buffer.indexOf('\n\n');
        }
      }
    } catch (err) {
      console.error(err);
      updateLastMessage("I'm sorry, I encountered an error connecting to the server.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="samm-fab" onClick={() => setIsOpen(true)}>
        <MessageCircle size={28} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`samm-window ${isMaximized ? 'maximized' : ''}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="samm-header">
              <div className="samm-header-title">
                <div className="samm-avatar">S</div>
                <div>
                  <h3>SAMM</h3>
                  <span>AI Assistant by Yash</span>
                </div>
              </div>
              <div className="samm-header-actions">
                <button onClick={clearHistory} title="Clear Chat"><Trash2 size={16}/></button>
                <button onClick={() => setIsMaximized(!isMaximized)}>
                  {isMaximized ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                <button onClick={() => setIsOpen(false)}><X size={20}/></button>
              </div>
            </div>

            <div className="samm-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`samm-msg-wrapper ${msg.role}`}>
                  <div className={`samm-msg ${msg.role}`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || '...'}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="samm-msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="samm-msg-wrapper assistant">
                  <div className="samm-msg assistant typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="samm-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} disabled={isTyping}>
                  {s}
                </button>
              ))}
            </div>

            <div className="samm-input-area">
              <input 
                type="text" 
                placeholder="Ask SAMM anything..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
