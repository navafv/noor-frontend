import React, { useState, useEffect } from 'react';
import api from '@/services/api.js'; // <-- UPDATED
import { Link } from 'react-router-dom';
import { ChevronRight, Inbox, Users, Loader2 } from 'lucide-react'; // <-- IMPORTED USERS, INBOX, LOADER2

/**
 * A list component for displaying enquiries on the admin dashboard.
 * Receives 'users' as a prop from its parent (AdminDashboard)
 */
function EnquiryList({ users }) { // <-- RECEIVE 'users' PROP
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError(null);
        // This GET request is now authenticated and only works for staff
        const response = await api.get('/enquiries/');
        setEnquiries(response.data.results); // 'results' is from DRF pagination
      } catch (err)
        {
        setError('Could not fetch enquiries. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []); // The empty array [] means this runs once when the component mounts

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin text-noor-pink" size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  if (enquiries.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
        <Inbox size={40} className="mx-auto text-gray-400" />
        <h3 className="mt-4 font-semibold text-gray-700">All caught up!</h3>
        <p className="mt-1 text-sm text-gray-500">There are no new enquiries.</p>
      </div>
    );
  }

  // The 'users' prop is now available and resolves the error
  // You can now use it for a filter dropdown, for example.

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-noor-heading flex items-center">
          <Users size={20} className="mr-3 text-noor-primary" />
          Manage Enquiries
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Review new enquiries and convert them to students.
        </p>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {enquiries.map((enquiry) => (
          <li key={enquiry.id}>
            <Link
              to={`/admin/enquiry/${enquiry.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-noor-primary">
                      {enquiry.name}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">{enquiry.phone}</span>
                    </p>
                  </div>
                  <div className="hidden md:block min-w-0 flex-1 px-4">
                     <p className="text-sm text-gray-900">{enquiry.course_interest}</p>
                     <p className="mt-1 text-sm text-gray-500">
                       {new Date(enquiry.created_at).toLocaleDateString()}
                     </p>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <span className={`status-badge status-${enquiry.status}`}>
                    {enquiry.status}
                  </span>
                </div>
                <div className="ml-5 shrink-0">
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnquiryList;