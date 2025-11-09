import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import EnquiryList from '../components/EnquiryList';
import api from '@/services/api.js'; // Import api

// This is now the "Manage Enquiries" screen
function AdminDashboard() {
  const [users, setUsers] = useState([]); // <-- State for users
  const [loading, setLoading] = useState(true); // <-- Loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch staff users for the filter dropdown
    const fetchStaffUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // This endpoint is from your backend: /api/v1/users/
        const response = await api.get('/users/', { params: { is_staff: true } });
        setUsers(response.data.results || []);
      } catch (err) {
        setError('Could not load staff user list.');
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffUsers();
  }, []); // Run once on component mount

  return (
    <div className="flex h-screen flex-col">
      {/* Simple Header for Admin Pages */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-lg items-center px-4">
          <Link
            to="/account"
            className="flex items-center gap-1 text-noor-pink"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Account</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-lg">
          {/*
            This div wrapper below was missing in your original file, 
            but it was present in the EnquiryList component's file. 
            I am adding it here to be consistent.
          */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            {/* --- THIS IS THE FIX --- */}
            {/* Show loading or error, otherwise render EnquiryList
                and pass the 'users' prop it needs. */}
            {loading && (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="animate-spin text-noor-pink" size={32} />
              </div>
            )}
            {error && <p className="form-error">{error}</p>}
            
            {!loading && !error && (
              // Pass the fetched users list to EnquiryList
              <EnquiryList users={users} /> 
            )}
            {/* --- END OF FIX --- */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;