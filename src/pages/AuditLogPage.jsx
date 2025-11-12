import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, History, PlusCircle, Edit2, Trash2 } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';

/**
 * A reusable page to display the history log for any model.
 * Props:
 * - modelName: (string) The display name (e.g., "Student")
 * - endpoint: (string) The API endpoint (e.g., "/history/students/")
 */
function AuditLogPage({ modelName, endpoint }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      setItems(response.data.results || []);
    } catch (err) {
      setError(`Could not fetch ${modelName} history.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, modelName]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getHistoryIcon = (type) => {
    switch (type) {
      case '+': return <PlusCircle size={16} className="text-green-500 shrink-0" />;
      case '~': return <Edit2 size={16} className="text-yellow-500 shrink-0" />;
      case '-': return <Trash2 size={16} className="text-red-500 shrink-0" />;
      default: return <History size={16} className="text-muted-foreground shrink-0" />;
    }
  };
  
  const getHistoryAction = (type) => {
    switch (type) {
      case '+': return "Created";
      case '~': return "Changed";
      case '-': return "Deleted";
      default: return "N/A";
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={`${modelName} Audit Log`} />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && items.length === 0 && (
            <div className="text-center p-10 card">
              <History size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No History Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No changes have been logged for this model yet.
              </p>
            </div>
          )}

          {/* History List */}
          {!loading && !error && items.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.history_id} className="p-4">
                    <div className="flex items-start gap-3">
                      {getHistoryIcon(item.history_type)}
                      <div className="grow">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">
                            {getHistoryAction(item.history_type)}: {item.username || item.reg_no || 'Record'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.history_date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Changed by: <strong>{item.history_user_name || 'System'}</strong>
                        </p>
                        {item.history_change_reason && (
                          <p className="text-sm text-foreground mt-2 italic">
                            Reason: "{item.history_change_reason}"
                          </p>
                        )}
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

export default AuditLogPage;