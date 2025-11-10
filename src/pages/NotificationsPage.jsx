import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton.jsx';
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
      await api.patch(`/notifications/${id}/mark_as_read/`);
    } catch (err) {
      // Revert if error
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      );
      console.error('Failed to mark as read');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-noor-heading mb-6">Notifications</h1>

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin text-noor-pink" size={32} />
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-xl shadow-sm">
          {notifications.length === 0 ? (
            <div className="text-center p-10 text-gray-500">
              <BellOff size={40} className="mx-auto" />
              <p className="mt-4 font-semibold">No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map(n => (
                <li key={n.id} className={`p-4 ${n.is_read ? 'opacity-60' : 'font-semibold'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-noor-heading">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="ml-4 p-2 text-sm text-noor-pink hover:bg-noor-pink/10 rounded-full"
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