import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import BackButton from '@/components/BackButton.jsx';
import { Loader2 } from 'lucide-react';

function AccountSettings() {
  const { user, setUser } = useAuth(); // Get user and the setter
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Users update their own profile via /api/v1/users/{user.id}/
      const response = await api.patch(`/users/${user.id}/`, formData);
      
      // Update the user in the global context
      setUser(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <PageHeader title="My Account" />
      <h1 className="text-2xl font-bold text-noor-heading mb-6">
        Account Settings
      </h1>
      
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm space-y-4">
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="address" className="form-label">Address</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            rows="3"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountSettings;