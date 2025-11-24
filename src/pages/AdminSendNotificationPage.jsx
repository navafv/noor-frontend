import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Users, Megaphone } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdminSendNotificationPage = () => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
        return toast.error("Please enter title and message");
    }

    setIsSending(true);
    try {
      // Backend Broadcast Endpoint: Targets students with active enrollments
      const res = await api.post('/notifications/broadcast_active/', {
          title: formData.title,
          message: formData.message
      });
      toast.success(res.data.message || "Broadcast sent successfully!");
      navigate(-1); 
    } catch (error) {
      toast.error("Failed to send: " + (error.response?.data?.detail || "Unknown error"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
          <Megaphone className="w-6 h-6 mr-2 text-primary-600" />
          Broadcast Notification
        </h1>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mb-6">
            <Users className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="font-semibold text-blue-900 text-sm">Audience: Active Students Only</h4>
                <p className="text-xs text-blue-700 mt-1">
                    This message will be sent to all students who currently have an "Active" enrollment in any course.
                </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all"
              placeholder="Important Announcement..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none resize-none transition-all"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center shadow-md active:scale-[0.99]"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending Broadcast...
              </>
            ) : (
              "Send Broadcast"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSendNotificationPage;