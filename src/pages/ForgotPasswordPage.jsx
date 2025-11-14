import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api.js';
import { Loader2, Mail } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // This hits /api/v1/auth/password-reset/
      const response = await api.post('/auth/password-reset/', { email });
      setSuccess(response.data.detail);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'An error occurred. Please try again.');
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
            Reset Password
          </h2>
          <p className="mt-2 text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-lg bg-card p-8 shadow-md border border-border"
        >
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              {success}
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || success} // Disable after success
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:underline">
            &larr; Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;