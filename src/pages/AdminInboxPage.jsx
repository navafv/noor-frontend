import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Inbox, ChevronRight, Circle } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';

function AdminInboxPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetches all conversations (admin privilege)
      const res = await api.get('/conversations/');
      setConversations(res.data.results || []);
    } catch (err) {
      setError('Could not load conversations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Student Messages" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && conversations.length === 0 && (
            <div className="text-center p-10 card">
              <Inbox size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">Inbox is Empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                When a student sends a message, it will appear here.
              </p>
            </div>
          )}

          {!loading && !error && conversations.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {conversations.map((convo) => (
                  <li key={convo.id}>
                    <Link
                      to={`/admin/messages/${convo.id}`}
                      className="block hover:bg-accent"
                    >
                      <div className="flex items-center p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {!convo.admin_read && (
                              <Circle size={10} className="text-blue-500 fill-blue-500" />
                            )}
                            <p className="font-semibold text-foreground">{convo.student_name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{convo.student_reg_no}</p>
                          <p className="text-sm text-muted-foreground italic mt-1 truncate">
                            {convo.last_message_preview || 'No messages yet.'}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminInboxPage;