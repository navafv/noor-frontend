import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/notifications/');
        const unread = (res.data.results || []).filter(n => !n.read).length;
        setCount(unread);
      } catch (e) { console.error(e); }
    };
    fetchCount();
    // Optional: Poll every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" className="p-2 relative text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
      <Bell size={22} />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;