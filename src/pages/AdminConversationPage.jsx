import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api.js';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';
import ChatInterface from '@/components/ChatInterface.jsx';

function AdminConversationPage() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both conversation details (for name) and message list
      const [convoRes, messagesRes] = await Promise.all([
        api.get(`/conversations/${conversationId}/`),
        api.get(`/conversations/${conversationId}/messages/`)
      ]);
      
      setConversation(convoRes.data);
      setMessages(messagesRes.data.results || []);
    } catch (err) {
      setError('Failed to load conversation.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (messageText) => {
    setSending(true);
    try {
      const res = await api.post(`/conversations/${conversationId}/messages/`, {
        body: messageText,
      });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={conversation ? `Chat with ${conversation.student_name}` : 'Loading Chat...'} />
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          loadingMessages={loading}
          sending={sending}
        />
      </div>
      {error && <p className="form-error text-center p-2">{error}</p>}
    </div>
  );
}

export default AdminConversationPage;