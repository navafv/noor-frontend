import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

function FeeReminderLogPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, status: filterStatus });
      const res = await api.get(`/finance/reminders/?${params.toString()}`);
      setReminders(res.data.results || []);
      setTotalPages(Math.ceil((res.data.count || 0) / 20));
    } catch (err) {
      toast.error('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [page, filterStatus]);

  return (
    <>
      <PageHeader title="Fee Reminder Log" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-6">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="form-input w-full md:w-1/3"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : reminders.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No reminders found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {reminders.map((r) => (
                  <li key={r.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{r.student_name}</p>
                      <p className="text-sm text-muted-foreground">{r.course_title}</p>
                      <p className="text-xs text-muted-foreground">{r.message}</p>
                    </div>
                    <div className="text-right">
                      <span className={`status-badge status-${r.status}`}>{r.status}</span>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(r.sent_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Add Pagination controls */}
          </div>
        </div>
      </main>
    </>
  );
}

export default FeeReminderLogPage;