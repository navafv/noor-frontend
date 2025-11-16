import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // This hits /api/v1/auth/password-reset-confirm/
      const payload = {
        uidb64: uid,
        token: token,
        new_password: formData.new_password,
      };
      const response = await api.post('/auth/password-reset-confirm/', payload);
      setSuccess(true);
      toast.success(response.data.detail);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.[0] || 'Invalid or expired link. Please request a new one.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="logo text-5xl text-primary">
            Noor Stitching Institute
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Set New Password
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-lg bg-card p-8 shadow-md border border-border"
        >
          {/* Error/Success is now handled by toast */}
          
          {!success && (
            <>
              <div className="space-y-1">
                <label htmlFor="new_password" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="confirm_password" className="form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Set New Password'}
              </button>
            </>
          )}

          {success && (
            <p className="text-center text-muted-foreground">
              Your password has been reset. Redirecting you to login...
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;