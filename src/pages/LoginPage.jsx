import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
      // On success, loginUser now handles navigation
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="logo text-5xl text-noor-pink">
            Noor Stitching Institute
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-noor-heading">
            Staff & Student Login
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-md"
        >
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
            />
          </div>
          
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-noor-pink py-3 px-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-noor-pink-dark disabled:cursor-not-allowed disabled:bg-pink-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-medium text-noor-pink hover:underline">
            &larr; Back to Home Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;