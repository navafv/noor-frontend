import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, History } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import Pagination from '../components/Pagination.jsx'; // <-- NEW

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

const getHistoryTypeClass = (type) => {
  if (type === '+') return 'status-completed'; // Create
  if (type === '~') return 'status-active';   // Update
  if (type === '-') return 'status-closed';   // Delete
  return 'status-pending';
};
const getHistoryTypeLabel = (type) => {
  if (type === '+') return 'Created';
  if (type === '~') return 'Updated';
  if (type === '-') return 'Deleted';
  return type;
};

function AuditLogPage({ modelName, endpoint }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // <-- Page state
  const [totalPages, setTotalPages] = useState(1); // <-- Total pages state

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page });
        const res = await api.get(`${endpoint}?${params.toString()}`);
        setLogs(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / 20));
      } catch (err) {
        toast.error(`Failed to load ${modelName} history.`);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, endpoint, modelName]);

  return (
    <>
      <PageHeader title={`${modelName} Audit Log`} />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : logs.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No audit logs found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {logs.map((log) => (
                  <li key={log.history_id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {/* Dynamically show relevant field */}
                        {modelName} {log.reg_no || log.username || `ID ${log.id}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Changed by: {log.history_user_name || 'System'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.history_change_reason || 'No reason provided'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`status-badge ${getHistoryTypeClass(log.history_type)}`}>
                        {getHistoryTypeLabel(log.history_type)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(log.history_date)}</p>
                    </div>
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

export default AuditLogPage;