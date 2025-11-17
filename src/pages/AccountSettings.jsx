import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Lock, Save } from 'lucide-react';

const AccountSettings = () => {
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      await api.post('/users/me/set-password/', {
        old_password: passwords.old,
        new_password: passwords.new
      });
      toast.success("Password updated successfully");
      setPasswords({ old: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <Lock size={24} />
          </div>
          <h3 className="font-bold text-gray-800">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={passwords.old}
              onChange={e => setPasswords({...passwords, old: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={passwords.new}
              onChange={e => setPasswords({...passwords, new: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={passwords.confirm}
              onChange={e => setPasswords({...passwords, confirm: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center gap-2 mt-4"
          >
            {loading ? "Updating..." : <><Save size={18} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;