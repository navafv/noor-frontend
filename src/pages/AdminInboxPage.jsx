import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Inbox, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
};

function AdminInboxPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/conversations/');
        setConversations(res.data.results || []);
      } catch (err) {
        toast.error('Failed to load inbox.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <>
      <PageHeader title="Support Inbox" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : conversations.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No conversations found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {conversations.map((convo) => (
                  <li 
                    key={convo.id}
                    onClick={() => navigate(`/admin/messages/${convo.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-accent cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{convo.student_name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {convo.last_message_preview || 'No messages yet.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {!convo.admin_read && (
                          <span className="status-badge status-new">Unread</span>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(convo.last_message_at)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminInboxPage;