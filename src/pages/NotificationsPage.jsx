import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx'; // <-- UPDATED
import api from '@/services/api.js'; // <-- UPDATED
import { Bell, CheckCheck } from 'lucide-react';
function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      // Don't fetch if user isn't logged in
      setLoading(false);
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/');
        setNotifications(response.data.results || []);
      } catch (err) {
        setError('Could not load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]); // Re-fetch when user logs in

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-noor-heading mb-4">
        Updates & Notifications
      </h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!user && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p>Please <Link to="/login" className="text-noor-pink font-medium">log in</Link> to see your notifications.</p>
        </div>
      )}

      {user && notifications.length === 0 && !loading && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p>You have no new notifications.</p>
        </div>
      )}

      {user && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-noor-pink">
              <h3 className="font-bold text-noor-heading">{notif.title}</h3>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notif.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;