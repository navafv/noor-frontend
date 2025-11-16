import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Star, MessageSquare } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import Pagination from '../components/Pagination.jsx'; // <-- NEW

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5
          ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}
        `}
      />
    ))}
  </div>
);

function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // <-- Page state
  const [totalPages, setTotalPages] = useState(1); // <-- Total pages state

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page }); // <-- Use page param
        const res = await api.get(`/feedback/?${params.toString()}`);
        setFeedback(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / 20)); // <-- Set total pages
      } catch (err) {
        toast.error('Failed to load feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [page]); // <-- Refetch on page change

  return (
    <>
      <PageHeader title="Student Feedback" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : feedback.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No feedback submitted yet.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {feedback.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-foreground">{item.student_name}</p>
                      <StarRating rating={item.rating} />
                    </div>
                    <p className="text-sm font-medium text-primary">{item.batch_code}</p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{item.comments || 'No comment provided.'}"
                    </p>
                    <p className="text-xs text-muted-foreground text-right mt-2">{formatDate(item.submitted_at)}</p>
                  </li>
                ))}
              </ul>
            )}
            {/* --- NEW: Pagination --- */}
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminFeedbackPage;