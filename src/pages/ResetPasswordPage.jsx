import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    
    setIsSubmitting(true);
    try {
      await api.post('/auth/password-reset-confirm/', {
        uidb64: uid,
        token: token,
        new_password: password
      });
      toast.success("Password reset successful! Please login.");
      navigate('/login');
    } catch (error) {
      toast.error("Invalid or expired link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-200 outline-none bg-gray-50"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-200 outline-none bg-gray-50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition-all flex justify-center items-center disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;