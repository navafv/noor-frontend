import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

/**
 * A reusable chat interface component.
 *
 * Props:
 * - messages: (array) List of message objects.
 * - onSendMessage: (function) A function that takes (messageText) and sends it.
 * - loadingMessages: (boolean) True if messages are currently being fetched.
 * - sending: (boolean) True if a message is currently being sent.
 */
function ChatInterface({ messages, onSendMessage, loadingMessages, sending }) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await onSendMessage(newMessage);
    setNewMessage(''); // Clear input after successful send
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.sender === user.id} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-input flex-1"
            placeholder="Type your message..."
            disabled={sending}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}

// Internal component for the chat bubble
const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div 
      className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
        isOwn 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}
    >
      <p className="text-sm">{message.body}</p>
      <p className={`text-xs opacity-70 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
        {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

export default ChatInterface;