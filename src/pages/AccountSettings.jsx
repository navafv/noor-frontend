import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- Profile Update Form ---
const ProfileForm = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const promise = api.patch('/users/me/', formData);
    
    try {
      const res = await toast.promise(promise, {
        loading: 'Updating profile...',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile.'
      });
      // --- NEW: Update the global user state ---
      setUser(prevUser => ({ ...prevUser, ...res.data }));
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Update Profile</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <FormInput label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

// --- Password Change Form ---
const PasswordForm = () => {
  const [formData, setFormData] = useState({ old_password: '', new_password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = api.post('/users/me/set-password/', formData);

    try {
      await toast.promise(promise, {
        loading: 'Changing password...',
        success: 'Password changed successfully!',
        error: (err) => err.response?.data?.old_password?.[0] || 'Failed to change password.'
      });
      setFormData({ old_password: '', new_password: '' }); // Reset form
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Change Password</h3>
      <div className="space-y-4">
        <FormInput label="Old Password" name="old_password" type="password" value={formData.old_password} onChange={handleChange} required />
        <FormInput label="New Password" name="new_password" type="password" value={formData.new_password} onChange={handleChange} required />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Set New Password'}
        </button>
      </div>
    </form>
  );
};

// Helper component
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);

// --- Main Page Component ---
function AccountSettings() {
  return (
    <>
      <PageHeader title="Account Settings" />
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileForm />
          <PasswordForm />
        </div>
      </main>
    </>
  );
}

export default AccountSettings;