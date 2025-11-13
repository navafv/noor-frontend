import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import { Loader2, KeyRound, Save, Upload } from 'lucide-react'; 

// ... (ChangePhotoForm component is unchanged) ...
function ChangePhotoForm() {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a photo to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await api.patch('/students/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Photo updated successfully!');
      setUser(prevUser => ({
        ...prevUser,
        student: {
          ...prevUser.student,
          photo: response.data.photo 
        }
      }));
      setFile(null);
      setPreview(null);
      
    } catch (err) {
      setError(err.response?.data?.photo?.[0] || 'Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mt-8">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
        <Upload size={20} className="mr-3 text-primary" />
        Change Profile Photo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="photo" className="form-label">Select Photo</label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        {preview && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">New Photo Preview:</p>
            <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-border" />
          </div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={loading || !file}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Upload Photo'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ... (ChangePasswordForm component is unchanged) ...
function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
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
      await api.post('/users/me/set-password/', formData);
      setSuccess('Password changed successfully!');
      setFormData({ old_password: '', new_password: '' });
    } catch (err) {
      setError(err.response?.data?.old_password?.[0] || err.response?.data?.new_password?.[0] || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mt-8">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
        <KeyRound size={20} className="mr-3 text-primary" />
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="old_password" className="form-label">Old Password</label>
          <input
            type="password"
            name="old_password"
            id="old_password"
            value={formData.old_password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="new_password" className="form-label">New Password</label>
          <input
            type="password"
            name="new_password"
            id="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

function AccountSettings() {
  const { user, setUser } = useAuth(); 
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
      const response = await api.patch(`/users/${user.id}/`, formData);
      
      setUser(prevUser => ({
        ...prevUser, 
        ...response.data 
      }));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-20"> 
      <PageHeader title="Account Settings" />
      
      {/* Profile Info Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Profile Information
        </h2>
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
            {loading ? <Loader2 className="animate-spin" /> : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* --- RENDER PHOTO FORM (only for students) --- */}
      {/* --- SIMPLIFIED CHECK --- */}
      {user && !user.is_staff && <ChangePhotoForm />}

      {/* --- PASSWORD FORM --- */}
      <ChangePasswordForm />
    </div>
  );
}

export default AccountSettings;