import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(username, password);
      // On success, loginUser now handles navigation via AuthContext
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="logo text-5xl text-primary">
            Noor Stitching Institute
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Staff & Student Login
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-lg bg-card p-8 shadow-md border border-border"
        >
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="form-label"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="form-label"
              >
                Password
              </label>
              {/* --- NEW LINK --- */}
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          <Link to="/home" className="font-medium text-primary hover:underline">
            &larr; Back to Home Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;