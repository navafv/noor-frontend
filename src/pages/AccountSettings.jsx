import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Lock, User, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccountSettings = () => {
  const { user: authUser } = useAuth(); // Get initial user from context
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Password State
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  useEffect(() => {
    if (authUser) {
      setProfile({
        first_name: authUser.first_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || '',
      });
      // Note: Backend usually sends full URL for photo in student_details if it exists
      if (authUser.student_details?.photo) {
        setPreviewUrl(authUser.student_details.photo);
      }
    }
  }, [authUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update User Basic Info
      await api.patch('/users/me/', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        address: profile.address
      });

      // 2. Update Photo (If Student and file selected)
      if (photoFile && !authUser.is_staff) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await api.patch('/students/students/me/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success("Profile updated successfully");
      // Ideally reload window or re-fetch auth context here
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await api.post('/users/me/set-password/', {
        old_password: passwords.old,
        new_password: passwords.new
      });
      toast.success("Password changed");
      setPasswords({ old: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      {/* Tabs */}
      <div className="flex p-1 bg-gray-200 rounded-xl">
        <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
            Profile
        </button>
        <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
            Security
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        {activeTab === 'profile' ? (
            <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Photo Upload (Only for students usually, but available logic is there) */}
                {!authUser.is_staff && (
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-24 h-24 mb-2">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-primary-50" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-400">
                                    <User size={40} />
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-gray-800 transition-colors">
                                <Camera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">Tap camera to upload</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                        <input className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                        <input className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                    <input className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                    <textarea rows="2" className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all flex justify-center">
                    {loading ? <Loader2 className="animate-spin"/> : 'Save Changes'}
                </button>
            </form>
        ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                    <div className="relative">
                        <input type="password" required className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} />
                        <Lock size={18} className="absolute right-3 top-4 text-gray-400" />
                    </div>
                </div>
                <div className="pt-2 border-t border-gray-100"></div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                    <input type="password" required className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
                    <input type="password" required className="w-full p-3 mt-1 rounded-xl border border-gray-200 outline-none focus:border-primary-500" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all flex justify-center">
                    {loading ? <Loader2 className="animate-spin"/> : 'Update Password'}
                </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;