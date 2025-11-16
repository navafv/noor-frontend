import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { Loader2, Save, User } from 'lucide-react'; // <-- NEW
import { toast } from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'; // <-- NEW

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

// --- NEW: Profile Photo Form (Students Only) ---
const ProfilePhotoForm = () => {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    // This PATCHs the /api/v1/students/me/ endpoint
    const promise = api.patch('/students/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    try {
      const res = await toast.promise(promise, {
        loading: 'Uploading photo...',
        success: 'Profile photo updated!',
        error: 'Failed to upload photo.',
      });

      // Update student photo in auth context
      setUser(prevUser => ({
        ...prevUser,
        student: { ...prevUser.student, photo: res.data.photo },
      }));
      setFile(null); // Clear file input
    } catch (err) {
      /* handled by toast */
    } finally {
      setIsLoading(false);
    }
  };

  const photoUrl = user.student?.photo ? `${BACKEND_URL}${user.student.photo}` : null;

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Update Profile Photo</h3>
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <span className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </span>
        )}
        <div className="flex-1">
          <FormInput label="Upload new photo" name="photo" type="file" onChange={handleFileChange} accept="image/*" />
        </div>
      </div>
      <button type="submit" className="btn-primary mt-4" disabled={isLoading || !file}>
        {isLoading ? <Loader2 className="animate-spin" /> : 'Save Photo'}
      </button>
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
  const { user } = useAuth(); // <-- NEW
  const isStudent = !user.is_staff; // <-- NEW

  return (
    <>
      <PageHeader title="Account Settings" />
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileForm />
          {isStudent && <ProfilePhotoForm />} {/* <-- NEW: Conditionally render for students */}
          <PasswordForm />
        </div>
      </main>
    </>
  );
}

export default AccountSettings;