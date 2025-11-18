import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark_all_read/');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("All marked as read");
    } catch (e) { toast.error("Action failed"); }
  };

  const markOneRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark_read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-primary-600 text-xs font-bold flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg cursor-pointer">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : 
         notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-gray-100">
                <Bell size={48} className="mx-auto mb-3 text-gray-200"/>
                <p>No notifications</p>
            </div>
         ) : 
         notifications.map(notif => (
            <div 
                key={notif.id} 
                onClick={() => !notif.read && markOneRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all ${notif.read ? 'bg-white border-gray-100 text-gray-500' : 'bg-white border-primary-200 shadow-sm text-gray-900'}`}
            >
                <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.read ? 'bg-gray-200' : 'bg-primary-500'}`} />
                    <div>
                        <h3 className={`font-bold text-sm ${notif.read ? 'font-medium' : ''}`}>{notif.title}</h3>
                        <p className="text-sm mt-1 opacity-90 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] mt-2 opacity-50">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;