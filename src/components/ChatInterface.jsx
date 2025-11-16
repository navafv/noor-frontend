import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ChatInterface({ conversationId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null); // For auto-scrolling

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages on load
  useEffect(() => {
    if (!conversationId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/conversations/${conversationId}/messages/`);
        setMessages(res.data.results || []);
      } catch (err) {
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    setIsSending(true);
    try {
      // Send the new message
      const res = await api.post(`/conversations/${conversationId}/messages/`, {
        body: newMessage,
      });
      // Add new message to state instantly
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-sm overflow-hidden md:h-[70vh]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          messages.map(msg => {
            const isSent = msg.sender === user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    isSent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.body}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {new Date(msg.sent_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="flex items-center p-4 border-t border-border bg-card"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="form-input flex-1"
          placeholder="Type your message..."
          disabled={isSending}
        />
        <button
          type="submit"
          className="btn-primary ml-2"
          disabled={isSending || newMessage.trim() === ''}
        >
          {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;