import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Matches backend PasswordResetRequestSerializer
      await api.post('/auth/password-reset/', { email });
      setIsSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to send link. Check email.");
      // For security, sometimes it's better not to reveal if email exists, 
      // but for this internal app, showing error is fine.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        
        <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-gray-600 mb-6 text-sm">
          <ArrowLeft size={16} className="mr-1"/> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-2">
            {isSent ? "Check your inbox for instructions." : "Enter your email to receive a reset link."}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-gray-50"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
            <button
              onClick={() => setIsSent(false)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
            >
              Try another email
            </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;