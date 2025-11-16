import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import { Loader2, MessageSquare } from 'lucide-react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';

function StudentMessagePage() {
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getConversation = async () => {
      try {
        setLoading(true);
        // This endpoint gets or creates the student's dedicated conversation
        const res = await api.get('/conversations/my-conversation/');
        setConversationId(res.data.id);
      } catch (err) {
        console.error("Failed to get chat conversation:", err);
        toast.error('Could not connect to support chat.');
      } finally {
        setLoading(false);
      }
    };
    getConversation();
  }, []);

  return (
    <>
      {/* The PageHeader is hidden on mobile by the ChatInterface's
        full-screen layout, which is intended.
      */}
      <div className="hidden md:block">
        <PageHeader title="Support Chat" />
      </div>

      <main className="p-0 md:p-8 h-full md:h-auto md:max-w-4xl md:mx-auto">
        {loading ? (
          <div className="flex flex-col h-full items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p>Connecting to chat...</p>
          </div>
        ) : conversationId ? (
          <ChatInterface conversationId={conversationId} />
        ) : (
          <div className="flex flex-col h-full items-center justify-center p-8 text-destructive">
            <MessageSquare className="mb-4" size={40} />
            <p>Could not load chat.</p>
            <p>Please try again later.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default StudentMessagePage;