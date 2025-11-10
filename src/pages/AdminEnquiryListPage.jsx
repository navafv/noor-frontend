import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import EnquiryList from '../components/EnquiryList.jsx';
import api from '@/services/api.js'; // Import api
import PageHeader from '@/components/PageHeader.jsx';

// This is now the "Manage Enquiries" screen
function AdminEnquiryListPage() {
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
    <div className="flex h-full flex-col">
      {/* Simple Header for Admin Pages */}
      <PageHeader title="Enquiry List" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-end mb-4">
            <Link to="/admin/enquiry/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Enquiry
            </Link>
          </div>
          
          <div className="card">
            {loading && (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}
            {error && <p className="form-error">{error}</p>}
            
            {!loading && !error && (
              // Pass the fetched users list to EnquiryList
              <EnquiryList users={users} /> 
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminEnquiryListPage;