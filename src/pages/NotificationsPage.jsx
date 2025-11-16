import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Bell, Send, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import SendNotificationModal from '../components/admin/SendNotificationModal.jsx';

// Map backend levels to icons and colors
const levelIcons = {
  info: { Icon: Info, color: 'text-blue-500' },
  success: { Icon: CheckCircle, color: 'text-green-500' },
  warning: { Icon: AlertTriangle, color: 'text-yellow-500' },
  error: { Icon: XCircle, color: 'text-red-500' },
};

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // This endpoint is automatically filtered by user
      const res = await api.get('/notifications/');
      setNotifications(res.data.results || []);
    } catch (err) {
      toast.error('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    // We'll just DELETE the notification, which is simpler
    try {
      await api.delete(`/notifications/${id}/`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification cleared.');
    } catch (err) {
      toast.error('Failed to clear notification.');
    }
  };

  return (
    <>
      <PageHeader title="Notifications">
        {user?.is_staff && (
          <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Send size={18} />
            Send Notification
          </button>
        )}
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : notifications.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">You have no unread notifications.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {notifications.map((n) => {
                  const { Icon, color } = levelIcons[n.level] || levelIcons.info;
                  return (
                    <li key={n.id} className="p-4 flex items-start gap-4">
                      <Icon className={`w-6 h-6 ${color} shrink-0 mt-1`} />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                      </div>
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="btn-outline btn-sm"
                      >
                        <Check size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>

      {user?.is_staff && (
        <SendNotificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default NotificationsPage;