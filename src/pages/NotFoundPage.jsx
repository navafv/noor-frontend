import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-xs">The page you are looking for does not exist or has been moved.</p>
      
      <Link to="/" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;