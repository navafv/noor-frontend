import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminSendNotificationPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data.results || []);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post('/notifications/', formData);
      alert("Notification sent successfully!");
      navigate(-1); // Go back
    } catch (error) {
      alert("Failed to send notification: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Send className="w-6 h-6 mr-2 text-primary" />
          Send Notification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>
            {isLoadingUsers && <p className="text-xs text-gray-500 mt-1">Loading users...</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Important Update..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={isSending || isLoadingUsers}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSendNotificationPage;