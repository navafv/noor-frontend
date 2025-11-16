import React, { useState, useEffect } from 'react';
import Modal from '../Modal.jsx';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function SendNotificationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '', message: '', level: 'info'
  });
  const [targetType, setTargetType] = useState('all'); // 'all', 'role', 'user'
  const [targetId, setTargetId] = useState('');
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch roles for the dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        try {
          const res = await api.get('/roles/');
          setRoles(res.data.results || []);
        } catch (err) {
          toast.error('Failed to load roles list.');
        }
      };
      fetchRoles();
    }
  }, [isOpen]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let payload = { ...formData };
    if (targetType === 'all') {
      payload.send_to_all = true;
    } else if (targetType === 'role') {
      payload.role_id = parseInt(targetId);
    } else if (targetType === 'user') {
      payload.user_id = parseInt(targetId);
    }
    
    const promise = api.post('/notifications/send-bulk/', payload);

    try {
      await toast.promise(promise, {
        loading: 'Sending notification...',
        success: (res) => res.data.detail || 'Notification sent!',
        error: (err) => err.response?.data?.detail || 'Failed to send.'
      });
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send New Notification" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <FormTextarea label="Message" name="message" value={formData.message} onChange={handleChange} rows={4} required />
        
        <div className="grid grid-cols-2 gap-4">
          <FormSelect label="Level" name="level" value={formData.level} onChange={handleChange} required>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </FormSelect>
          
          <FormSelect label="Target" value={targetType} onChange={(e) => setTargetType(e.target.value)} required>
            <option value="all">All Users</option>
            <option value="role">Specific Role</option>
            <option value="user">Specific User ID</option>
          </FormSelect>
        </div>

        {targetType === 'role' && (
          <FormSelect label="Role" value={targetId} onChange={(e) => setTargetId(e.target.value)} required>
            <option value="">-- Select a role --</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </FormSelect>
        )}
        {targetType === 'user' && (
          <FormInput label="User ID" value={targetId} onChange={(e) => setTargetId(e.target.value)} type="number" required />
        )}

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Send Notification'}
        </button>
      </form>
    </Modal>
  );
}

// Helper components
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);
const FormTextarea = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <textarea id={props.name} {...props} className="form-input" />
  </div>
);
const FormSelect = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <select id={props.name} {...props} className="form-input">
      {children}
    </select>
  </div>
);

export default SendNotificationModal;