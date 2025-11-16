import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ChatInterface from '../components/ChatInterface.jsx';

function AdminConversationPage() {
  const { conversationId } = useParams();

  return (
    <>
      {/* The PageHeader is hidden on mobile by the ChatInterface,
          but visible on desktop.
       */}
      <div className="hidden md:block">
        <PageHeader title="Conversation" />
      </div>

      {/* The ChatInterface component takes the full height on mobile */}
      <main className="p-0 md:p-8 h-full md:h-auto md:max-w-4xl md:mx-auto">
        <ChatInterface conversationId={conversationId} />
      </main>
    </>
  );
}

export default AdminConversationPage;