import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader.jsx';
import api from '@/services/api.js';
import { Loader2, BellOff, Check } from 'lucide-react';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications/'); //
      setNotifications(res.data.results || []);
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      await api.patch(`/notifications/${id}/`, { is_read: true }); // FIX: Standard patch
    } catch (err) {
      // Revert if error
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      );
      console.error('Failed to mark as read');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <PageHeader title="Notifications" />

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      {!loading && (
        <div className="card">
          {notifications.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              <BellOff size={40} className="mx-auto" />
              <p className="mt-4 font-semibold">No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map(n => (
                <li key={n.id} className={`p-4 ${n.is_read ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`font-semibold ${
                        n.level === 'warning' ? 'text-yellow-600' 
                        : n.level === 'error' ? 'text-red-600' 
                        : 'text-foreground'
                      }`}>{n.title}</span>
                      <p className="text-muted-foreground text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="ml-4 p-2 text-sm text-primary hover:bg-accent rounded-full"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;