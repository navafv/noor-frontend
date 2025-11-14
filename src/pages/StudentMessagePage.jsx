import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api.js';
import { Loader2, MessageSquare } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';
import ChatInterface from '@/components/ChatInterface.jsx';

function StudentMessagePage() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // --- THIS IS THE FIX ---
      // The URL needs to be /conversations/my-conversation/
      const res = await api.get('/conversations/my-conversation/');
      // --- END FIX ---

      setConversation(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError('Failed to load conversation.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const handleSendMessage = async (messageText) => {
    if (!conversation) return;
    setSending(true);
    try {
      // Post to the nested endpoint
      const res = await api.post(`/conversations/${conversation.id}/messages/`, {
        body: messageText,
      });
      // Add new message to the list
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* PageHeader is hidden on desktop by ResponsiveLayout */}
      <div className="lg:hidden">
        <PageHeader title="Support Chat" />
      </div>
      
      {/* This outer div ensures the chat interface can take full height */}
      <div className="flex-1 overflow-hidden">
        {error && !loading ? (
          <div className="flex flex-col justify-center items-center h-full text-muted-foreground p-4">
            <MessageSquare size={40} />
            <p className="mt-4 font-semibold">Failed to load conversation</p>
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            loadingMessages={loading}
            sending={sending}
          />
        )}
      </div>
    </div>
  );
}

export default StudentMessagePage;