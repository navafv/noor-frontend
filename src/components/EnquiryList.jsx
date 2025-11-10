import React, { useState, useEffect } from 'react';
import api from '@/services/api.js'; // <-- UPDATED
import { Link } from 'react-router-dom';
import { ChevronRight, Inbox, Users, Loader2, User, Filter } from 'lucide-react'; // <-- IMPORTED USERS, INBOX, LOADER2

/**
 * A list component for displaying enquiries on the admin dashboard.
 * Receives 'users' as a prop from its parent (AdminDashboard)
 */
function EnquiryList({ users }) { // <-- RECEIVE 'users' PROP
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (statusFilter) params.status = statusFilter;
        // if (assignedToFilter) params.assigned_to = assignedToFilter; // Backend doesn't support this filter yet

        const response = await api.get('/enquiries/', { params });
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
  }, [statusFilter, assignedToFilter]); // Re-fetch when filters change

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Inbox size={20} className="mr-3 text-primary" />
          Enquiry List
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Review new enquiries and convert them to students.
        </p>
        
        {/* --- FILTERS --- */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label htmlFor="statusFilter" className="form-label">Status</label>
            <select 
              id="statusFilter" 
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {/* <div className="flex-1">
            <label htmlFor="assignedToFilter" className="form-label">Assigned To</label>
            <select 
              id="assignedToFilter" 
              className="form-input"
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
            >
              <option value="">All Staff</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
              ))}
            </select>
          </div> 
          */}
        </div>
      </div>
      
      {enquiries.length === 0 ? (
        <div className="text-center p-10">
          <Inbox size={40} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">No Enquiries Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">No enquiries match your current filters.</p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-border">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id}>
              <Link
                to={`/admin/enquiry/${enquiry.id}`}
                className="block hover:bg-accent"
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-primary">
                        {enquiry.name}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-muted-foreground">
                        <span className="truncate">{enquiry.phone}</span>
                      </p>
                    </div>
                    <div className="hidden md:block min-w-0 flex-1 px-4">
                       <p className="text-sm text-foreground">{enquiry.course_interest}</p>
                       <p className="mt-1 text-sm text-muted-foreground">
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
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EnquiryList;