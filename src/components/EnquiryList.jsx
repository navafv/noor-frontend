import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Inbox, ChevronRight, Phone } from 'lucide-react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * A reusable component to list enquiries.
 * @param {number} [limit] - Max number of items to show (for dashboard).
 * @param {string} [status] - Default status filter (e.g., "new").
 * @param {boolean} [showPagination=false] - Show pagination controls.
 * @param {boolean} [showFilters=false] - Show status filter tabs.
 */
function EnquiryList({ limit, status, showPagination = false, showFilters = false }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState(status || '');
  
  const navigate = useNavigate();

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'New', value: 'new' },
    { label: 'Follow Up', value: 'follow_up' },
    { label: 'Converted', value: 'converted' },
    { label: 'Closed', value: 'closed' },
  ];

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page,
          status: filterStatus,
        });
        if (limit) {
          params.append('page_size', limit);
        }

        const res = await api.get(`/enquiries/?${params.toString()}`);
        setEnquiries(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / (limit || 20))); 
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
        toast.error('Failed to load enquiries.');
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [page, filterStatus, limit]);

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Filter Tabs */}
      {showFilters && (
        <div className="p-4 border-b border-border">
          <nav className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilterStatus(tab.value);
                  setPage(1); // Reset to first page
                }}
                className={`px-3 py-1 text-sm font-medium rounded-full
                  ${filterStatus === tab.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground">
          <Inbox size={48} className="mx-auto mb-4" />
          <p>No enquiries found.</p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-border">
          {enquiries.map((enquiry) => (
            <li 
              key={enquiry.id}
              onClick={() => navigate(`/admin/enquiry/${enquiry.id}`)}
              className="block hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center p-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary">
                    {enquiry.name}
                  </p>
                  <p className="mt-1 flex items-center text-sm text-muted-foreground">
                    <Phone size={16} className="mr-2" />
                    {enquiry.phone}
                  </p>
                </div>
                <div className="ml-4 shrink-0 flex flex-col items-end gap-1">
                  <span className={`status-badge status-${enquiry.status}`}>
                    {enquiry.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(enquiry.created_at)}
                  </span>
                </div>
                <div className="ml-4 shrink-0">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline btn-sm"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default EnquiryList;