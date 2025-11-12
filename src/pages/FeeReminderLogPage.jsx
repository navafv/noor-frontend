import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Send, Check, X, AlertCircle } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';

/**
 * Page for viewing the log of all fee reminders.
 * Admin-only feature.
 */
function FeeReminderLogPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        status: statusFilter || undefined,
      };

      const response = await api.get('/finance/reminders/', { params });
      setReminders(response.data.results || []);
    } catch (err) {
      setError('Could not fetch reminder log.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={16} className="text-green-500 shrink-0" />;
      case 'failed':
        return <X size={16} className="text-red-500 shrink-0" />;
      case 'pending':
      default:
        return <Send size={16} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Fee Reminder Log" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          
          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
                <select 
                  name="status" 
                  id="statusFilter" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  className="form-input"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && reminders.length === 0 && (
            <div className="text-center p-10 card">
              <Send size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Reminders Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No reminders match your filters.
              </p>
            </div>
          )}

          {/* Reminders List */}
          {!loading && !error && reminders.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {reminders.map((r) => (
                  <li key={r.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(r.status)}
                      <div className="grow">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">{r.student_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.sent_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {r.course_title}
                        </p>
                        <p className="text-sm text-foreground mt-2 italic">
                          "{r.message}"
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FeeReminderLogPage;