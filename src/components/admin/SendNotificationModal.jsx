import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import api from '../../services/api.js';

/**
 * A form for Admins to send bulk notifications.
 * This is rendered inside a Modal.
 *
 * Props:
 * - users: Array of all user objects
 * - roles: Array of all role objects
 * - onClose: Function to close the modal
 * - onSent: Function to call on success
 */
function SendNotificationModal({ users, roles, onClose, onSent }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    level: 'info',
    targetType: 'all', // 'all', 'role', 'user'
    user_id: '',
    role_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Construct payload based on targetType
    const payload = {
      title: formData.title,
      message: formData.message,
      level: formData.level,
    };

    if (formData.targetType === 'all') {
      payload.send_to_all = true;
    } else if (formData.targetType === 'role') {
      if (!formData.role_id) {
        setError('Please select a role.');
        setLoading(false);
        return;
      }
      payload.role_id = formData.role_id;
    } else if (formData.targetType === 'user') {
      if (!formData.user_id) {
        setError('Please select a user.');
        setLoading(false);
        return;
      }
      payload.user_id = formData.user_id;
    }

    try {
      await api.post('/notifications/send-bulk/', payload);
      onSent(); // Trigger success notification in parent
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div>
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text" name="title" id="title"
          value={formData.title} onChange={handleChange}
          className="form-input" required
        />
      </div>

      <div>
        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          name="message" id="message"
          value={formData.message} onChange={handleChange}
          className="form-input" rows="3" required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="level" className="form-label">Level</label>
          <select
            name="level" id="level"
            value={formData.level} onChange={handleChange}
            className="form-input" required
          >
            <option value="info">Info (Blue)</option>
            <option value="success">Success (Green)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="error">Error (Red)</option>
          </select>
        </div>
        <div>
          <label htmlFor="targetType" className="form-label">Send To</label>
          <select
            name="targetType" id="targetType"
            value={formData.targetType} onChange={handleChange}
            className="form-input" required
          >
            <option value="all">All Users</option>
            <option value="role">A Specific Role</option>
            <option value="user">A Specific User</option>
          </select>
        </div>
      </div>
      
      {/* Conditional Inputs */}
      {formData.targetType === 'role' && (
        <div>
          <label htmlFor="role_id" className="form-label">Role</label>
          <select
            name="role_id" id="role_id"
            value={formData.role_id} onChange={handleChange}
            className="form-input" required
          >
            <option value="" disabled>Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      )}
      {formData.targetType === 'user' && (
        <div>
          <label htmlFor="user_id" className="form-label">User</label>
          <select
            name="user_id" id="user_id"
            value={formData.user_id} onChange={handleChange}
            className="form-input" required
          >
            <option value="" disabled>Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name} ({user.username})</option>
            ))}
          </select>
        </div>
      )}
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            <Send size={18} className="mr-2" />
            Send Notification
          </>
        )}
      </button>
    </form>
  );
}

export default SendNotificationModal;